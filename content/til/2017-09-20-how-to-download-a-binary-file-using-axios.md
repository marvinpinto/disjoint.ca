---
author_twitter_username: marvinpinto
date: 2017-09-20T14:48:28-04:00
description: How to download a binary file using Axios
lastmod: 2017-09-20T14:48:28-04:00
meta_image: marvin-pinto-profile.jpg
meta_image_height: 700
meta_image_width: 700
tags:
  - axios
  - nodejs
title: How to download a binary file using Axios
---

If you're not already familiar, the [axios library][axios-github] is a really
well done abstraction on top of raw XHR requests.

In a way the simplicity of its API reminds me of the [Python
Requests][python-requests] library, which was why we chose to use axios in both
the frontend & backend code at [Switchboard][switchboard].

I could not originally figure out how to download a binary file using axios in
a Node.js environment so hopefully this little snippet is useful to the next
person who looks this up.

``` js
import axios from 'axios';
import fs from 'fs';

// ...

return axios.request({
  responseType: 'arraybuffer',
  url: 'http://www.example.com/file.mp3',
  method: 'get',
  headers: {
    'Content-Type': 'audio/mpeg',
  },
}).then((result) => {
  const outputFilename = '/tmp/file.mp3';
  fs.writeFileSync(outputFilename, result.data);
  return outputFilename;
});
```

The trick is here is to set the `responseType` to `arraybuffer` and then write
the chained promise output data to a file on disk.

[axios-github]: https://github.com/mzabriskie/axios
[python-requests]: http://docs.python-requests.org
[switchboard]: https://goswitchboard.com
