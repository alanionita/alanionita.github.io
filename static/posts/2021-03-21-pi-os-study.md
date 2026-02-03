---
url: 2021-03-21-pi-os-study
title:  Raspberry Pi OS Study
desc: ''
updated: 21/03/2021
created: 21/03/2021
tags: ['hardware']
---
#  Raspberry Pi OS Study

I use the Raspberry Pi a lot, they are great little devices for prototyping ideas and building projects.

Choosing an OS has been tricky because there are so many options out there.

Requirements:

```md
[ ] easy headless setup (no monitor, keyboard, or mouse needed)
[ ] reliable OS
[ ] flexible OS
[ ] transferable skills
[ ] small footprint
[ ] solid support
[ ] ROS support*
```

Grades:

```
❌ fail
✅ pass
🟡 potential
🏁 in progress
```



## What is my process

Using [Ansible](https://www.ansible.com) to run a set of playbooks on the Pi: OS hardening, and improved the security etc. 

In general I just care about an OS that can take minutes to flash and is easy to SSH into via Ansible once connected to my network.

I'm planning to write a post on Ansible soon.

## What is the hardware?

I prefer the standard RPi unit usually the 4GB or 8GB version.

Although I've tried the Pi Zero, I've not used it for projects recently. I would use it if I need the form factor, but using it will probably make me change the OS.

## What was I using?

[HypriotOS](https://blog.hypriot.com), which is an OS that comes with Docker pre-installed.

Hypriot was also really easy to configure before mounting - it came with a clear documentation and the config files were easy to get to.

Unfortunately the HypriotOS community and support is small at the minute and I've encountered a few issues with the OS.

I wanted to move away from it before support became a problem.

```md
✅ easy headless setup (no monitor, keyboard, or mouse needed)
🟡 reliable OS
✅ flexible OS
🟡 transferable skills
❌ ROS support*
✅ small footprint
❌ solid support
```

## Why, RPi OS?

Raspberry Pi OS (Raspian) was harder to set up in headless mode a few months ago. In my case I remember there being a lot of steps in order to set everything up.

I should test this again, but since my main requirement is not met (ROS support) I might not use it anyway.

```md
🟡 easy headless setup (no monitor, keyboard, or mouse needed)
✅ reliable OS
✅ flexible OS
🟡 transferable skills
❌ ROS support*
✅ small footprint
✅ solid support
```

## OS Study

### Ubuntu Server LTS 20.04

Download from [here](https://ubuntu.com/download)

Best option with a small footprint (until you update/upgrade). Support with ROS and Ubuntu itself is a popular OS in general which makes troubleshooting easy.

LTS stands for Long Term Support so I can reliably reuse this image for projects for the next few years.

This also means that it will be a popular option for enterprise clients too so all the skills learned are transferable, which I can't say the same about Raspberry Pi OS or HypriotOS.

The setup is simple because Ubuntu Server is included in the [Raspberry Pi Imager](https://www.raspberrypi.org/software/).

```md
✅ easy headless setup (no monitor, keyboard, or mouse needed)
✅ reliable OS
✅ flexible OS
✅ transferable skills
✅ ROS support*
🟡 small footprint
✅ solid support
```

Not the smallest OS on the list, especially after updating and upgrading.

Result: best pick for now

### Alpine Linux

Download from [here](https://alpinelinux.org/about/)

Huge fan of Alpine from Docker and I really wanted to make this work as my server driver.

Again the ROS requirement is a 'no-go', but for other project this could be an ideal OS.

The size and performance is awesome!

Skills learned through using the OS are not as transferable as Ubuntu, but you can reuse those skill if you ever deal with Docker instance - which is still a plus.

The setup on the site is a lot more complex that what I came up with

```sh
// 1. Download the tar from the Alpine site

// 2. Create a bootable SD card using PI imager

// 3. Extract the tarball contents to the SD card.

tar -xvf alpine-rpi-3.13.2-aarch64.tar.gz -C {SD-card}

// 4. Pop the SD card into the Pi 
```

Annoyingly I need a desktop and peripherals in order to complete the setup.

```md
❌ easy headless setup (no monitor, keyboard, or mouse needed)
✅ reliable OS
✅ flexible OS
✅ transferable skills
❌ ROS support*
✅ small footprint
✅ solid support
```

Result: cannot complete the setup in headless mode

## Ubuntu Core

Download from  [here](https://ubuntu.com/core)

An OS specifically designed for embedded solutions.

Core has a lot of interesting features for embedded: OTA updates, secure boot, full disk encryption, recovery mode, and Snaps.

Everything apart from Snaps is awesome and as an ex-embedded developer I was drooling when I read about it.

[Snaps](https://ubuntu.com/core/docs/snaps-in-ubuntu-core) are 🟡 for me. A lot of people are strongly against it, but I'm not one of them.

I can live with the format, but it does introduce a new step in the workflow: compiling your app to a Snap.

After a bit of reading I discovered the official Canonical advice re: Ubuntu Core:

> To be used as part of a set and forget system. For deployment please use Ubuntu Server

That makes sense now and it's a serious contender for finished projects.

The setup is simple because Ubuntu Core is included in the [Raspberry Pi Imager](https://www.raspberrypi.org/software/).

Annoyingly though Ubuntu Core requires a desktop and peripherals in order to complete the setup.

```md
❌ easy headless setup (no monitor, keyboard, or mouse needed)
✅ reliable OS
❌ flexible OS
❌ transferable skills
❌ ROS support*
✅ small footprint
✅ solid support
```

I marked it down for flexibility because Ubuntu Core is not meant for development. Also marked it down for transferable skills since it seems like there's a lot of specific Ubuntu Core knowledge needed to make this work and those skills are not all transferable.

Result: cannot complete the setup in headless mode

## SkiffOS

Download from [here](https://github.com/skiffos/skiffos)

Skiff is a lightweight OS and is very similar to HypriotOS. 

It's built around Docker using Buildroot to produce a minimal 'single-file' host OS. 🤯

Another benefit here was the fact that I can configure the build before compilation so I can probably reduce the amount of work done on the machine to complete the setup.

The config files use `yaml` which is a super transferable skill in Docker and Cloud environments.

```md
🏁 easy headless setup (no monitor, keyboard, or mouse needed)
🏁 reliable OS
✅ flexible OS
✅ transferable skills
❌ ROS support*
✅ small footprint
🏁 solid support
```

The setup seems easy enough but I had issues with the gcc and make so I couldn't actually try this out properly.

The fact that it comes with Docker pre-installed makes this a really 🌶 option for flexibility. It's also got a really small footprint depending on which layers you need and how many.

🏁 means that although I started testing, I couldn't make my mind just yet. SkiffOS is a new project so I won't be able to tell how they are with future support just yet.

Result: Needs more testing in order to get a clear view.

## Results summary

Final rankings

```md
| Criteria              | RPi OS | Ubuntu    | Alpine  | Ubuntu   | SkiffOS |
|                       |        | 20.04 LTS | Linux   | Core     |         |
| --------------------- | ------ | ----------| ------- | -------- | ------- |
| easy headless init    | 🟡     | ✅        | ❌      | ❌      | 🏁      |
| reliable OS           | ✅     | ✅        | ✅      | ✅      | 🏁      |
| flexible OS           | ✅     | ✅        | ✅      | ❌      | ✅      |
| transferable skills   | 🟡     | ✅        | ✅      | ❌      | ✅      |
| small footprint       | ✅     | 🟡        | ✅      | ✅      | ✅      |
| solid support         | ✅     | ✅        | ✅      | ✅      | 🏁      |
| ROS support*          | ❌     | ✅        | ❌      | ❌      | ❌      |
```