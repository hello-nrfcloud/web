---
title: Thingy:91 with Solar Shield
tagline: Powerfoyle solar cell converts any form of light to electrical energy
links:
  learnMore: https://www.exeger.com/updates/exeger-and-nordic-semiconductor-in-partnership/
  documentation: https://infocenter.nordicsemi.com/index.jsp?topic=%2Fug_thingy91%2FUG%2Fthingy91%2Fintro%2Ffrontpage.html
firmware:
  version: 1.1.3
  link: https://github.com/hello-nrfcloud/firmware/releases/tag/v1.1.3
  bundleId: APP*962abcac*v1.1.3-sol-lp-mmflt
mfw:
  version: 1.3.6
  link: https://www.nordicsemi.com/Products/Development-hardware/Nordic-Thingy-91/Download?lang=en#infotabs
  bundleId: MDM_FULL*551ba99b*mfw_nrf9160_full_1.3.6
abstract: >-
  The Nordic Thingy:91 has been fitted with a light harvesting add-on, giving
  the platforms autonomous charging capabilities.
video:
  youtube:
    id: 5f10sjTznlc
    title: Getting Started with the Nordic Thingy:91 and Powerfoyle Shield
includedSIMs:
  - ibasis
defaultConfiguration:
  updateIntervalSeconds: 120
  gnssEnabled: true
configurationPresets:
  - name: Real-time mode
    updateIntervalSeconds: 10
    dataUsagePerDayMB: 3
  - name: Interactive mode
    updateIntervalSeconds: 120
    dataUsagePerDayMB: 1.5
  - name: Low-power mode
    updateIntervalSeconds: 600
    dataUsagePerDayMB: 0.05
  - name: Ultra-Low-power mode
    updateIntervalSeconds: 3600
    dataUsagePerDayMB: 0.01
---

The Nordic Thingy:91 Solar Shield is a plug-and-play prototyping platform.
Powerfoyle solar cell is mounted onto the Thingy to quickly get started
exploring the endless possibilities with solar powered IoT applications and to
develop products with eternal life or even battery-free products.​

The Thingy:91 runs the
[`asset_tracker_v2` application](https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/applications/asset_tracker_v2/README.html)
configured in low-power mode, requires 3.4 mA when sending updates to the cloud
every minute, or 2.3 mA when sending updates to the cloud every hour.

Powerfoyle is a groundbreaking solar cell technology made by Exeger. Powerfoyle
has a uniquely flexible and customizable design to integrate seamlessly for
sustainable and attractive products. To learn more the innovation and
application areas, visit [www.exeger.com](https://www.exeger.com/).​

## Demo devices

Here are some demo devices you can view:

- [SOL-TRD#1](/1.phxf9c)
