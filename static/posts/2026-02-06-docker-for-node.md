---
title: Docker for Node
url: 2026-02-06-docker-for-node
desc: ''
updated: 06/02/2026
created: 06/02/2026
tags: ['docker', 'node', 'security']
---

# Docker for Node

Any non-Alpine Linux images have a significant amount of vulnerabilities. However Alpine is bare-bones and requires more work to get setup.

> Worth saying that vulnerabilities, what are vulnerabilities etc is tricky to define here. I'm increasingly feeling like the ranking of vulnerabilities is biased towards 'high', but I think it's important to zoom in on the volume of vulnerabilities here

Scenario: host a micro-service with Typescript modules and some features to post out to another Docker service. Think about it as a simple lambda. 

This doesn't need a full-fat Linux distro for the container, so why would you use it?

Well... I think you'd use it because it's there. 

Going to the [Node images repository](https://hub.docker.com/_/node/tags) and you can see huge amount of image options.

Let's take the [node:24.13-trixie](https://hub.docker.com/layers/library/node/24.13-trixie/images/sha256-542d79268854032f4580af3af391fc3246d0b6dc4b45accb9617ea939bbbc709) for example:
- It has a total for 6 high, 9 medium, 136 low vulnerabilities
- Node v24.13 introducing 6 high, 1 medium, 1 low vulnerabilities

If we filter the vulnerabilities we notice that the entire image has just 1 'unpatchable' vulnerability, which at the time of writing is 14days old.

# Not plug and play

A few years ago I experienced a hard bug with downstream dependency due to Debian security repo changing locations, and it bricked a lot of images - including the Node image I was using.

The [Stack Overflow question](https://stackoverflow.com/questions/68802802/repository-http-security-debian-org-debian-security-buster-updates-inrelease/76153964#76153964) for that issue has 118k views.

That experience made me audit the images more before using them. 

The community vibe around images is more 'just plug and play', a naive view that is very far from the truth. 

Images are very sensitive and can't be relied upon fully even when published by Node themselves.

# Suggestions

If you are using hosted images, learn to review the images you use, what dependencies they have, what fixes they require.

In general, choosing an Alpine base gives you most stable base.

If you really want certainty, build your own image from an Alpine base, and reuse it.

Review the CVEs that can't be fixed for your own judgment on the issue:
- What is it about? 
- How can it be exploited? 
- How does it affect your code? 
- How doesn't it stack on the MITRE framework

## How to audit, quickly

This is just the quick process, there's more to it that this but you can start with this.

- Go to [Docker hub](https://hub.docker.com/) and search for your image
- Look for 'official' badge
> Ignore DHI images for now, even though these will be top of the list; will cover DHI in another post

On /image page
- Tag Summary (right column)
- Review and make note of recently updated tag
- Check pulls 

> For non-official/obscure images you want to see how many people are using it; not to say that use is a direct proxy for a quality image, but it's a data point

- Click on "Tags"

On /image/tags page
- Look for the 'recent' tags from above
- Review vulnerabilities, size, and commands

> As part of the command you can see the name of the tag, can be used in Docker file definitions

- Open the tag page

On /images/tags/tag page
- Review where the vulnerabilities are coming from

> Up to this point all the vulnerability totals are sums for the whole image; however, the base image in some case will have 0 or more vulnerabilities, in addition to the module added to the base image

- Review the CVEs themselves
- You can expand a vulnerability to see further details, review the dates
- Then I navigate to the Docker.Scout page for the vulnerability

> This gives you more insight into the mechanics of the CVE, and based on this decide how to deal with it + impact of it on your app

- Review the scripts with alert badges

> Important to understand the scripts with issues, especially if you might have to rebuild the image itself
