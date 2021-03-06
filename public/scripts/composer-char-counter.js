const MAX_CHAR_LIMIT = 140;
const ERROR_MSG_EXCEED_CHAR = "Tweet text has exceeded the max characters!"

const manageNewTweetValidationAndState = function (textArea, input, spanCount) {
  let counter = MAX_CHAR_LIMIT - $(textArea).val().length;

  if (counter < 0) {
    input.attr('disabled', 'disabled');
    spanCount.addClass('red-text');
  } else {
    input.removeAttr('disabled');
    spanCount.removeClass('red-text');
  }

  return counter;
}

$(document).ready(() => {
  const $textArea = $('textarea');
  const $input = $textArea.siblings('input');
  const $spanCount = $textArea.siblings('.counter');

  // validate input again upon page refresh
  $('.counter').text(manageNewTweetValidationAndState($textArea, $input, $spanCount));

  // detect input and change state
  $textArea.on('input', function () {
    let counter = manageNewTweetValidationAndState(this, $input, $spanCount);
    $($spanCount).text(counter);

    if (counter < 0) {
      $('.error-msg').text(ERROR_MSG_EXCEED_CHAR).slideDown();
    } else {
      $('.error-msg').slideUp();
    }
  });
});