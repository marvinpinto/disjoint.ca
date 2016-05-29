---
author_twitter_username: 'marvinpinto'
date: 2016-05-11T08:19:15-04:00
description: Create an Ubuntu-bootable USB drive using OSX
lastmod: 2016-05-11T08:19:15-04:00
meta_image: "images/marvin-pinto-profile.jpg"
meta_image_height: 700
meta_image_width: 700
tags:
  - osx
  - bootdrive
title: How to create a bootable USB drive on OSX
---

1. First, convert the ISO to an IMG file using the `hdiutil` utility.

    ``` bash
    hdiutil convert -format UDRW -o ~/path/to/target.img ~/path/to/ubuntu.iso
    ```

    Note that since OSX tends to append a `.dmg` suffix to the file name, you
    will probably have to rename it to a `.img` file.

1. Run the diskutil utility to get a list of the current devices.

    ``` bash
    diskutil list
    ```

1. Insert the USB drive and run the same diskutil command again.

    ``` bash
    diskutil list
    ```

    Take a note of the node assigned to the USB drive (i.e. `/dev/disk1`)

1. Unmount the disk.

    ``` bash
    diskutil unmountDisk /dev/diskN
    ```

1. Begin writing the image file to disk.

    ``` bash
    sudo dd if=/path/to/downloaded.img of=/dev/rdiskN bs=1m
    ```

1. After that has finished, eject the USB drive using the `diskutil` utility.

    ``` bash
    diskutil eject /dev/diskN
    ```

That's all there is to it, your new USB drive should be bootable!

_(This was all very useful and relevant to me when I used to run Linux on a
Macbook, hopefully it's helpful to someone else)_
