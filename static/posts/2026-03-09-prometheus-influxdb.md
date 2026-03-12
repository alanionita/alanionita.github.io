---
title: Prometheus + InfluxDB
url: 2026-03-09-prometheus-influxdb
desc: ''
updated: 09/03/2026
created: 09/03/2026
tags: ['docker', 'databases', 'observability', 'influxdb', 'prometheus']
---

# Prometheus Long-term Storage [draft]

```
----------------------------------------------------------------------------------------------
```
[12-03-2026]

This is an ongoing draft post. 

It's a long read too, and I decided to keep it long-form vs a mini-series. 

The Grafana dashboard to be ported below has 9 panels, and I've ported 1/9 panels.

The size of the post, means will release as I go.

```
----------------------------------------------------------------------------------------------
```

Can you use InfluxDB for Prometheus long-term storage?

Lets assume you're using Prometheus to monitor those Docker containers on your homelab, a pretty common use case these days.

Prometheus by default gives you a data retention config of 15days. This can be extended, but it is recommended to use another solution for long-term storage.

For example, lets say we want to implement for our homelab an compliant backup retention policy of 30 days. The use of Prometheus is both not recommended and would require a larger storage hardware.

This example situation can be further worsened depending on the total and throughput of data going to be observed. As a general rule of thumb, the industry expects an observability system to be 50x the size of your systems data profile. 

Case study - Signal messages:
- Take a standard Signal 240 character message, some emojis since they cost more bytes, add the excess encryption overhead, and we arrive at an estimated 1.5KB per message
- Assuming 70million active users per month, and assuming each send 20 messages per day, would leave us with 1.4 billion messages / day
- The data volume per the 2h window would be 166.7 GB

And that is without considering that Prometheus splits up the chunks into 512MB chunks, or in our case study, ~300 chunks.

The throughput storage impact is also a scaling issue since the more "real-time" a system is, the more storage chunks / blocks created and stored by Prometheus.

Case study - Grafana Docker stack:
- Take a standard Grafana stack of Docker containers, eg. 6 containers
- Assume 15sec scraping rule for Prometheus, thats 4 data points / minute
- Assume each container collects ~40 metrics, 6 containers leave us with 240 metrics
- Assume each data point is sized as above, at 1.5KB, gives us 1.4 MB / minute
- Or 84 MB / hour, 168 MB / 2h, ~2 GB / day, ~60 GB / month 

Or 120 Prometheus storage chunks. It quickly mounts up or we have a maths error somewhere!

*Note: You might be disappointed but for the rest of the article I'll never again return to the topic of storage benchmarking for something other than Prometheus. I really should measure it and compare it, and I probably will in another post. If you fancy reading that, make sure you are following the RSS for future post updates.

# Storage options

Grafana Mimir, Thanos, Victoria Metrics and more. You can read a nice comparisson in this handy resource - [Kubernetes in my head - Prometheus Long-term Storage](https://kubernetesinmyhead.net/observability/prometheus/prometheus-long-term-storage/).

The issue is not finding the solutions, but picking one.

If you followed any homelab video setups from past few years, you will know the Grafana stack. A good stack for home observability. Most of these older videos use and recommend InfluxDB, usually in the same stacks as Prometheus (used for metrics and alerts). 

InfluxDB as a long-term storage for Prometheus becomes more desirable in this context. If you choose it you're not adding a new service and at face value the two options look viable.

```md
| InfluxDB                           | Prometheus                |
| -----------------------------------| ------------------------- |
| Time-series db                     | Time-series metrics       |
| Designed for analytics             | Designed for metrics      | 
| Time-series focused query language | Functional query language |
| Broad integrations                 | Broad integration         |
| Compression and downsampling       |                           |
```

InfluxDB docs show native api's for Prometheus, tooling for it via Telegraf, and guides on the ingestion pipeline.

There's even a CNCF talk from InfluxDB's Paul Dix, discussing native support for Prometheus data ingestion - [ Integrating Prometheus and InfluxDB - Paul Dix, InfluxData (Intermediate Skill Level)](https://www.youtube.com/watch?v=6UjVX-RTFmo) 

# Data Ingestion, Telegraf

Grafana Telegraf is the default runner recommended for getting data not meant for InfluxDB, into InfluxDB. It's main job is to  handle the data formatting. 

A common flow is to push data to Prometheus, Prometheus.remote_write to Telegraf, and Telegraf push to InfluxDB.

[telegraf.conf]
```
[[inputs.http_listener_v2]]
  service_address = ":1234"          # Port Telegraf listens on
  paths = ["/receive"]
  methods = ["POST"]          # Prometheus uses POST
  data_format = "prometheusremotewrite"
  read_timeout = "10s"
  write_timeout = "10s"
  max_body_size = "64MB"
  http_headers = {"Connection" = "keep-alive"}

```

[prometheus.yml]
```yml
remote_write:
  - url: "http://telegraf:1234/receive"  # Point to Telegraf
```

Results:
- Data gets to InfluxDB fine
- Not benchmarked, but plausibly contains lag since we're pushing from Prometheus, writing to disk, pushing to Telegraf, and pushing to InfluxDB
- Telegraf is a queue / buffer, misconfiguration here can create data mismatches; eg. you flush your buffer too often or not often enough, Telegraf can't write as quickly as you post data etc; the outcome of misconfigurations are incompatible rates of data across the data sets which will translate to incompatible dashboards, and ultimately an untrustworthy auditing data lake.
- Introduces a new service (Telegraf), and adds extra system requirements; on avg Telegraf eats up 2-3x the amount of memory that Prometheus does

# Data Ingestion, Alloy

Grafana Alloy is a runner, meanth to replace deprecated Promtail and be in general more flexible and powerful. Promtail used to be the old service used to collect the hardware or container metrics, and push them to Prometheus.

In 2026, Alloy is the recommended way to collect Docker container metrics, via a built-in cAdvisor component.

[config.alloy]
```
livedebugging {
  enabled = true // TODO: remove when not in development
}

// Targets
// > Groups all of the *write components together

prometheus.remote_write "main" {
  endpoint {
    url = "http://prometheus:9090/api/v1/write"
  }
}

prometheus.remote_write "telegraf" {
  endpoint {
    url = "http://telegraf:9273/metrics"
  }
}

// Metrics

prometheus.exporter.cadvisor "main" {
  docker_only = true
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
  forward_to = [ prometheus.remote_write.main.receiver, prometheus.remote_write.telegraf.receiver ]


  scrape_interval = "15s"
}

```

This uses Alloy runner to define a cAdvisor Prometheus scraper, relabel some of the labels from cAdvisor (not critical, for reference), and push the data to two receivers: Prometheus, Telegraf.

Results:
- Achieves the similar outputs to the Telegraf example 
- Benefit: keeps the Prometheus and Telegraf configs clean
- Benefit: more robust for data integrity across the 2 storage options since, data is more likely to arrive in sync
- Benefit: theoretically smaller latency, but not benchmarked; less service chaining, clear branching
- Benefit: centralises config around Alloy, as opposed to multiple changes across other services

# Data Ingestion, Alloy + InfluxDB

This is goes with the InfluxDB documentation that reports "native" api support for Prometheus via "/api/v*/write". 

We continue to use Alloy as the main runner, but we remove the need for Telegraf. We instead define an Influx 

[config.alloy]
```
...

prometheus.remote_write "influx" {
  endpoint {
    url = "http://influxdb:8086/api/v2/write?bucket=mybucket&org=myorganisation"

    bearer_token = "BearerTokenGoesHere=="
  }
}

...

prometheus.scrape "scraper" {
  targets    = discovery.relabel.cadvisor_rename.output
  forward_to = [ prometheus.remote_write.main.receiver, prometheus.remote_write.influx.receiver ]
  scrape_interval = "15s"
}

```

This uses the `/api/v2/write` api from InfluxDB which should have native support for Prometheus.

Results:
- Using InfluxDB v2.8
- Critical: InfluxDB throws error on ingestion due to the data schema sent; documentation does mention that Telegraf handles data differently, but I didn't expect a full stop data compability error.

# Visualisation, Grafana

Grafana to visualise our observability data, via a generic dashboard for cAdvisor from the open catalog. 

Why cAdvisor? If you didn't notice from the Alloy configs, we use the `prometheus.exporter.cadvisor` which uses [cAdvisor (repo)](https://github.com/google/cadvisor/tree/master) under the hood to measure usage and performance of Docker containers.

We will use this dashboard that measures CPU, memory, I/O, network traffic, container restarts, [Grafana dashboards / cAdvisor Docker Insights](https://grafana.com/grafana/dashboards/19908-docker-container-monitoring-with-prometheus-and-cadvisor/)

# Dashboards, Prometheus 

With the above dashboard and Prometheus as a data source, we have no issues and the system is performing nominally. 

The dashboard is designed with Prometheus in mind so all the panels use PromQL queries.

# Dashboards, InfluxDB

Here is where we need to do some work to make the InfluxDB data queries mimick Prometheus. Can we achieve like for like dashboard parity?

First blocker, InfluxDB doesn't use PromQL, and uses instead InfluxQL or Flux as query languages.

- Flux, a functional style time-series query language
- InfluxQL, a SQL-like query language

More details in the full parity chart between the two languages, [InfluxQL and Flux parity chart](https://docs.influxdata.com/influxdb/v2/reference/syntax/flux/flux-vs-influxql/#influxql-and-flux-parity
).

Note, this is only true for InfluxDB v2.8. InfluxDB v3 adopted SQL in full, and renamed Flux to InfluxQL. 
See the InfluxDB product chart for more info see this docs page [Understanding InfluxDB products](https://docs.influxdata.com/platform/identify-version/#understanding-influxdb-products)


```
InfluxQL -> SQL
Flux     -> InfluxQL
```

Given PromQL is also a functional query language, we should use Flux to recreate the dashboard.

# Panel, Running Containers, Prometheus

```
Dashboard: cAdvisor 
Panel: Running container
Data source: Prometheus
```

PromQL query.

```
count(count(container_last_seen) by (name))
```

And a more semantic query variation.

```
sum by (name) (count(container_last_seen))
```

The metric `container_last_seen` is a Gauge as defined by cAdvisor, in [Monitoring cAdvisor with Prometheus](https://github.com/google/cadvisor/blob/master/docs/storage/prometheus.md).

First we count() all the `container_last_seen` this actually gives us a total for all containers. For example, if we have three stacks running, and each container grafana, we would receive the count value of 3

We then recount the container_last_seen by name in order to get distinct services. Returning to the above example, this count will return 1.

`sum by` works similarly but is easier to reason what we expect from the output, a sum of container_last_seen count.

# InfluxDB, working with data

InfluxDB stores Prometheus metrics with the combination of _measurement and _field. The measurement will stay constant across all the queries.

From the docs, [InfluxDB, key concepts, measurement](https://docs.influxdata.com/influxdb/v1/concepts/key_concepts/#measurement):

> The measurement acts as a container for tags, fields, and the time column, and the measurement name is the description of the data that are stored in the associated fields. Measurement names are strings, and, for any SQL users out there, a measurement is conceptually similar to a table. The only measurement in the sample data is census. The name census tells us that the field values record the number of butterflies and honeybees - not their size, direction, or some sort of happiness index.

The docs also raise some interesting questions:  
- "v1.5 and earlier, all Prometheus data goes into a single measurement named _ and the Prometheus measurement name is stored in the __name__ label" - Odd, in the data we see a common `_measurement` value for all "prometheus_remote_write" metrics; `_field` and other _* values are used; the measurement name is actually stored under `_field`, and we also have a name property which in our case is the name of the observed container. At odds with the statement.
- "In InfluxDB v1.6 or later, every Prometheus measurement gets its own InfluxDB measurement." - We are using InfluxDB v2.8 and  this is not what we see; every measurement is stored under "prometheus_remote_write" and each measurement gets it's own field
- "This format is different than the format used by the Telegraf Prometheus input plugin." - Since we are using Telegraf, could it be why we see inconsystencies?; no follow-on links or comments are present in the docs, so a bit more sign-posting would be ace.

Documentation source for the above quotes, [InfluxDB, example parse Prometheus to InfluxDB](https://docs.influxdata.com/influxdb/v1/supported_protocols/prometheus/#example-parse-prometheus-to-influxdb).

"_field" gets us to the point of selecting the cAdvisor metric we're targeting.

> Docs: "The sample recording from Prometheus is stored in value column"

In our case the sample recording is stored in the "_value" column.

Lets take the a simplified query and build up from there.

```
from(bucket: "metrics")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r._measurement == "prometheus_remote_write")
  |> filter(fn: (r) => r._field == "container_last_seen")

```

"range(start: v.timeRangeStart, stop: v.timeRangeStop)" returns the range defined by the Grafana UI, as opposed to a hard-coded value eg. '5m', '6h'

Query output as JSON, since it's easier to read.

```json
{
  "table": 0,
  "_start": "2026-03-12T12:14:13.928991563Z",
  "_stop": "2026-03-12T...",
  "_time": "2026-03-12T...",
  "_value": 1773317667,
  "_field": "container_last_seen",
  "_measurement": "prometheus_remote_write",
  "container_label_com_docker_compose_config_hash": "271ce3",
  "container_label_com_docker_compose_container_number": "1",
  "container_label_com_docker_compose_image": "sha256:f820",
  "container_label_com_docker_compose_oneoff": "False",
  "container_label_com_docker_compose_project": "base-monitoring-stack",
  "container_label_com_docker_compose_project_working_dir": "~/base-monitoring-stack",
  "container_label_com_docker_compose_replace": "e05564",
  "container_label_com_docker_compose_service": "alloy",
  "container_label_com_docker_compose_version": "2.35.1",
  "container_label_org_opencontainers_image_ref_name": "ubuntu",
  "container_label_org_opencontainers_image_source": "https://github.com/grafana/alloy",
  "container_label_org_opencontainers_image_version": "24.04",
  "host": "e35f",
  "id": "/system.slice/docker-76c4d.scope",
  "image": "grafana/alloy:latest",
  "instance_job": "75c9e",
  "name": "alloy"
}
```

Note, the size of the above entry is 1KB. Close to the estimated values at the top of the article.

All the `container_label_*` entries are from Docker itself, and not related to the architecture described so far, not cAdvisor, not Alloy, not Prometheus, not InfluxDB. Let's filter these out, for now.

```json
{
  "table": 0,
  "_start": "2026-03-12T12:14:13.928991563Z",
  "_stop": "2026-03-12T...",
  "_time": "2026-03-12T...",
  "_value": 1773317667,
  "_field": "container_last_seen",
  "_measurement": "prometheus_remote_write",
  "host": "e35f",
  "id": "/system.slice/docker-76c4d.scope",
  "image": "grafana/alloy:latest",
  "instance_job": "75c9e",
  "name": "alloy"
}
```

This is now our schema for a `container_last_seen` metric entry.

> How do I develop a feel for InfluxDB data and queries?

The best way to query and develop an feel for the data in InfluxDB is via the InfluxDB query UI. 

Navigate to `InfluxDB UI / Data Explorer` and toggle the 'Simple Table' view.

You might be tempted to use `Grafana UI / Connections / Data sources / InfluxDB / your_query`, but the table UI here is lacking. You'll miss key debug information that is present in InfluxDB Query UI.

The Influx / Data Explorer view shows us the types stored in each column, eg. 'Group string'. And these types will impact the Flux queries. 

## Metric schema

What if I wanted to see a single Metric schema in InfluxDB? 

```
from(bucket: "metrics")
  |> range(start: v.timeRangeStart, stop:v.timeRangeStop)
  |> keys()
  |> keep(columns: ["_value"])
  |> group()
  |> distinct()
```

how us all the values available in InfluxDB. All the "container_label_*" fields, were post-processed as mentioned above.

This schema is the default schema for all metrics. 

```
_start
_stop
_field
_measurement
branch
goarch
goos
goversion
host
instance
job
revision
tags
version
kernelVersion
osVersion
id
major
minor
operation
device
image
name
cpu
failure_type
scope
interface
state
boot_id
machine_id
system_uuid
mode
```

## Metric types

What if I wanted to see all the metric types collected by cAdvisor?

```
from(bucket: "metrics")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop) // Adjust the time range as needed
  |> filter(fn: (r) => r._measurement == "prometheus_remote_write")
  |> group(columns: ["_field"])
  |> distinct(column: "_field")
```

Produces a list comparable to the ones from cAdvisor, [Monitoring cAdvisor with Prometheus](https://github.com/google/cadvisor/blob/master/docs/storage/prometheus.md)

```
cadvisor_build_info
cadvisor_version_info
container_blkio_device_usage_total
container_cpu_load_average_10s
container_cpu_system_seconds_total
container_cpu_usage_seconds_total
container_cpu_user_seconds_total
container_fs_inodes_free
container_fs_inodes_total
container_fs_io_current
container_fs_io_time_seconds_total
container_fs_io_time_weighted_seconds_total
container_fs_limit_bytes
container_fs_read_seconds_total
container_fs_reads_bytes_total
container_fs_reads_merged_total
container_fs_reads_total
container_fs_sector_reads_total
container_fs_sector_writes_total
container_fs_usage_bytes
container_fs_write_seconds_total
container_fs_writes_bytes_total
container_fs_writes_merged_total
container_fs_writes_total
container_last_seen
container_memory_cache
container_memory_failcnt
container_memory_failures_total
container_memory_kernel_usage
container_memory_mapped_file
container_memory_max_usage_bytes
container_memory_rss
container_memory_swap
container_memory_usage_bytes
container_memory_working_set_bytes
container_network_receive_bytes_total
container_network_receive_errors_total
container_network_receive_packets_dropped_total
container_network_receive_packets_total
container_network_transmit_bytes_total
container_network_transmit_errors_total
container_network_transmit_packets_dropped_total
container_network_transmit_packets_total
container_oom_events_total
container_scrape_error
container_spec_cpu_period
container_spec_cpu_shares
container_spec_memory_limit_bytes
container_spec_memory_reservation_limit_bytes
container_spec_memory_swap_limit_bytes
container_start_time_seconds
container_tasks_state
machine_cpu_cores
machine_cpu_physical_cores
machine_cpu_sockets
machine_memory_bytes
machine_nvm_avg_power_budget_watts
machine_nvm_capacity
machine_scrape_error
machine_swap_bytes
scrape_duration_seconds
scrape_samples_post_metric_relabeling
scrape_samples_scraped
scrape_series_added
up
```

The "_field" values with "container_*" prefix represent cAdvisor metrics.

The "_field" values with "machine_*" represent Prometheus hardware metrics.

The "_field" values with "scrape_*" have an unknown provenance, since they could be produced by either Prometheus scrape job or the Alloy runner.

The "_field" value "up" has an unknown provenance.

All of these represent the "type" of each metric, which will have a version of the above metric schema. 

# Panel, Running Containers, InfluxDB

```
Dashboard: cAdvisor [historic]
Panel: Running container
Data source: InfluxDB
```

The panel is powered by the following Flux query.

```
from(bucket: "metrics")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r._measurement == "prometheus_remote_write")
  |> filter(fn: (r) => r._field == "container_last_seen")
  |> group(columns:["name"])
  |> distinct(column: "name")
  |> keep(columns: ["_time", "_value"])
  |> count()
```

The beginning of the query is similar to our simple starter query, and it just narrows down the data to "container_last_seen".

"group()" is interesting, InfluxDB groups data by: 

```
((ALL _underscore columns - _time - _value) + ALL remaining columns)
```

For reference, the PromQL grouping, if done via by (), below grouping by name.

```
count(count(container_last_seen) by (name))
```

Back to InfluxDB we have 2 options:
- We can remove all grouping via an empty call to "group()". This creates an aggregate base, and columns no longer contain groups, useful for sums totals etc. eg. group by name "group(columns: ["name"])"
- Or we can define a group like the PromQL, by name. Remember from above that "name" is one of the attributes on the metric type, so we will have that as a column. "group()"

Note that for this example you should switch the InfluxDB / Data Explorer view to "Table".

Here is a query without "group()"". 

```
from(bucket: "metrics")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r._measurement == "prometheus_remote_write")
  |> filter(fn: (r) => r._field == "container_last_seen")
  |> distinct(column: "name")
  |> keep(columns: ["_time", "_value", "name"])
```

"distinct()"", will make sure that we're counting services not instances of those services.

The output is a list of tables matching the amount of containers, where each table contains 1 entry "{ _value, name }". Again this returns a collection of TABLES not values, and we need the values for aggregation. 

"group()"" will remove all groupings, and set up for correct aggregation. One table, many metrics.

```
from(bucket: "metrics")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r._measurement == "prometheus_remote_write")
  |> filter(fn: (r) => r._field == "container_last_seen")
  |> distinct(column: "name")
  |> group()
  |> keep(columns: ["_time", "_value", "name"])
  |> count()
```

We also need to filter the empty "name" samples. Unclear why the data is reporting entries with "_field" name as "". 

```
from(bucket: "telegraf")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r._measurement == "prometheus_remote_write")
  |> filter(fn: (r) => r._field == "container_last_seen" and r.name != "")
  |> distinct(column: "name")
  |> group()
  |> keep(columns: ["_time", "_value", "name"])
  |> count()
```

"keep()" just reduces the data to just what we need, discarding the other columns.

And we need to do the same filtering on the Prometheus dashboard query.

```
sum by (name) (count(container_last_seen{name!=""}))
```

# Panel, Running Containers, Reflection

```
Dashboard: cAdvisor [historic]
Panel: Running container
Data source: InfluxDB
```

InfluxDB Flux (here in v2.8) queries here are too verbose. Most of it, caused by the double filtering of measurement and field. It's unclear from the docs if this should be expected or not.

Changes coming in v3 which might clarify or solve the issue, but v3 also contains broad redesigns with multiple api changes. Because of these redesigns, v2.8 will be my choice for now.

On syntax, PromQL is a lot nicer, and I would favor long-term storage solution with native PromQL support for parity and max comfort.

Overall, this panel port to InfluxDB data source is a "PASS". Niggles aplenty, but the hypothesis stands.

To be continued ....
