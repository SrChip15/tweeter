/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
const ERROR_MSG_NO_TEXT = 'Please type something to post as a Tweet!';
$(document).ready(function () {
  // Hide new tweet section on page load
  $('.new-tweet').hide();

  // Grow new tweet esp, the `textarea` to accomodate for multi-line text
  // without user not having to use the default scroll bar
  $('textarea').focus(function () {
    $(this).addClass('grow-context');
  });

  function loadTweets() {
    $.ajax('/tweets', {
      method: "GET",
    }).then(function (tweets) {
      renderTweets(tweets);
    })
  }


  loadTweets();

  // Handle new tweet form submission here
  // Get form data and perform remaining form validation rules
  // Submit data as a AJAX request & perform cleanup & reset activities
  $('form').submit(function (event) {
    event.preventDefault();

    let formData = $(this).serialize();
    const counter = formData.split('=')[1].length;

    if (counter === 0) {
      $('.error-msg').text(ERROR_MSG_NO_TEXT).slideDown();
    }

    $.ajax('/tweets', {
      method: "POST",
      data: formData,
      success: function (tweet) {
        $('.tweets-container').prepend(createTweetElement(tweet));
      },
    }).then(() => {
      // Clear new tweet contents after post is made & reduce height
      $("textarea", this).val('').removeClass('grow-context');
      // Visually reset the counter
      $('.counter').text(MAX_CHAR_LIMIT);
    });
  });


  // Handle compose button click event
  // If new tweet form is visible hide it else show it with slide transition
  $('#nav-bar > input').click(function () {
    if ($('.new-tweet').is(':visible')) {
      $('.new-tweet').slideUp('slow');
    } else {
      $('.new-tweet').slideDown('fast', function () {
        $('textarea').focus();
      });
    }
  });

  $(document).on('click', '.tweet-actions > a', function (e) {
    e.preventDefault();
    let c = parseInt($(this).siblings('span').text(), 10) + 1;
    $(this).siblings('span').text(c);
    const username = $(this).siblings('span').data().username;

    $.ajax('/tweets/${username}', {
      method: "POST",
      data: c,
      success: $(this).siblings('span').text(c),
    })
  });

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
    if (tweet.like)
    const $footerActionHeart = $('<a>').append($('<i>').addClass('far fa-heart')).attr('href', '#');
    const $footerHeartCounter = $('<span>').addClass('heart-counter').data('username', tweet.user.name).append(10);

    $footerActions.append($footerActionFlag).append('&nbsp;').append($footerActionShare).append('&nbsp;').append($footerActionHeart).append($footerHeartCounter);
    $footer.append($footerAge).append($footerActions);

    return $tweet.append($header).append($body).append($footer);
  }

  function renderTweets(tweets) {
    $('.tweets-container').empty();
    for (let i = tweets.length - 1; i >= 0; i--) {
      $('.tweets-container').append(createTweetElement(tweets[i]));
    }
  }
});
