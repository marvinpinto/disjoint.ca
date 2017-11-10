---
author_twitter_username: "marvinpinto"
meta_image: "marvin-pinto-profile.jpg"
meta_image_width: 700
meta_image_height: 700
date: 2017-11-10T12:33:26-05:00
lastmod: 2017-11-10T12:33:26-05:00
title: "Bookmarkable Google Analytics today view"
tags:
  - 'lifehack'
---

If you, like me, use Google Analytics and are annoyed at the extra clicks it
takes to change the date range to `today`, this little tip might make your life
slightly easier!

I have Analytics accounts for multiple websites and changing the date range on each of them to `today` can understandably get tedious. For a high-level overview, I'm a fan of the `Behavior -> Overview` report. My URL for that report is:

``` text
https://analytics.google.com/analytics/web/#report/content-overview/a70495014w107707250p112201163/
```

Note that `a70495014w107707250p112201163` here, as far as I am aware, is unique
to me. Yours will be different. I'll refer to this value as the
`report-property-id`.

When you change the date range to `today`, you will notice that it appends a
form of today's date to the URL. Something like:

``` text
%3F_u.date00%3D20171110%26_u.date01%3D20171110/
```

Since there is no other way of bookmarking the 'today' view, this feels like a
good candidate to turn into a [bookmarklet][bookmarklet]. Create a bookmarklet
in your browser with the following contents, replacing `report-property-id`
with your unique value:

``` js
javascript:(function(){function d(a){a=String(a);a.length<2&&(a="0"+a);return a}var c=new Date,b="";b+=c.getFullYear();b+=d(c.getMonth()+1);b+=d(c.getDate());location.href="https://analytics.google.com/analytics/web/#report/content-overview/<report-property-id>/?_u.date00="+b+"&_u.date01="+b})();
```

And that's it. You should now be able to jump to the `Behavior -> Overview ->
today` view whenever you click on the bookmarklet! You can use this technique
to turn any Google Analytics report/view into a `today` bookmarklet.

[bookmarklet]: https://en.wikipedia.org/wiki/Bookmarklet
