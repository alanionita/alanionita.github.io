---
title: InfluxDB, infrastructure-as-code
url: 2026-04-02-influxdb-iac
desc: ''
updated: 02/04/2026
created: 02/04/2026
tags: ['docker', 'databases', 'influxdb', 'iac']
---

# InfluxDB, infrastructure-as-code

There is a wealth of resources online covering the topic of setting up InfluxDB as a Docker Compose micro-service.

Few of those discuss how to provision the initial setup as infrastructure-as-code, with built it authentication, local volumes (for debugging), and health checks.

```yml
  influxdb:
    container_name: influxdb
    image: influxdb:2.8.0   # Required: pined to prevent config drift v2.8
    restart: unless-stopped
    ports:
      - 8086:8086
    networks:
      - grafana-monitoring
    environment:
      DOCKER_INFLUXDB_INIT_MODE: setup
      DOCKER_INFLUXDB_INIT_USERNAME: ${INFLUXDB_ADMIN_USER}
      DOCKER_INFLUXDB_INIT_PASSWORD: ${INFLUXDB_ADMIN_PASS}
      DOCKER_INFLUXDB_INIT_ADMIN_TOKEN: ${INFLUXDB_ADMIN_TOKEN}
      # DOCKER_INFLUXDB_INIT_AUTH_ENABLED: true   # Required: fix auth auto-enforce
    volumes:
      - ./data/influxdb:/var/lib/influxdb2
    healthcheck:
      test: ["CMD", "influx", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
```

# Breakdown

The Docker image is pinned to v2.8. In April 2026, the 'influxdb:latest' image will switch over to v3, and that comes with some significant changes. Here we make sure to stay on v2.8. 

On the environment we use '.env' file which Docker Compose will consume to load the variables into your container. 

This allows for a complex configuration without leaking any sensitive information with the infrastructure code.

Docker and InfluxDB recommend the use of Docker secrets, but secrets and environment variables are equally bad for security in lieu of encryption at rest or in transit. [InfluxDB, Install with Docker Compose](https://docs.influxdata.com/influxdb/v2/install/use-docker-compose/).

There is one situation where secrets are better: build step that require credentials. Without using secrets it's very easy to read the 'docker history IMAGE_NAME' and read the secrets. Especially important if you plan to deploy an image to DockerHub

In the face of two systems with equal consequences and outside of the edge case, I prefer to stick to the more popular system or environment variables.

When using environment variables it's good to add an '.env-example' file for documenting the required variables.

```
INFLUXDB_ADMIN_USER=
INFLUXDB_ADMIN_PASS=
INFLUXDB_ADMIN_TOKEN=
```

Also remember to add '.env' and '.env.*' files to '.gitignore' and '.dockerignore'.

# InfluxDB, Configuration

Most walkthroughs show how easy it is to spin up an InfluxDB container and manually create the user and token, usually in the context of a stack with Grafana and InfluxDB. In these, you have to first run the stack to configure InfluxDB authentication, then re-run the stack to create a 'Datasource' entry for InfluxDB in Grafana. 

You can use 'DOCKER_INFLUXDB_INIT_MODE' set to 'setup' alongside 'DOCKER_INFLUXDB_INIT_USERNAME', and 'DOCKER_INFLUXDB_INIT_PASSWORD' to configure the InfluxDB user via iac.

The 'INFLUXDB_ADMIN_TOKEN' configures a token from an existing value.

With this setup you can now configure Grafana Datasource or Telegraf pipelines to talk to InfluxDB with authentication, and work from the first 'docker compose up'.

The bind mounts seen here are for development-only, and should be migrated to named volumes in production. During development I like the convenience of see and interrogate the data produced by a stack within the same folder as the infrastructure code.

A health check is configured here because InfluxDB is usually a required service for downstream use, so it's nice to start those downstream services once all the dependencies are healthy.

# InfluxDB, Debugging

In some cases the initial authentication flow doesn't execute and it can be manually triggered using the 'DOCKER_INFLUXDB_INIT_AUTH_ENABLED' flag.

This issue will manifest by getting an authentication error when trying to login on InfluxDB UI with the provisioned user and pass. If everything seems correct on the config and data entry, try using the above flag to force the auth initialization flow.

