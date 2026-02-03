---
title: FOSS tools complex?
url: 2025-02-21-foss-tools-complex
desc: ''
updated: 21/02/2025
created: 21/02/2025
tags: ['foss']
---

# FOSS tools complex in 2025?

Apache Kafka for example has an air of complexity and flamboyance around it.

A vast majority of Hacker News comments rag on Kafka, the latest comments making it sound like a "CV-padding technology, needlesly complex, overtly unnecessary". 

Similar myths around Elastic Search: complex, hard to maintain, expensive. 

If I were too include languages here, Haskell would be the top contender: considered too academic, impractical, obtuse, and a full stop questionable choice. 

What is the real damage of these myths?

Because of the grapevine new people don't use Kafka, new people avoid Elastic Search. 

This perpetraits a scenario where the hard tools remain hard because new people can't shape their structure and usage. Without new users the tooling teams can't understand the new UX problems they need to solve.

More importantly where are these people to going for replacements?

For Kafka replacements, people go to the cloud. They end up using AWS Kinesis streams, or AWS EventBridge - both expensive and complex services. Argueably as complex as Kafka and closed source.

For Elastic Search replacements, people go to the cloud again, to database provider services like MongoDB Atlas, or to AWS OpenSearch. Both of these options are costly and just as complex.

Cost in itself should be a criteria for businesses, if a managed service costs but is more easy to manage then we need to asses the trade-off. Sometimes however the costs act as feature gates and the managed services are just as hard to maintain or grok.

For individuals, cost is a barier, no doubt about it. Yet, despite this barrier, the industry wants developers who can build real-time systems or complex text-search.

Where and how do we get these new developers? Where and how do they gain this experience? 

Cloud services, costs, and cost-gating features limits the market from gaining new developers, and limits developers from learning these tools.

## Kafka and the Apache stack

Apache Kafka for the most part is FOSS. It has for-cost closed source components and services, but the basic streaming is there. Kafka can also run in a homelab and is not resource hungry. 

For the next few days I plan to post further updates on this: Kafka for a timeseries data injestion pipeline.

In other words a "soft real-time" problem.

## Elastic Search

In 2020 I used a cloud managed Elastic Search service through AWS. This was before their business bust up. 

At the time, it wasn't considered a good architecture option internally, because of costs. Maintenance was also a factor.

Our challenge was to build real-time VOIP telecom systems, transcribe the call, and make it available within a UI. This is a "hard real-time problem", since all data goals must be met.

Elastic Search allowed us to achieve transcription, indexing, and retrieval, in less than 200ms. With networking done over WebSockets, in a event-driven system. 

Despite the results, Elastic Search wasn't recommended because of costs and maintenance.

On management, our index required used 3 shards, and a fairly high spec set of machines. No where near as complex as it could get; a baby Elastic Search setup. 

Fast forward to 2025 and using Elastic Search a vastly improved experience, having managed to run a node with 1G memory, bulk index in < 30s, and make text search calls with <200ms retrival. Not the largest index in the world, but I can tell that even with 1G limitation it can take more documents and I don't expect the retrieval to be impacted. 

Elastic Search is FOSS, configuration was straighforward, and the query experience is modern and straightforward - GraphQL-like in a way. 

## Summary

Without Elastic Search, how else can you build text search systems at home on a Raspberry Pi?!

Without Kafka how else can you ingest timeseries data from MCUs or replicate AWS Kinesis and AWS EventBridge services?

Both are important tools for modern software development, and should be on everyone's radar who wants design data-intensive apps.

Most importantly, they are FOSS and local, and grant you full control.

Just add a pinch of energy and time investment.
