---
date: 2016-03-18T19:10:28-04:00
tags:
  - python
  - pip
  - setup.py
title: pip and transitive dependencies
meta_image: "marvin-pinto-profile.jpg"
meta_image_width: 700
meta_image_height: 700
---

Suppose you have python project `project-a` with a `requirements.txt` that
looks like:

``` text
project-b==0.0.1
```

And `project-b`'s `requirements.txt`:

``` text
python-dateutil==2.4.2
```

Now if you pip install `project-a`'s dependencies using something like `pip
install -r requirements.txt`, you will be very sad to find that the
`python-dateutil` library you have installed for `project-a` is actually the
newest released version of `python-dateutil`, and not necessarily `2.4.2`.

**Why is this?**

If a transitive dependency is _not explicitly specified_ in a project's
`requirements.txt`, pip will grab the version of the required library specified
in the project's `install_requires` section (of `setup.py`). If this section
does not explicitly pin a version, you end up getting the latest version of
that library.

**What should I do?**

If your application needs a specific version of a transitive dependency, pin it
yourself in your application's `requirements.txt` file. Then pip will do the
right thing. You do also have the option of pinning the version in `setup.py`
itself, but [this is considered bad form][1].

This was more of a reminder to myself rather an a TIL. Hopefully useful to you
too!

[1]: https://packaging.python.org/requirements/#install-requires
