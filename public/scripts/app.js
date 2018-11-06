/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function () {

  function loadTweets() {
    $.ajax('/tweets', {
      method: "GET",
    }).then(function (tweets) {
      renderTweets(tweets);
    })
  }

  function createTweetElement(tweet) {
    const user = tweet.user;
    const tweetAge = Math.abs(new Date().getDate() - new Date(tweet.created_at).getDate());

    const $tweet = $('<article>');
    // header stuff
    const $header = $('<header>');
    const $headerAvatar = $(`<img src="${user.avatars.small}">`);
    const $headerUserName = $('<h1>').append(user.name);
    const $headerUserHandle = $('<p>').append(tweet.user.handle);
    $header.append($headerAvatar).append($headerUserName).append($headerUserHandle);

    const $body = $('<p>').addClass('body').append(document.createTextNode(tweet.content.text));

    // footer stuff
    const $footer = $('<footer>');
    const $footerAge = $('<p>').append(`${tweetAge} days ago`);
    const $footerActions = $('<div>').addClass('tweet-actions');
    const $footerActionFlag = $('<i>').addClass('fa fa-flag');
    const $footerActionShare = $('<i>').addClass('fas fa-retweet');
    const $footerActionHeart = $('<i>').addClass('fas fa-heart');
    $footerActions.append($footerActionFlag).append('&nbsp;').append($footerActionShare).append('&nbsp;').append($footerActionHeart);
    $footer.append($footerAge).append($footerActions);

    return $tweet.append($header).append($body).append($footer);
  }

  function renderTweets(tweets) {
    for (const tweet of tweets) {
      $('.tweets-container').append(createTweetElement(tweet));
    }
  }

  loadTweets();


  $('form').submit(function (event) {
    event.preventDefault();

    let formData = $(this).serialize();
    // console.log(formData);
    $.ajax('/tweets', {
      method: "POST",
      data: formData,
    }).then(() => {
      console.log($("textarea", this));
      $("textarea", this).val('');
    });
  });
});