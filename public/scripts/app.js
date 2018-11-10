/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
const ERROR_MSG_NO_TEXT = 'Please type something to post as a Tweet!';
const ERROR_MSG_LOGIN_REGISTER_EMPTY = 'Please enter valid username or password!';
const ERROR_MSG_EXISTING_USER = 'Account Exists! Please use the login button';
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
    console.log($('div.login > form').serialize());
    const formData = $('div.login > form').serialize();
    const formDataArr = formData.split(/\W+/);

    // when user does not enter username and/or password
    if (formDataArr.length < 4) {
      $('.error-msg').text(ERROR_MSG_LOGIN_REGISTER_EMPTY)
        .slideDown('slow')
        .delay(1500)
        .slideUp('slow');

    } else {
      // TODO Check for existing user, error msg to login instead
      // const registerForm = {
      //   [formDataArr[0]]: formDataArr[1],
      //   [formDataArr[2]]: formDataArr[3],
      // }

      $.ajax('/session', {
        method: "POST",
        data: formData,
      });

      // $.ajax('/session', {
      //   method: "GET",
      //   success: function (users) {
      //     if (isExistingUser(registerForm, users)) {
      //       $('.error-msg').text(ERROR_MSG_EXISTING_USER)
      //         .slideDown('slow')
      //         .delay(1500)
      //         .slideUp('slow');
      //     }
      //   },
      // }).then(() => {
      //   $.ajax('/session', {
      //     method: "POST",
      //     data: formData,
      //   });
      // });
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
  $('#nav-bar > a').click(function () {
    if ($('.new-tweet').is(':visible')) {
      $('.new-tweet').slideUp('slow');
    } else {
      $('.new-tweet').slideDown('fast', function () {
        $('textarea').focus();
      });
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
    const $footerActionHeart = $('<i>').addClass('fas fa-heart');
    $footerActions.append($footerActionFlag).append('&nbsp;').append($footerActionShare).append('&nbsp;').append($footerActionHeart);
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
        console.log(`Name and password match.`);
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