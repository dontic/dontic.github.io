---
author: Daniel Garcia
pubDatetime: 2024-02-22T10:00:00Z
title: How to centralize and visualize your app logs in Grafana
slug: how-to-centralize-and-visualize-your-app-logs-in-grafana
featured: false
draft: false
category: tech
tags:
  - grafana
  - django
  - loki
  - webdev
description: Learn how to visualize your web app logs in Grafana using Loki.
---

> ⚠️**IMPORTANT**⚠️
>
> This guide is for setting up Loki and Promtail in a server where your application generates log files or you want to send syslogs from your server.
>
> If you want to set up Loki to centralize Docker logs, check out [this guide](https://daniel.es/blog/centralize-and-visualize-docker-logs-in-grafana-with-loki/).

**In this article:**

- [Introduction](#introduction)
- [What's the setup?](#whats-the-setup)
- [Setting up Promtail](#setting-up-promtail)
- [Setting up Loki](#setting-up-loki)
- [Setting up everything in Grafana](#setting-up-everything-in-grafana)

---

## Introduction

You're tired of `ssh`ing into your server, `cd`ing into your log directory and using `cat` or `vim` to struggle and find logs for your application.

This is what we were doing at [Emilio](https://getemil.io) at first, then Loki came into our lifes and changed everything.

If this is your case, look no further, you're in the right place to set up a **free and open source** solution to easily visualize, filter and find the log lines you're looking for!

---

## What's the setup?

![Setup overview](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ezpdcwsweednvtyqtbi0.png)

### 1. Promtail

Promtail is a client installed in the same server where your application lives.

It continuously reads the log files and sends them to the Loki instance.

### 2. Loki

Think of Loki as a log database.

It's a service that receives the logs from Promtail and stores them so they can then be queried from a client.

### 3. Grafana

First of all, if you do not know Grafana, it is AMAZING for creating dashboards.

Having said this, Grafana will be the client in charge of querying Loki and

### Note

There are _many_ ways to set up this stack.

For the sake of simplicity and because I love it, I will tech you how to set up everything using **Docker**.

---

## Setting up Promtail

Go into your server's console and locate the full path of the log files you want to track.

For me this will be `/var/logs/myapplogs/`

### 1. Create a directory for your promtail setup

```
cd ~
```

```
mkdir promtail && cd promtail
```

### 2. Download the Promtail YAML config file

```
wget <https://raw.githubusercontent.com/grafana/loki/v2.9.4/clients/cmd/promtail/promtail-docker-config.yaml> -O promtail-config.yaml
```

Make sure you check what the latest version of Promtail is here: https://grafana.com/docs/loki/latest/setup/install/docker/

### 3. Modify the config file

```
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: https://<your-loki-endpoint>/loki/api/v1/push

scrape_configs:
- job_name: system
  static_configs:
  - targets:
      - localhost
    labels:
      job: <your job name>
      __path__: /path/to/logs/*.log
```

Here's an explanation of what everything means in this file:

#### Server Block:

- **`http_listen_port: 9080`**: This specifies the port on which Promtail's server listens for HTTP traffic, useful for health checks and metrics.
- **`grpc_listen_port: 0`**: Here, GRPC is disabled (port 0), which is often used for internal communication between Promtail instances or with other services.

#### Positions Block

- **`filename: /tmp/positions.yaml`**: This file stores the current position of Promtail in each log file it's tailing. This ensures that Promtail can resume from where it left off in case of a restart, preventing log duplication or loss.

#### Clients Block

- **`url: https://<your-loki-endpoint>/loki/api/v1/push`**: This is the endpoint to which Promtail sends the gathered log entries. The URL points to your Loki instance.

#### Understanding job_name, targets, and labels

- **`job_name: system`**: This is a logical name for a set of targets (log sources) and configurations. It groups together similar log streams under a common identifier. This helps in organizing and querying logs in Loki.

- **`targets: - localhost`**: In the static configuration context, this defines the host from which logs are collected. Since Promtail is typically deployed on the same machine it's collecting logs from, localhost is common. However, this field is more relevant for service discovery in dynamic environments.

- **`labels`**: Labels are key-value pairs assigned to every log stream collected by Promtail. They are critical for Loki's query language, allowing for efficient filtering and querying of logs based on these labels.

- **`job: <your job name>`**: This label categorizes all logs collected under this job as belonging to the "emiliologs" job, useful for querying.

- `__path__: /path/to/logs/*.log`: The **path** label is unique as it directs Promtail to the specific log file to tail.

Strategies to log files:

- Single job:

```yml
scrape_configs:
  - job_name: my_app
    static_configs:
      - targets: ['localhost']
        labels:
          job: my_logs
          __path__: /path/to/logs/{log1,log2}.log
```

- Multiple jobs:

```yml
scrape_configs:
  - job_name: django
    static_configs:
      - targets: ['localhost']
        labels:
          job: django_logs
          __path__: /path/to/logs/django.log

  - job_name: worker
    static_configs:
      - targets: ['localhost']
        labels:
          job: worker_logs
          __path__: /path/to/logs/worker.log
```

### 4. Create a docker compose file

```
nano docker-compose.yml
```

```
version: '3.8'
services:
  promtail:
    restart: always
    image: grafana/promtail:2.9.4
    volumes:
      - ./promtail-config.yaml:/mnt/config/promtail-config.yaml
      - /path/to/logs:/path/to/logs
    command:
      - "-config.file=/mnt/config/promtail-config.yaml"
```

- Check the version is the one you want to use.
- Replace `/path/to/logs:/path/to/logs` with the corresponding path

### 5. Run it!

```
docker compose up
```

## Setting up Loki

I have a homelab, so I like my services in separate containers but you can run Loki and Grafana together!

### 1. Create a working directory

```
mkdir loki && cd loki
```

### 2. Copy the YAML config file

```
wget <https://raw.githubusercontent.com/grafana/loki/v2.9.4/cmd/loki/loki-local-config.yaml> -O loki-config.yam
```

Again, make sure you're using the latest version.

### 3. Modify the config file if you need to

Normally I don't touch this file as I like the defaults.

Feel free to check it's contents and modify anything for your needs.

### 4. Create a docker compose file

```
nano docker-compose.yml
```

```
version: '3.8'
services:
  loki:
    restart: always
    image: grafana/loki:2.9.4
    volumes:
      - ./loki-config.yaml:/mnt/config/loki-config.yaml
    ports:
      - "3100:3100"
    command:
      - "-config.file=/mnt/config/loki-config.yaml"
```

### 5. Run Loki!

```
docker compose up
```

### 6. Set up a reverse proxy if needed

Loki needs to be pingable by both Promtail and Grafana, thus if you're running every instance in different networks you will need to expose the service.

If everything is in the same machine or your local network you can skip this step.

### 7. Check the Loki instance status

Go to `<loki-endpoint>:3100/ready` and `<loki-endpoint>:31000/metrics` and make sure everything is pingable.

---

## Setting up everything in Grafana

> ✅ For a more detailed guide on how to query logs in Grafana, look into [this recent article](https://dev.to/onticdani/how-to-query-logs-in-grafana-loki-59jh).

I won't go on details on how to set up a Grafana instance as there are a million guides already. With docker, it's quite straightforward.

### 1. Add your Loki connection

Go to connections and add a Loki connection.

Just follow the UI and point the connection to your Loki endpoint.

When you hit Save and Test you should receive a message that everything is working correctly.

**Note:** Sometime Loki takes a while to initialize, make sure `<loki-endpoint>:3100/ready` is showing "Ready".

### 2. Go to the explore tab and select the Loki connection

![Explore tab](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fbhx8xtoxb2yste4w7nj.png)

### 3. Select the log file you want to analyze

In `Label filters` select the log file you want:

![Label filters](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/o37eq3da0wlc74zgwue2.png)

### 4. Filter the logs

You can add as many `Operations` as you want, the simplest one is `Like contains`:

![Operations](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/s10f10ksb8bvoq5j8l7d.png)

### 5. View line in context

So you found the log line you were looking for but want to see what happened before and after.

Easy!

Just click on the Log line and hit `Show context`

### 6. Seeing live logs

Just click on `Live`

![Live logs button](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/y0g2xk4x8e9my837pw9d.png)

### 7. Create a custom dashboard

If you want to get fancy and see graphs on how many logs you're generating or how many times you had errors on a timeline you can create a Dashboard.

Because dashboards are a creative thing I won't go into how you can create one but you can c[heck this guide out](https://grafana.com/blog/2023/05/18/6-easy-ways-to-improve-your-log-dashboards-with-grafana-and-grafana-loki/).
