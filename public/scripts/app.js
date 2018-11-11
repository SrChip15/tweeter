/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
const ERROR_MSG_NO_TEXT = 'Please type something to post as a Tweet!';
const ERROR_MSG_LOGIN_REGISTER_EMPTY = 'Please enter valid username or password!';
const ERROR_MSG_NOT_A_USER = 'Please register to use the app';
const COOKIE_NAME = 'user';

$(document).ready(function () {
  // Hide new tweet section on page load
  $('.new-tweet').hide();

  if (Cookies.get(COOKIE_NAME)) {
    loggedInState();
  }

  $('.logout').click(function () {
    loggedOutState();
    Cookies.remove(COOKIE_NAME);
  });

  $('.register').click(function () {
    const formData = $('div.login > form').serialize();
    const formDataArr = formData.split(/\W+/);

    // when user does not enter username and/or password
    if (formDataArr.length < 4) {
      $('.error-msg').text(ERROR_MSG_LOGIN_REGISTER_EMPTY)
        .slideDown('slow')
        .delay(1500)
        .slideUp('slow');

    } else {
      // add user to db and load page
      $.ajax('/session', {
        method: "POST",
        data: formData,
      });
    }
  });

  $('div.login > form').submit(function (event) {
    event.preventDefault();

    const formData = $(this).serialize();
    const data = formData.split(/\W+/);

    // when user does not enter username and/or password
    if (data.length < 4) {
      $('.error-msg').text(ERROR_MSG_LOGIN_REGISTER_EMPTY)
        .slideDown('slow')
        .delay(1500)
        .slideUp('slow');

    } else {
      const checkSession = {
        [data[0]]: data[1],
        [data[2]]: data[3],
      }

      $.ajax('/session', {
        method: "GET",
        success: function (userList) {
          if (isExistingUser(checkSession, userList)) {
            // set cookie
            Cookies.set(COOKIE_NAME, checkSession.name);
          } else {
            $('.error-msg').text(ERROR_MSG_NOT_A_USER)
              .slideDown('slow')
              .delay(1500)
              .slideUp('slow');
          }
        }
      }).then(() => {
        if (Cookies.get(COOKIE_NAME)) {
          loggedInState();
        }
      });
    }
  })

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

  // Handle new tweet form submission here
  // Get form data and perform remaining form validation rules
  // Submit data as a AJAX request & perform cleanup & reset activities
  $('section.new-tweet > form').submit(function (event) {
    event.preventDefault();

    let formData = $(this).serialize();
    const counter = formData.split('=')[1].length;

    if (counter === 0) {
      $('.error-msg').text(ERROR_MSG_NO_TEXT).slideDown();
    }

    $.ajax(`/tweets/${Cookies.get(COOKIE_NAME)}`, {
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
  $('#nav-bar > a').click(function () {
    if ($('.new-tweet').is(':visible')) {
      $('.new-tweet').slideUp('slow');
    } else {
      $('.new-tweet').slideDown('fast', function () {
        $('textarea').focus();
      });
    }
  });

  $(document).on('click', '.tweet-actions > a', function (event) {
    event.preventDefault();

    const $span = $(this).siblings('span');
    let likeCount = parseInt($span.text(), 10);

    if ($span.data().handle.slice(1) !== Cookies.get(COOKIE_NAME)) {
      if ($span.data().toggle === 0) {
        // like the clicked tweet if not users'
        $span.data().toggle = 1;
        $span.siblings('a').find('i').removeClass('far fa-heart').addClass('fas fa-heart');
        likeCount += 1;
      } else {
        // previously liked tweet (not users'), un-like now
        $span.data().toggle = 0;
        $span.siblings('a').find('i').removeClass('fas fa-heart').addClass('far fa-heart');
        likeCount -= 1;
      }

      // set updated span text
      $(this).siblings('span').text(likeCount);

      // console.log($(this).closest('footer').siblings('.body').text());
      const $textContent = $(this).closest('footer').siblings('.body').text();

      // update like count in db
      $.ajax(`/tweets/update/${likeCount}`, {
        method: "PUT",
        data: {
          tweet_text: $textContent
        },
        success: $(this).siblings('span').text(likeCount),
      })
    }
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
    const $footerActionHeart =
      $('<a>').append($('<i>').addClass('far fa-heart')).attr('href', '#');
    const $footerHeartCounter = $('<span>')
      .addClass('heart-counter')
      .data({
        toggle: 0,
        handle: tweet.user.handle,
      })
      .text(tweet.likes || 0);

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

  function isExistingUser(entry, users) {
    for (const user of users) {
      if (user.name === entry.name && user.password === entry.password) {
        return true;
      }
    }
    return false;
  }

  function loggedInState() {
    // display tweets, compose, and logout
    $('.container').show();
    $('#nav-bar a.compose').show();
    $('#nav-bar .logout').show();
    loadTweets();
    // hide login/register form
    $('div.login').hide();
  }

  function loggedOutState() {
    // display tweets, compose, and logout
    $('.container').hide();
    $('#nav-bar a.compose').hide();
    $('#nav-bar .logout').hide();
    // hide login/register form
    $('div.login').show();
  }
});