// CSS
require('../css/main.scss');

// Images
require('../images/2015-11-22-lets-encrypt-was-supposed-to-make-things-better.jpg');
require('../images/2015-11-26-immutable-infrastructure-deployment.jpg');
require('../images/2016-02-28-serverless-irc-notifications.jpg');
require('../images/2016-05-11-bootstrap-button-after.jpg');
require('../images/2016-05-11-bootstrap-button-before.jpg');
require('../images/2016-05-11-placeholder-text-input-after.jpg');
require('../images/2016-05-11-placeholder-text-input-before.jpg');
require('../images/atlas-approve-change.jpg');
require('../images/atlas-gh-build-status.jpg');
require('../images/atlas-slack-confirm.jpg');
require('../images/atlas-slack-success.jpg');
require('../images/derpy-lady.jpg');
require('../images/disjoint-ca-404.svg');
require('../images/disjoint-ca-banner.jpg');
require('../images/disjoint-ca-logo.png');
require('../images/disjoint-ca-logo.svg');
require('../images/empire-wants-you.jpg');
require('../images/irc-hooky-brief-overview.png');
require('../images/lambda-pricing-screenshot.jpg');
require('../images/marvin-pinto-profile.jpg');
require('../images/meta-social-media-image-20160426.jpg');
require('../images/you-had-me-at-autoscaling.jpg');

// External JS
require('autotrack/lib');

$.fn.hnButton = function() {
  // this is the button to be upgraded
  var linkbutton = this;
  var title = document.title;
  var thisUrl = window.location.href;
  if (linkbutton.data('url')) {
    thisUrl = linkbutton.data('url');
  }
  if (linkbutton.data('title')) {
    title = linkbutton.data('title');
  }
  var hnUrlPrefix = "https://news.ycombinator.com/item?id=";

  // default button action
  linkbutton.click(function(evt){
    evt.preventDefault();
    window.open('http://news.ycombinator.com/submitlink?u='+encodeURIComponent(thisUrl)+'&t='+encodeURIComponent(title));
  });

  if (linkbutton.length) {
    var api = 'https://hn.algolia.com/api/v1/search';
    var params = {
      tags: 'story',
      query: thisUrl,
      restrictSearchableAttributes: 'url',
      advancedSyntax: true
    };
    $.getJSON(api, params, function(data){
      if (data.nbHits > 0) {
        $.each(data.hits, function(index, item){
          if (item.url === thisUrl) {
            // this is our item!
            var hnPostLink = hnUrlPrefix + item.objectID;
            linkbutton.unbind('click');
            linkbutton.attr('href', hnPostLink);
            return;
          }
        });
      }
    });
  }
  return linkbutton;
};

// Tweet using Twitter Web Intents - https://dev.twitter.com/web/intents#retweet-intent
jQuery.fn.tweetButton = function() {
  let linkbutton = this;
  const url = linkbutton.data('url');
  const title = linkbutton.data('title');
  const author = linkbutton.data('author');
  const width = 550;
  const height = 420;
  const winHeight = screen.height;
  const winWidth = screen.width;
  const left = Math.round((winWidth / 2) - (width / 2));

  let windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes';
  let top;

  top = 0;
  if (winHeight > height) {
    top = Math.round((winHeight / 2) - (height / 2));
  }

  windowOptions += `,width=${width},height=${height},left=${left},top={top}`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}&via=${author}`;

  linkbutton.click(function(evt){
    evt.preventDefault();
    window.open(tweetUrl, 'intent', windowOptions);
  });
  return linkbutton;
};

$(document).ready(function(){
  $('.hn-linkbutton').hnButton();

  // Tweet using Twitter Web Intents - https://dev.twitter.com/web/intents#retweet-intent
  $('.tweet-linkbutton').tweetButton();
});

// Google Analytics
window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
