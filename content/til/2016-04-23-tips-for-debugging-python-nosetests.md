---
date: 2016-04-23T11:07:52-04:00
tags:
- python
- nosetest
title: Tips for Debugging Python Nosetests
meta_image: "images/marvin-pinto-profile.jpg"
meta_image_width: 700
meta_image_height: 700
---

**Running a single unit test**

The incantation to run a single nose test is:

``` text
nosetests -v module.path:PythonClassName.method_name
```

For example, assuming your test directory structure looks something like:

``` text
tests/
├── __init__.py
├── __init__.pyc
├── test_delete_user.py
└── test_update_user.py
```

And `test_update_user.py` contains something along the lines of:

``` python
class TestUpdateUser(unittest.TestCase):

    def test_non_existent_user(self):
        self.assertTrue(True)
```

The following would only run the test named `test_non_existent_user` contained
in the `test_update_user.py` file.

``` bash
nosetests -v tests.test_update_user:TestUpdateUser.test_non_existent_user
```

This is very useful if you need to, for example, strace a unit test in order to
understand what's happening under the hood.

``` bash
strace -f -s 100000 nosetests -v tests.test_update_user:TestUpdateUser.test_non_existent_user
```

**Triggering pdb on errors or failures**

One very useful nose feature is its ability to drop you into pdb whenever it
encounters failures or errors.

The relevant command line flags:
``` text
  --pdb                 Drop into debugger on failures or errors
  --pdb-failures        Drop into debugger on failures
  --pdb-errors          Drop into debugger on errors
```

**Setting breakpoints inside unit tests**

``` python
from nose.tools import set_trace; set_trace()
```

Nose will break you out into the debugger whenever it encounters this
statement. This works across _all_ python source files (application or test
code).

The reason `import pdb; pdb.set_trace()` does not work as you would expect is
because nose by default captures stdout (which you can work around by supplying
the `-s` flag)
