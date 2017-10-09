---
author_twitter_username: "marvinpinto"
meta_image: "marvin-pinto-profile.jpg"
meta_image_width: 700
meta_image_height: 700
date: 2017-10-09T13:20:00-04:00
lastmod: 2017-10-09T13:20:00-04:00
title: "Displaying a loading message while initializing a React component"
tags:
  - 'reactjs'
  - 'redux'
---

In non-trivial React apps, you sometimes need to load network resources prior
to rendering a component in order to hide or display components within the UI.
For example, it would be awkward to show a user the "Update Settings" UI if they are
not logged in, and conversely the login form if they are already logged
in.

The recommended place to perform these API calls is in the `componentDidMount`
[lifecycle method][react-lifecycles]. In general, it's a good idea to let the
user know that [processing is taking place][react-animations] else they end up
in a very confusing state - think blank screen, browser loading-circle randomly
spinning, that sort of thing. This is especially true for critical-path API
calls where the result determines what is displayed on screen.

If you already use a system like [redux][redux-js] for state management, it
might be tempting to use global (redux) state variables to control the display
of these "loading" elements. Take the following `render` example.

``` text
render() {
  const {
    isRefreshingSettings,
    isRetrievingToken,
    appToken
  } = this.props.globalState;

  if (isRefreshingSettings || isRetrievingToken) {
    return <div>Please Wait</div>;
  }

  return (
    <div>Your token is: {appToken}</div>
  );
}
```

Using the global `isRefreshingSettings` and `isRetrievingToken` variables, you
end up with an observable flicker due to the re-render between when the token
is retrieved and the settings are refreshed ([fiddle available
here][jsfiddle-example-with-flicker]).

<br/>
{{< img src="2017-10-09-recording-with-flicker.gif" alt="Loading image with the flicker" class="img-responsive">}}
<br/>

There are a few ways to work around this. If you intend on maintaining all your
state in redux, you can add additional actions that wrap your intermediary
states. For the most part this technique will help you avoid the flicker but it
gets tedious to maintain over time as you add and remove initialization
functions.

``` text
render() {
  // ...

  // Here the fictional `isProcessingToken` state was added to wrap the token
  // validation step.
  if (isRefreshingSettings || isRetrievingToken || isProcessingToken) {
    return <div>Please Wait</div>;
  }

  // ...
}
```

Another way of working around the flicker is to use a local state variable to
determine when initialization is complete.

``` js
componentDidMount() {
  const { dispatch } = this.props;

  Promise.resolve()
    .then(() => {
      return dispatch(initiateRetrieveTokenRequest());
    })

    // ...

    })
    .then(result => {
      this.setState({ initializationComplete: true });  // <---- flip the local state variable when
                                                        // everything is complete
      console.log("Initialization complete");
    });
}
```

The local state variable here makes the user experience a lot smoother and
contributes towards keeping your code more maintainable!

<br/>
{{< img src="2017-10-09-recording-without-flicker.gif" alt="Loading image without the flicker" class="img-responsive">}}
<br/>

### Resources

- [Runnable fiddle][jsfiddle-example] of the final version
- [Full source code][source-code-examples] for the examples

[react-lifecycles]: https://reactjs.org/docs/react-component.html#the-component-lifecycle
[react-animations]: {{< relref "til/2017-09-21-how-to-delay-the-display-of-loading-animations-in-react.md" >}}
[redux-js]: http://redux.js.org
[jsfiddle-example]: https://jsfiddle.net/gh/gist/library/pure/731a0d5ac87a9cc923f7779d2bc50bc2
[jsfiddle-example-with-flicker]: https://jsfiddle.net/gh/gist/library/pure/731a0d5ac87a9cc923f7779d2bc50bc2/0f087e2f8b6baac6bf9e6b3f5b3cebf0b1508f23
[source-code-examples]: https://gist.github.com/marvinpinto/731a0d5ac87a9cc923f7779d2bc50bc2
