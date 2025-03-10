---
author: Daniel Garcia
pubDatetime: 2024-03-22T15:07:17Z
# modDatetime:
title: "How to query logs in Grafana Loki"
featured: false
draft: false
tags:
  - WebDev
  - Logging
  - Grafana
  - Loki
description: "Learn how to query logs in Grafana Loki with a easy step by step guide"
ogImage: ./cover.png
---

![cover](./cover.png)

**In this article:**

- [Introduction](#introduction)
- [Querying your first logs](#querying-your-first-logs)
- [Easily filter logs in Grafana](#easily-filter-logs-in-grafana)
- [How to parse Loki logs in Grafana](#how-to-parse-loki-logs-in-grafana)
- [Using context in Grafana Loki](#using-context-in-grafana-loki)

---

## Introduction

I've previously wrote an article on [how to centralize and easily query logs with Promtail + Loki + Grafana](https://dev.to/onticdani/how-to-centralize-and-visualize-your-app-logs-in-grafana-483c).

In this article I will focus on the querying part. How we're doing it for [Emilio](https://getemil.io) and how to properly query logs in Grafana and how to parse your log format to easily filter the lines you want to see.

---

## Querying your first logs

While you can create fancy dashboards, querying logs really shines in the **Explore** view in Grafana.

You can find that view in the left panel:

![Grafana's left panel](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/maykt7ue57yte37z43bx.png)

If you've followed my previous tutorial you will be able to select either a job or a filename in label filters:

![Loki job and filename selector](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/poh3dwabssoospelfj6j.png)

Now at the top right, hit run query:

![Grafana Loki run query button](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8ez6codqm7laja2xtsry.png)

Then, you will see something like this:

![Grafana Loki explore view](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2d59efjp6hehj3vs2n8r.png)

The UI consists on a bar graph indicating the amount of logs over time and a query of 1000 lines of the latest logs.

In the top panel you can adjust the timeframe for your query:

![Grafana Loki timeframe selector](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/q00pamwvm648znc4148w.png)

And in the query panel you can change the limit. Just be aware that increasing the limit too much might crash your Loki instance:

![Grafana Loki query limit](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6dvvbiz4vycqbqjktyep.png)

---

## Easily filter logs in Grafana

It's quite easy to start filtering logs.

Start by hitting: **Operations**

![Grafana Loki query operations button](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pwsgq8ib5y7sd1t5iqhf.png)

These are the current operations available at the time of writing this post:

![Grafana Loki query operations available](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/notu57o4cljnpzzajxtj.png)

The most useful one when you're just starting is **Line filters**

![Grafana Loki line filter operator](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/91366d9n7rq3265bdwqs.png)

You can then choose the filter you'd like to search specific lines. Here's an example to query lines containing "ERROR":

![Grafana Loki line filter operator example](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qy08tf9l30oojjejdws0.png)

You can add as many operations as you want.

The bar graph is then a great way to see how many times the lines with your query happened over time. Cool to track errors, warnings, specific errors...

---

## How to parse Loki logs in Grafana

This is a really cool thing that Grafana allows you to do and helps filtering a LOT.

I'll use our logs format as an example:

```
2024-03-19 09:48:57,608 - 244843ce48f8 - INFO - views - History ID: 123782
```

The log pattern is as follows:

```
<datetime> - <docker_container_id> - <log_level> - <module> - <log_message>
```

For you to have more reference, you could also do fancy stuff like this:

```
0.191.12.2 - - [10/Jun/2021:09:14:29 +0000] "GET /api/plugins/versioncheck HTTP/1.1" 200 2 "-" "Go-http-client/2.0" "13.76.247.102, 34.120.177.193" "TLSv1.2" "US" ""
```

```
<ip> - - <_> "<method> <uri> <_>" <status> <size> <_> "<agent>" <_>
```

To parse the lines with a specific pattern like ours, go to **+ Operations**, **Formats** and then **Patterns**

![Log pattern menu](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/me10232wcweqctyz5014.png)

Then you just insert the pattern with the same format as above:

![Log pattern example in Grafana](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bq0knibd54strw79jdbp.png)

If you query again the logs you will see that nothing special happens, but with this we can now query on specific labels!

Hit **+ Operations** and select **Label Filters** and then **Label Filter Expressions**

![Label Filters menu](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ltqtagf8t30nslxt0x50.png)

With these I can now filter the logs really selectively.

Let's say I want to query ERROR logs for the user "daniel":

![Loki log query using labels](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/innt4vt6b5l6f6fz6sen.png)

Now you can combine labels and filters to really find what you're looking for.

## Using context in Grafana Loki

Grafana released this last year and it's AMAZING.

Say you found instances of an error. Great, but what information does that give you? You want to see what happened before and after that log line to see the cause and consequence of that error.

For this, it's really easy:

1. Hover above the line you want to see context for
2. Hit the _show context_ icon at the top right of the line

![Context icon](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/f96lvc5mo1r75m5zbamy.png)

3. A new window will open were you will see the context (logs before and after) of that line:

![Loki log context view](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hzq12h20kb825emh0xdd.png)

4. You can now use labels to filter different filenames, jobs or log labels!

![Filtering context with labels](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mzx6emfw88fast766e8e.png)
