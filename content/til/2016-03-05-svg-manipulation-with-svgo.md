---
date: 2016-03-05T15:29:11-05:00
tags:
  - svg
title: SVG manipulation with 'svgo'
meta_image: "marvin-pinto-profile.jpg"
meta_image_width: 700
meta_image_height: 700
---

```bash
npm install svgo
```

`svgo` is a very useful tool for (in my case) very basic svg manipulation. It
removes extra inkscape cruft and outputs a "minified" svg of sorts:

```bash
svgo --pretty icon_79124.svg
```

Produces:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <g stroke="#000" stroke-width="8" stroke-linecap="round" stroke-miterlimit="10" fill="none">
    <path d="M49.942 49.843L34.896 34.865M49.942 49.887L64.896 34.91M49.942 49.887l14.953 14.978M49.942 49.887L34.99 64.864"/>
  </g>
  <circle stroke="#000" stroke-width="8" stroke-miterlimit="10" cx="50" cy="49.917" r="39.833" fill="none"/>
</svg>
```

Which can be easily copy/pasted directly into an html file!

([original source][1])

[1]: https://web-design-weekly.com/2014/10/22/optimizing-svg-web
