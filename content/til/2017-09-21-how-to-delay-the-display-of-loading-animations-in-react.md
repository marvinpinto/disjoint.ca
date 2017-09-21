---
author_twitter_username: marvinpinto
date: 2017-09-21T14:30:50-04:00
lastmod: 2017-09-21T14:30:50-04:00
meta_image: marvin-pinto-profile.jpg
meta_image_height: 700
meta_image_width: 700
tags:
  - reactjs
title: How to delay the display of loading animations in React
---

There are times when you might be tempted to display a [loading
indicator][spinkit] to inform the user that _something is happening_ in the
background.

Reasonable times to do this are after user-initiated actions that trigger
network activity - such as "Purchase a skirt", or in the scenario where you
have [code-splitting][webpack-code-splitting] enabled with
[react-router][react-router] - "Navigate to new page".

``` text
// ...

render() {
  const {isBusy} = this.props;

  if (isBusy) {
    return <div>Loading...</div>;
  }

  return <div>Ready!</div>;
}

```

However what you will notice is that if the background task finishes **too
quickly** - depending on a powerful machine or fast network - you end up with
the DOM flickering `Loading...` momentarily before settling on `Ready!`.

This, of course, isn't a great user experience so let's try and improve that.
What I'm going to demonstrate here is the use of a timer in a custom component
that only displays the `Loading...` message after a set amount of time has
passed.

``` text
import React from 'react';

class LoadingMessage extends React.Component {
  constructor(props) {
    super(props);
    this.enableMessage = this.enableMessage.bind(this);

    this.state = {
      displayMessage: false,
    };

    this.timer = setTimeout(this.enableMessage, 250);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  enableMessage() {
    this.setState({displayMessage: true});
  }

  render() {
    const {displayMessage} = this.state;

    if (!displayMessage) {
      return null;
    }

    return <div>Loading...</div>;
  }
}

export default LoadingMessage;
```

The `LoadingMessage` component here only displays the `Loading...` message
after 250ms have passed. This results in a much smoother UX yet still accounts
for the case of long-running tasks.

Our `render` function will now look something like:
``` text
import LoadingMessage from './LoadingMessage';

// ...

render() {
  const {isBusy} = this.props;

  if (isBusy) {
    return <LoadingMessage/>;
  }

  return <div>Ready!</div>;
}

```

[spinkit]: https://github.com/tobiasahlin/SpinKit
[webpack-code-splitting]: https://webpack.js.org/guides/code-splitting
[react-router]: https://reacttraining.com/react-router/
