---
title: Observability Stack, 2026
url: 2026-04-15-observability-stack
desc: ''
updated: 15/04/2026
created: 15/04/2026
tags: ['docker', 'observability', 'prometheus', 'influxdb', 'iac']
---

# Observability Stack, 2026

Observability, also know as how we know that a system is performing as expected, is a lot easier in 2026.

That being said the fragmentation of solutions, providers, ways of doing things, makes it hard to pick the right tools for job.

For my use case, I wanted a simple and reliable container observability stack, but I also wanted to be able to extend that system for IoT (high cardinality).

The Grafana stack was an obvious choice due popularity and and large pool of resources. The stack is showcased beautifully in this repo, and it comes with a great video explanation, [Jim's Garage, Grafana Monitoring](https://github.com/JamesTurland/JimsGarage/tree/main/Grafana-Monitoring). 

The trouble with good quality resources is that they are not always up to date. A side-effect of a fast moving sector, in a fast moving industry. 

Below is a fork of the stack, with some crucial updates for 2026. I'll continue to refer back to Jim's stack for comparison.

For reference the forked repo is here, [Alan Ionita, Repo, Observability Stack](https://github.com/alanionita/observability-stack).

# Monitoring, Jim's example

The core goal is to monitor the Docker containers on the host. understand performance, resource use, and be alerted of failure or health concerns. 

Jim uses Telegraf and InfluxDB for metrics collection and storage. Telegraf, acting as the middleware connector service that scrapes metrics and syncs the data with the time-series database InfluxDB.

Visualizing the data is done with Grafana.

Graphite is also included as an alternative time-series storage and graphing option (using the Cairo graphics library).

Prometheus, is deployed here to scrape and display Crowdsec IP data. Not to monitor Docker containers.

Grafana Promtail and Grafana Loki are used together for log files. Loki handles the scraping of log files. Promtail takes log files, parses them, and stores them in a database.

# Grafana Promtail deprecated

Promtail has been deprecated in March 2026. 

The recommended migration path is to use Grafana Alloy, another collector from Grafana.

# Grafana Alloy

Promtail had a symbiotic relationship with Loki, or log collector. 

Alloy is self-contained and acts like an orchestrator for tasks like scraping, logging, relabeling, and storing.

We've gone from having:

```
----------------------------------------------------------

Metrics:

[ Telegraf ] -> [ InfluxDB ] <-> [ Grafana ]

----------------------------------------------------------

Logs:

[ Loki ] -> [ Promtail ] <-> [ Grafana ]
 
----------------------------------------------------------

Alerts:

[ Prometheus ]

----------------------------------------------------------
```

To this:

```
----------------------------------------------------------

Metrics:

[ Alloy ] -> [ cAdvisor] -> [ Prometheus ] <-> [ Grafana ]
[ Alloy ] -> [ cAdvisor] -> [ Mimir ]      <-> [ Grafana ]

----------------------------------------------------------

Logs:

[Alloy ] -> [ Loki ] <-> [ Grafana ]
 
----------------------------------------------------------

Alerts:

[ Prometheus ]

----------------------------------------------------------
```

Alloy is far more powerful than Promtail and runs at a system level. This runtime also impacts how we deal with environment variables for Alloy. 

In this modern stack Alloy is where we define our observability rules. Alloy instructs Loki to collect logs. Alloy instructs cAdvisor to collect Docker metrics and push them to Prometheus or Mimir.


# Monitoring, Fork

## Alloy, Config

The 'config.alloy' file is the core of the new stack and where we find all of our business logic. 

The syntax for Alloy is an implementation of HCL syntax from Terraform, with each construct being a block - [Alloy, Syntax](https://grafana.com/docs/alloy/latest/get-started/syntax/).

For each rule we can have:
- A collection block or 'scrape' / 'exporter' block
- A parsing / transforming / enriching block or 'relabel' block
- A storage block or 'write' block

The structure is similar to functional programming:

```
Inputs -> Function -> Outputs

Function
- Inputs transformation or enrichment
```

The top of the 'config.alloy' contains all the write or output blocks, followed by the actual logic. 

Finally we define the scrape block which takes our raw / enriched data and sends it to the output destination.

## Alloy, Metrics

In the fork we use Prometheus and Grafana Mimir for Docker container metrics collection and storage.

The ease and Prometheus and PromQL, is why I replaced InfluxDB (and Telegraf) for container metrics. 

InfluxDB doesn't support or follow the implementation of the helpter utility functions found in PromQL, and this leads to scenarios where a Prometheus dashboard can drift away from an InfluxDB dashboard. Latency can be an issue in this design too, Prometheus itself being faster to ingest vs InfluxDB + Telegraf.

Also from local results the InfluxDB and Telegraf services consumed more resources than Prometheus and Mimir combined. 

Prometheus is already in the stack for Crowdsec data and alerts, why not use it for short-term Docker container data collection and storage. Mimir serving as long-term storage for data audits of 30 days or more.

In Alloy we first define the outputs, or write blocks:

[config.alloy]

```
prometheus.remote_write "main" {
  endpoint {
    url = "http://prometheus:9090/api/v1/write"
  }
}

prometheus.remote_write "mimir" {
  endpoint {
    url = "http://mimir:9009/api/v1/push"
  }
}
```

We will need a matching Docker container for these write block destinations, Prometheus and Mimir.

Then we define the rules for collection or scrape blocks:

```
prometheus.exporter.cadvisor "main" {
  docker_only = true
  storage_duration = "10m"
}

discovery.relabel "cadvisor_rename" {
    targets = prometheus.exporter.cadvisor.main.targets

    rule {
        target_label = "job"
        replacement  = "integrations/docker"
    }

    rule {
        target_label = "instance"
        replacement  = constants.hostname
    }
}

prometheus.scrape "scraper" {
  targets    = discovery.relabel.cadvisor_rename.output
  forward_to = [ prometheus.remote_write.main.receiver, prometheus.remote_write.mimir.receiver ]


  scrape_interval = "15s"
  scrape_timeout = "15s"
}
```

Internally the Alloy 'prometheus.exporter.cadvisor' uses  cAdvisor, a popular Docker container monitoring tool -[Google, cAdvisor, repo](https://github.com/google/cadvisor).

We won't need a container for cAdvisor in the stack, but Alloy runs cAdvisor at a system level on the host via the 'prometheus.exporter.cadvisor' block. 

The large collection of blocks built into Alloy and the low-level runtime, makes Alloy a powerful data collector and orchestrator. 

The cAdvisor config for 'storage_duration' is more than the default (2m) to guarantee that we have enough data stored in memory in case of downstream latency. Without it we might loose some metric batches.

The 'discovery.relabel' is a basic example and should be greatly expanded for production use. The ability to relabel metrics, at the Alloy level, means that we can transform metrics before they are ingested by Prometheus.

In the example we also define a Prometheus recording rule `configs/prometheus/rules/container_heartbeat.yml`, where we produce a computed metric from a raw metric, sampled at a rate of 1m.

Don't confuse relabels with recording rules, since it's generally expected to relabel before Prometheus, and never using the recording rules. Recording rules are mainly used for data aggregation.

The next Alloy block, the scraper block takes the relabeled metrics and pushes them to the outputs, Prometheus and Mimir.

The structure simplified:
- targets: what data are we pushing, eg. 'discovery.relabel'
- forward_to: where are pushing the data to eg. 'prometheus.remote_write.main.receiver'
- scrape_interval: how often we retrieve a batch and push, here mapped to Prometheus default of 15s
- scrape_timeout: how often do we discard data in case of lag or errors; here mapped to 15s seconds so that we loose at most 1 batch, which shouldn't introduce data problems unless we get repeated discards over a prolonged period.

Alloy is flexible and can forward data to multiple targets, and can also receive data from multiple sources.

This ability can reduce lag when pushing metrics to Prometheus and more sources, Alloy doing this in parallel. Whilst with Telegraf and InfluxDB we would have to deal with a queue, adding lag to the process. When benchmarking Telegraf + InfluxDB as long-term storage for Prometheus we also noticed a large number of out of sync batches.

Alloy contains 1 scraping interval rule for two targets, making it less likely to introduce data inconsistencies via independent service configs.

All the "rules" of our observability system, are now in Alloy. With the storage services (Prometheus, Mimir, Loki) containing self-management, runtime, or networking rules. 

With Alloy there's less need to chain services, eg. Prometheus which pushes to Telegraf which pushes to InfluxDB all via independent service apis, prone for data format type errors.

Next we need to configure the Alloy Docker container.

## Alloy, Docker 

Key goals for the Alloy container config:
- Bind mounts for service config, outgoing to container
- Bind mount for incoming Alloy data with local folder sync
- Bind mounts for accessing Docker metrics and system logs from host
- Port opening for '12345' and the CLI flag '--server.http.listen-addr=0.0.0.0:12345'; enables access for the Alloy Web UI

```yml
  alloy: 
    container_name: alloy
    image: grafana/alloy:latest
    restart: unless-stopped
    networks:
      - grafana-monitoring
    ports:
      - "12345:12345"
    volumes:
      - ./configs/config.alloy:/etc/alloy/config.alloy:ro
      - ./data/alloy:/var/lib/alloy/data
      - /var/run/docker.sock:/var/run/docker.sock
      - /:/rootfs:ro
      - /var/run:/var/run:rw
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
      - /dev/disk/:/dev/disk:ro
    command: 
      - run 
      - --server.http.listen-addr=0.0.0.0:12345    # Required to access Alloy UI on http://localhost:12345/
      - --storage.path=/var/lib/alloy/data 
      - /etc/alloy/config.alloy
```

The image version should be pinned in production to avoid drift.

## General, Configs

The fork project introduces a folder for configs with nested folders per service where multiple files are required. Alloy, Loki, and Mimir are single file configs, but Prometheus and Grafana are folders.

Now that we have configured Alloy, lets configure the write blocks that Alloy will push data to: Prometheus and Mimir

## Prometheus, Config

Simple Prometheus config without any business logic, apart from 'storage.tsdb.retention' set to 12h. 

```yml
global:
  scrape_interval: 15s
  evaluation_interval: 30s
  body_size_limit: 15MB
  sample_limit: 1500
  target_limit: 30
  label_limit: 30
  label_name_length_limit: 200
  label_value_length_limit: 200
storage:
  tsdb:
    retention: 
      time: 12h
rule_files:
  - "rules/container_heartbeat.yml"
```

Once again that is the intent: all the business logic staying in the Alloy configuration.

Prometheus data is to be held for a maximum of 12 hours. The data is NOT deleted automatically, but moved to a tombstone location after that time window.

The script at 'test-scripts/prometheus-clear-tombstones.sh' allows you to clear the tombstones manually, but the Prometheus container must be running with the 'admin' API enabled via the CLI flag.

The 'scrape_interval' dictates to Prometheus how often we collect metrics, and with 'evaluation_interval' we are waiting for two metric batches to evaluate the data.

'body_size_limit' to 'label_value_length_limit' represent metrics performance optimizations, see [Prometheus, Configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/).

The 'rule_files' configures both recording and alerting rules but here, only recording rules are shown.

[rules/container_heartbeat.yml]

```yml
groups:
  - name: container_heartbeat
    interval: 1m
    rules:
      - record: container_heartbeat:bpm
        expr: (changes(container_last_seen{name=~".+"}[1m])>0)
```

The rule checks the liveness of a container. 'container_last_seen' is a timestamp gauge produced by cAdvisor, [Monitoring cAdvisor with Prometheus](https://github.com/google/cadvisor/blob/master/docs/storage/prometheus.md). The timestamp should change 3 times per minute, matching the number of gaps between the 15 second Prometheus scrape intervals. The result of the aggregation becomes an indicator for perfect health with anything below highlighting health issues. The indicator can display minor 'flickers' in liveness, lasting between 15s-60s, as well as larger downtime events. 

The recording rule is then down-sampled to 5min intervals, 

We use the aggregate 'container_heartbeat:bpm' metric to visualize the container heartbeat using a heatmap chart.

## Prometheus, Docker

Key goals for the Prometheus container config:
- Enabled remote write receiver CLI flag
- Bind mounts for config outgoing to container
- Bind mount for incoming data from Prometheus to filesystem
- Docker user permissions, needed for incoming data write
- Service healthcheck, required by Grafana container

```yml
  prometheus:
    container_name: prometheus
    user: ${GRAFANA_DOCKER_USER}
    image: prom/prometheus
    restart: unless-stopped
    networks:
      - grafana-monitoring
    ports:
      - 9090:9090
    volumes:
      - ./configs/prometheus/global.yml:/etc/prometheus/prometheus.yml:ro
      - ./configs/prometheus/rules/:/etc/prometheus/rules/:ro
      - ./data/prometheus:/prometheus/data
    command:
      - --web.enable-remote-write-receiver
      - --config.file=/etc/prometheus/prometheus.yml
      # - --web.enable-admin-api    # Required to clear tombstone files
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:9090/-/healthy"]
      interval: 5s
      timeout: 3s
      retries: 5
```

If we want Alloy to be succesful in pushing data to Prometheus, we need the 'web.enable-remote-write-receiver' CLI flag. 

Bind mounts are used here to sync the configs. Note that root config name 'global.yml' is not the same as the Prometheus default 'prometheus.yml'. The mount is rewriting from 'global' to 'prometheus' files.

Data from the container is synced within the repo folder '/data/prometheus'. And because of this we need to ensure that the container makes use of a user with read/write access to the local files.

Since the Prometheus storage is a dependency for visualization, we introduced a healthcheck which will produce the 'grafana' container dependency rule.

The rest is a standard Prometheus config: port exposing to for the Prometheus UI host access, network config for inter-container requests, etc.

## Mimir, Config

Key goals for the Mimir service config:
- Single node configuration
- Storage set to filesystem
- Data retention set to 60days
- Data discard rule for out of time data

```yml
# Do not use this configuration in production.
# It is for demonstration purposes only.
multitenancy_enabled: false

blocks_storage:
  backend: filesystem
  bucket_store:
    sync_dir: /data/tsdb-sync 
  filesystem:
    dir: /data/blocks
  tsdb:
    dir: /data/tsdb

compactor:
  data_dir: /data/compactor
  sharding_ring:
    kvstore:
      store: memberlist

limits:
  # Delete from storage metrics data older than 2 months.
  compactor_blocks_retention_period: 60d
  # Process metric with timestamps of a wider time delay
  out_of_order_time_window: 5m

distributor:
  ring:
    instance_addr: 127.0.0.1
    kvstore:
      store: memberlist

ingester:
  ring:
    instance_addr: 127.0.0.1
    kvstore:
      store: memberlist
    replication_factor: 1

ruler_storage:
  backend: filesystem
  filesystem:
    dir: /data/rules

server:
  http_listen_port: 9009
  grpc_listen_port: 9080
  log_level: error

store_gateway:
  sharding_ring:
    replication_factor: 1
```

By design Mimir is a distributed system that uses cloud providers for storage. Here we bypass those recommendations, in favour of a single node runtime with local file-system storage. This config is achieved via "storage.gateway.sharding_ring.replication_factor", "multitenancy_enabled", and "blocks_storage.backend". It is recommended that in production you migrate from file-system and single-node, to a distributed setup with a cloud-provider for storage.

Data retention is set to 60days, since Mimir is our Prometheus long-term storage. This grants us a data buffer when fulfilling the 30day data audit requirement. This config is achieved via "limits.compactor_blocks_retention_period". 

During development some "out of time" errors were discovered. An anomaly in this use case, because "Prometheus TSDB only accepts in-order samples that are less than one hour old, discarding everything else" - [Mimir, Introducing out-of-order sample ingestion](https://grafana.com/blog/new-in-grafana-mimir-introducing-out-of-order-sample-ingestion/).

"out of time" errors might be a development-only error caused by frequent restarts interfering with metrics processing pipeline, creating a "write-ahead log" (WAL) backlog.

Equally the processing of 'old metrics' at 1h intervals would introduce lag to the system if high cardinality is expected. The overall health and performance of the system is greater than the value of such a long metrics queue.

To guarantee the system performance and to clearly specify expected expiry, we set the 'limits.out_of_order_time_window' to 5min. Wider time delay metrics will be discarded, saving on host resources with minimal data loss.

The rest follows stock configuration for Mimir, [Mimir, Configuration Parameters](https://grafana.com/docs/mimir/latest/configure/configuration-parameters/).

## Mimir, Docker

Key goals for the Mimir container config:
- Bind volume for service config outgoing to container
- Bind volume for incoming Mimir data writen to filesystem
- Healthcheck required for Grafana container

```yml
  mimir:
    container_name: mimir
    image: grafana/mimir-alpine
    networks:
      - grafana-monitoring
    ports:
      - "9009:9009"
    volumes:
      - ./configs/mimir-config.yml:/etc/mimir/mimir.yaml:ro
      - ./data/mimir:/data:rw
    command:
      - "-config.file=/etc/mimir/mimir.yaml"
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:9009/ready"]
      interval: 10s
      timeout: 30s
      retries: 5
```

## Monitoring, Conclusion

Three containers (Alloy, Prometheus, Mimir), collection logic stored in Alloy, orchestraction logic stored in Alloy, data stored in Prometheus and Mimir, and an abstracted implementation of 'cAdvisor' via Alloy components.

We no longer need Telegraf and InfluxDB. 

We can also replace Promtail with Alloy, but it was never really used in the monitoring context. Promtail was used in the logging context, which we will cover next.

# Logging, Fork

In the source, Promtail was quoted as a storage options for logs. The actual purpose for Promtail was to scraping and push log data into Loki. Loki handled the storage and indexing layer for logs.

Now that Promtail is deprecated, in the fork we will replace it with Alloy.

## Alloy, Logs

Similar to the metrics out config contains:
- A write definition, mapped to Loki contain push api
- A scraper definition, via the 'discovery.docker' component
- A simple relabeling rule
- A forwarding block from the scraper to the writer

```
// Targets
// > Groups all of the *write components together

loki.write "main" {
  endpoint {
    url = "http://loki:3100/loki/api/v1/push"
  }
}

...


// Logging

discovery.docker "linux" {
  host = "unix:///var/run/docker.sock"
}

discovery.relabel "docker_logs" {
    targets = []

    rule {
        source_labels = ["__meta_docker_container_name"]
        regex = "/(.*)"
        target_label = "container_name"
    }

    rule {
      target_label = "instance"
      replacement  = constants.hostname
    }
  }

loki.source.docker "main" {
  host       = "unix:///var/run/docker.sock"
  targets    = discovery.docker.linux.targets
  relabel_rules = discovery.relabel.docker_logs.rules
  forward_to = [loki.write.main.receiver]
}
```

'discovery.docker' finds the containers and exposes them as targets, hence the 'docker.sock' host definition, [Grafana, Alloy, Components, discover.docker](https://grafana.com/docs/grafana-cloud/send-data/alloy/reference/components/discovery/discovery.docker/).

Previous Promtail logs scraping, is now achieved in Alloy with this 'discovery.docker' component.

Alloy has another component for the same purpose - 'loki.source.docker'. Currently unclear what are the differences between the two, [Grafana Alloy, Components, loki.source.docker](https://grafana.com/docs/grafana-cloud/send-data/alloy/reference/components/loki/loki.source.docker/). Perhaps 'discovery.docker' represents a more generalized implementation.

Lets move on to define the Loki Docker container.

## Loki, Config

Key goals for the Loki service config:
- Loki is a distributed system and once again we are configuring it as a singular node service via 'common.replication_factor'
- Specify data to be held for 24h via 'schema_config.configs' entry, set with 'index.period'

```yml
# DOCS: https://grafana.com/docs/loki/latest/configure/examples/configuration-examples/
# This is a complete configuration to deploy Loki backed by the filesystem.
# The index will be shipped to the storage via tsdb-shipper.

auth_enabled: false

limits_config:
  allow_structured_metadata: true
  volume_enabled: true

distributor:
  otlp_config:
    # List of default otlp resource attributes to be picked as index labels
    # CLI flag: -distributor.otlp.default_resource_attributes_as_index_labels
    default_resource_attributes_as_index_labels: [service.name service.namespace service.instance.id deployment.environment deployment.environment.name cloud.region cloud.availability_zone k8s.cluster.name k8s.namespace.name k8s.container.name container.name k8s.replicaset.name k8s.deployment.name k8s.statefulset.name k8s.daemonset.name k8s.cronjob.name k8s.job.name]

server:
  http_listen_port: 3100

common:
  ring:
    instance_addr: 127.0.0.1
    kvstore:
      store: inmemory
  replication_factor: 1
  path_prefix: /tmp/loki

schema_config:
  configs:
  - from: 2020-05-15
    store: tsdb
    object_store: filesystem
    schema: v13
    index:
      prefix: index_
      period: 24h

storage_config:
  tsdb_shipper:
    active_index_directory: /tmp/loki/index
    cache_location: /tmp/loki/index_cache

pattern_ingester:
  enabled: true
```

Rest is a stock Loki config, [Grafana Loki, Configure examples](https://grafana.com/docs/loki/latest/configure/examples/configuration-examples/#9-s3-with-sse-kms-snippetyaml).

## Docker, Loki

Key goals for the Loki container config:
- Binding the config outgoing to the container
- Binding container data to local data folder
- Add user with correct read/write permissions for the incoming container data sync with file-system

```yml
loki:
    container_name: loki
    user: ${GRAFANA_DOCKER_USER}
    image: grafana/loki:main
    restart: unless-stopped
    networks:
      - grafana-monitoring
    ports:
      - "3100:3100"
    volumes:
      - ./data/loki:/etc/loki
      - ./configs/loki.yml:/etc/loki/local-config.yaml:ro
    command: -config.file=/etc/loki/local-config.yaml
```

# Visuals

For visualization we leverage Grafana. In the source example the user, data source, and dashboard configs were done manually via the Grafana UI. This cause a big of friction, we needed an InfluxDB account, to create a token, to import InfluxDB as a data source, in order the create a dashboard that visualizes that data source.

In the fork provisioning is used or infrastructure-as-code to configure the data sources and dashboards. 

Environment variables and container variables are also implemented. Some are used by Grafana as internal feature flags for the initial account creation, whilst others are used for variable expansion within provisioning rules.

## Docker, Grafana

Key goals for the Grafana container config:
- Container depends on the data sources being alive, and healthy: Prometheus, Mimir; Loki should probably be added to the list
- Bind volume sync for provisioning; usually containing the 'datasources/' and 'dashboard/' configs; the 'dashboard' configs don't contain any actual dashboard panel logic, just linking to the ultimate dashboard json file
- Bind volume sync for provisioned dashboards: where we store the actual json config for the dashboards
- Environment config for admin user, password, provisioning wait timeout; acting as internal CLI flags for Grafana
- Extra environment variables used within provisioning configs

```yml
  grafana:
    container_name: grafana
    user: ${GRAFANA_DOCKER_USER}
    depends_on: 
      prometheus:
        condition: service_healthy
      mimir:
        condition: service_healthy
    image: grafana/grafana-oss:latest
    restart: unless-stopped
    networks:
      - grafana-monitoring
    ports:
     - 3000:3000/tcp
    volumes:
      - ./configs/grafana/provisioning:/etc/grafana/provisioning:ro
      - ./configs/grafana/dashboards-json:/var/lib/grafana/dashboards:ro
      - ./data/grafana:/var/lib/grafana
    environment: 
      GF_SECURITY_ADMIN_USER: ${GRAFANA_USER}
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASS}
      GF_PROVISIONING_WAIT_TIMEOUT: 60
      LOKI_URL: ${LOKI_URL}
```

Environment:
- Everything with 'GF_*' an internal Grafana flag
- The presence of "GF_SECURITY_ADMING_USER" and "*_PASSWORD" automatically triggers the initial signup flow with the entries provided; manual login with default credentials to create an admin account is no longer required
- 'PROVISIONING_WAIT_TIMEOUT' grants a time buffer to the initial sign-up flow
- 'LOKI_URL' is a custom variable that is expanded within the 'config/grafana/provisioning/*' files

Grafana will automatically configure the data sources and dashboards at startup if the 'provisioning/*' files are present. 

With this, our observability stack only requires 1 command to be fully operational: 'docker compose up' or the alias 'make up'.

## Data source, Loki

Basic config for Loki data source with environment variable expansion for 'url:', and some minor optimisations under 'jsonData:'.

[configs/provisioning/datasources/loki.yml]

```yml
apiVersion: 1

datasources:
  - name: Loki
    type: loki
    access: proxy
    orgId: 1
    url: ${LOKI_URL}
    basicAuth: false
    isDefault: false
    version: 1
    editable: false
    jsonData:
      timeout: 60
      maxLines: 1000
```

## Data source, Prometheus

Basic config for Prometheus with optimisations under 'jsonData'. We could also expand the 'url:' value from the environment. 

[configs/provisioning/datasources/prometheus.yml]

```yml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    orgId: 1
    url: http://prometheus:9090
    jsonData:
      httpMethod: POST
      prometheusType: Prometheus
      prometheusVersion: 3.3.0
      cacheLevel: 'High'
      timeInterval: 15s  # Prometheus scrape interval
      manageAlerts: true
      disableRecordingRules: false
      seriesEndpoint: false
      incrementalQuery: true
      incrementalQueryOverlapWindow: 10m
```

'jsonData' config details:
- 'timeInterval': matched the scraping of Prometheus (15s); same as default value, but specified here for clarity.
- 'manageAlerts': allows Grafana to view and show the Prometheus alerts and recording rules configured
- 'prometheusType': Prometheus for native and Mimir or etc for derivatives
- 'prometheusVersion': 3.3.0; based major.minor version
- 'cacheLevel': high query caching in the Grafana UI, leads to faster loading dashboards and less strain on the data source
- 'disableRecordingRules': used to disable recording rules, improving data source availability; here used to say that we are 'definitely are using recording rules', one recoding rule being the basis for a shared panel across two dashboards
- 'seriesEndpoint': default, but defined as if to say 'not using the series endpoint'
- 'incrementalQuery': by default Grafana will run the query each dashboard interval, putting strain on the data source; this flag allows for the fetching of new results, appending to the old data cache; beta feature
- 'incrementalQueryOverlapWindow': set to the default of 10m, specified here for clarity; dependent on the above flag.

## Data source, Mimir

Basic config for Mimir with optimisations under 'jsonData'. We could also expand the 'url:' value from the environment. 

[configs/provisioning/datasources/mimir.yml]

```yml
apiVersion: 1

datasources:
  - name: Mimir
    type: prometheus
    orgId: 1
    url: http://mimir:9009/prometheus
    jsonData:
      httpMethod: POST
      prometheusType: Mimir
      cacheLevel: 'High'
      timeInterval: 15s     # Prometheus scrape interval
      manageAlerts: false
      disableRecordingRules: false
      seriesEndpoint: false
      incrementalQuery: true
      incrementalQueryOverlapWindow: 10m
```

Basic config for Mimir with optimisations under 'jsonData', similar to above Prometheus config. We could also expand the 'url:' value from the environment. 

Alerts usage is planned on the short-term storage (Prometheus), so Mimir has 'manageAlerts' disabled.

An interesting config quirk to outline is that the top level 'type' is still 'prometheus', whilst 'jsonData.prometheusType' is 'Mimir'.

## Dashboards, Provisioning

[configs/provisioning/dashboards/default.yml]

```yml
apiVersion: 1

providers:
  - name: dashboards
    type: file
    updateIntervalSeconds: 30
    editable: true          # Allows UI edits
    disableDeletion: false  # Blocks UI deletion
    allowUiUpdates: false   # Blocks UI updates
    options:
      path: /var/lib/grafana/dashboards
      foldersFromFilesStructure: true
```

Details of the config:
- 'name' set to generic 'dashboards'.
- 'folder': not specified here since we're using a parent folder with enabled file structure detection.
- 'updateIntervalSeconds': dashboards refresh value.
- 'editable', 'disableDeletion', and 'allowUiUpdates': allow edits to dashboards via the UI, but disable deletion and automating saving of UI changes; forces the dashboard updates to only happen via code, but allows UI use for edits; code changes to be implemented via JSON export from the UI.
- 'options.path': where to find the dashboard JSON files; specifically where the files from 'configs/grafana/dashboards-json/' are synced with the container after the bind mount config
- 'options.foldersFromFilesStructure': allows for folders within the core '../dashboards/'

For our this system I wanted to nest dashboards under their datasource, eg. '../dashboards/prometheus/cAdvisor.json'.

In general it provides a template for organizing the dashboards using nested folders, bypassing the need for further .yml rules when expansion is needed.

## Dashboards, JSON

The dashboards themselves, the rows, the panels, the ranges, the visualizations, the queries are all configured via JSON. 

You can use local files or link to a public dashboard.

Here, I chose to fork a public dashboard for Prometheus cAdvisor metrics and tweak it, [Grafana Labs, Dashboards, cAdvisor Docker Insights](https://grafana.com/grafana/dashboards/19908-docker-container-monitoring-with-prometheus-and-cadvisor/). 

The tweaks are mostly on the queries themselves, with the largest set of changes to the 'Container Restarts' panel query and visualization. I wrote in detail about the queries in this previous post, [Alan Ionita, Prometheus Long-term Storage](https://alanionita.github.io/blog/2026-03-31-prometheus-mimir/).

# Conclusion

The replacement of Grafana Promtail with Grafana Alloy allowed us to simplify the stack by removing 3 containers: Grafana Promtail, Telegraf (InfluxData), InfluxDB. Overall CPU and RAM usage improvements were observed as a result. 

Core data storage for metrics is now done via Prometheus instead of InfluxDB.

Grafana Mimir was added in order to provide long-term support for monitoring data at 60day intervals, supporting a 30day auditing goal.

InfluxDB could have been used for long-term Prometheus storage, but visualizations were easier to implement with PromQL queries. The queries were tricky to implement in InfluxDB and produced mismatched trends and summaries.

Grafana is pre-configured with an admin user and password, the 3 data sources (Loki, Prometheus, Mimir), and 2 dashboards (Prometheus, Mimir). Dashboards are forked from a public dashboard. Showcasing an example of infrastructure-as-code.

The system rules are now contained in Alloy, making the rest of the service configs smaller and reducing hidden dependencies. For example, Prometheus, Mimir, Loki all contain minimal variations on default configs.

I hope you enjoyed this explanation, feel free to see the repo for the code and further documentation, [Alan Ionita, Repo, Observability Stack](https://github.com/alanionita/observability-stack).

# Open questions

List of unanswered questions:
- What about Traces, the final ingredient to an Observability stack?
- Where are the alerting examples? What is the best way to configure them?
- We are observing the containers, what about collecting metrics about the host?
- Example is tested in isolation, what happens if we have multiple stacks of containers on the same host?

Feel free to use these as the basis for forks, updates, or derivative projects.
