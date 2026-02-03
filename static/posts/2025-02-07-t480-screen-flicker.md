---
title:  Thinkpad T480, screen flicker fix
url: 2025-02-07-t480-screen-flicker
desc: ''
updated: 07/02/2025
created: 07/02/2025
tags: ['hardware']
---

#  Thinkpad T480, screen flicker fix

Linux Mint 22.1 on the T480 causes screen flickering. 

To replicate:
- check the login screen once the laptop has come out of suspend
- or open a dock applet
- hold the mouse on on a dropdown for a long time. 

Issue seems to be related to transparency and screen sleep, in X11.

## Fix

### mesa-utils

Check that `mesa-utils` package is installed 

```sh
apt list | grep "mesa-utils"
```

Install the package if not present

### X11 config

Open the X11 config directory

```sh
cd /etc/X11/xorg.conf.d
```

Create the `20-intel.conf` within the above directory, with the following contents

```sh
Section "Device"
 Identifier "Intel Graphics"
 Driver "Intel"
 Option "AccelMethod" "sna"
 Option "TearFree" "true"
EndSection
```

### Reboot

---

> You can also fix it by installing KDE Plasma :P /s
