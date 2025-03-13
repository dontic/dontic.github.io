---
author: Daniel Garcia
pubDatetime: 2024-10-15T15:07:17Z
modDatetime: 2025-03-12T12:00:00Z
title: 'Centralize and visualize Docker logs in Grafana with Loki'
featured: false
draft: false
category: tech
tags:
  - WebDev
  - Docker
  - Grafana
  - Loki
description: 'Learn how to centralize and visualize Docker logs in Grafana with Loki with a easy step by step guide'
ogImage: /src/content/blog/centralize-and-visualize-docker-logs-in-grafana-with-loki/cover.png
---

## Introduction

I've previously written about how to centralize and visualize logs in Grafana with Loki for apps that write logs to files [here](https://daniel.es/blog/how-to-centralize-and-visualize-your-app-logs-in-grafana/).

Doing the same with Docker is **SO MUCH SIMPLER**.

### My approach

You will see other guides showing you how to set up everything in a single machine. While this might be convenient for people running all their Docker stuff in a single server, it's not the best practice for a production environment.

I will show you how to set up everything in a way that you can scale horizontally. With Grafana, Loki and Promtail each running in isolation of each other.

I.e.: You can have promtail in a server running Docker containers for a web app, sending the logs to a Loki instance running in another server and then visualize everything in Grafana running in a third server.

## How does it work?

The set up is really similar to the one I wrote about in the previous article, but with a few differences:

![Setup overview](./setup.png)

The main difference is that, with this setup, we have the Docker daemon sending the logs directly to Loki, without having to configure Promtail at all!

This has a few advantages:

- You don't need to mess around with log files and their locations
- Docker takes care of sending the logs to Loki
- Querying the logs becomes **SO MUCH EASIER** in Grafana as we can query by container name, image, compose project, etc.

## 1. Setting up Loki

> If you already have a Loki instance and are only interested in setting up the Docker Loki plugin, you can skip this section.

As I said in the introduction, I like to set up everything in separate servers, so here's how I set up Loki in a Ubuntu server in my home lab.

Note that this setup also works if you want to do it all in one machine, it's just that you might want to set up loki and grafana in the same compose file.

### 1.1 Create a directory for our configuration files

```bash
cd && mkdir loki && cd loki
```

### 1.2 Create a `loki-config.yaml` file

```bash
nano loki-config.yaml
```

Paste the following content:

```yaml
# You can enable authentication to prevent unauthorized access to your logs
auth_enabled: false

# Ports
server:
  http_listen_port: 3100 # Port where Loki will receive logs from Docker (or Promtail)
  grpc_listen_port: 9096 # Port where Loki will expose its API

common:
  instance_addr: 127.0.0.1
  path_prefix: /loki/data # Loki will store its data in this directory, you can mount a volume here to persist the data
  storage:
    filesystem:
      chunks_directory: /loki/data/chunks
      rules_directory: /loki/data/rules
  replication_factor: 1 # This means that Loki will store only 1 copy of the data
  ring:
    kvstore:
      store: inmemory # Uses internal memory to store the ring (Loki's internal component for distributing work)

# This part enables caching of query results to improve performance
# It will use a max cache size of 100MB, increase as you see fit
query_range:
  results_cache:
    cache:
      embedded_cache:
        enabled: true
        max_size_mb: 100

schema_config:
  configs:
    - from: 2020-10-24 # Schema applies to logs from this date onwards
      store: tsdb # Use a time series database to store the data
      object_store: filesystem
      schema: v13
      index:
        prefix: index_
        period: 24h

# This configures the ruler to send alerts to the alertmanager
ruler:
  alertmanager_url: http://localhost:9093

# Log retention to avoid running out of disk space
# It will retain logs for 30 days (adjust as needed)
limits_config:
  retention_period: 720h
```

### 1.3 Create a `docker-compose.yaml` file

```bash
nano docker-compose.yaml
```

Paste the following content:

```yaml
services:
  loki:
    image: grafana/loki:latest
    volumes:
      - ./loki-config.yml:/etc/loki/loki-config.yml
    ports:
      - '3100:3100'
    restart: unless-stopped
    command: -config.file=/etc/loki/loki-config.yml
```

> Even though you could run this single container with `docker run`, I like to use `docker-compose` so I don't have to remember the command to start the container.

### 1.4 Start Loki!

```bash
docker compose up -d
```

If everything went well, you should be able to access Loki at `http://your-server-ip:3100`.

If you have servers in multiple locations (aws, digital ocean, home lab, etc), you can create a reverse proxy with NGINX or a similar service to expose Loki to the internet. If so, I recommend either enabling authentication in the `loki-config.yaml` file or allowing only your servers to access Loki via the reverse proxy or firewall.

Now you can point all your Docker servers to point to this Loki instance!

### 1.5 Exposing Loki to the internet

If all your Docker servers are running in the same network, just note down the IP address of the server running Loki.

If your Docker servers are running in an external server to where you installed Loki (i.e. Loki is in your Home Lab at home and your Docker server is in a cloud provider), you can expose Loki to the internet by running a reverse proxy.

I won't go into detail on how to do this, there are many guides on using NGINX, Traefic, Cloudflare tunnels, etc. Just use what you're comfortable with.

## 2. Setting up the Loki Docker plugin

I'll assume you already have one or multiple Docker containers running in a server somewhere.

You can repeat this step for every server running Docker.

### 2.1 Install the Docker loki plugin

This is the easiest part. Run the following command:

```bash
docker plugin install grafana/loki-docker-driver:2.9.2 --alias loki --grant-all-permissions
```

> Check [here](https://grafana.com/docs/loki/latest/send-data/docker-driver/) for the latest version of this command.

If the command was successful, you should see the plugin listed when you run `docker plugin ls`.

### 2.2 Configure the Docker daemon

Now we need to tell Docker to use the Loki plugin to send the logs to Loki.

We need to create a `daemon.json` file in `/etc/docker/` with the following content:

```json
{
  "log-driver": "loki",
  "log-opts": {
    "loki-url": "http://localhost:3100/loki/api/v1/push",
    "loki-batch-size": "400"
  }
}
```

This tells Docker that it should use the loki log driver instead of the default one and sends the logs to the Loki instance.

> Again, change the `loki-url` field to the correct URL for you.

`loki-batch-size` is optional, but I like to set it to 400, meaning it will send 400 logs at a time to Loki. Not too many, not too few.

![Not Great Not Terrible](./not-great-not-terrible.gif)

### 2.3 Restart Docker

This is the command for Ubuntu/Debian. If you're on a different OS, just Google how to restart the Docker service for your OS.

```bash
sudo systemctl restart docker
```

Great! Now we have all the Docker containers in this machine sending their logs to our Loki instance!

## 3 Grafana!

This is the final and coolest part!

### 3.1 Install Grafana

> If you already have Grafana set up, you can skip ahead to 3.3 where I show how easy is to query the logs.

It's as simple as running a container:

```bash
docker run -d --name=grafana -p 3000:3000 grafana/grafana
```

You can access Grafana at `http://your-server-ip:3000`.

### 3.2 Connect Grafana to Loki

1. In the left panel, go to "Connections" > "Data Sources".

2. Click on "+ Add new data source".

3. Search for "Loki":

   ![Loki data source](./loki-datasource.png)

4. Fill in a name and the url of your Loki instance:

   ![Loki data source details](./loki-datasource-details.png)

5. Click on "Save & Test". You should see a message saying everything is working correctly.

   ![Loki data source test](./save-test.png)

### 3.3 Query the logs

1. In the left panel, go to "Explore".

2. Select your Loki source at the top:

   ![Select Loki source](./loki-source.png)

3. 🎉 Now comes the super cool part of this setup. You can query the logs by container name, compose project, etc.:

   ![Query logs](./query-logs.png)

   This is the best part of this setup, as you can really easily see the logs of a specific container without having to sort through hundreds of files and weird configurations.

## Conclusion

I love this setup, I deploy my stuff mainly with Docker and having all the logs centralized in a single place makes my life so much easier to debug and monitor.

It's also SUPER simple to query specific logs, if I need to see the logs of a full compose project, or a specific service or container, I can do it with a simple query.

Hope you found this guide useful! If you have any questions or suggestions, feel free to reach out to me on [X](https://x.com/onticdani)!
