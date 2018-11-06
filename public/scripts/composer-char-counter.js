const MAX_CHAR_LIMIT = 140;

const validateInput = function (textArea) {
  const input = $(textArea).siblings('input');
  const spanCount = $(textArea).siblings('.counter');

  let counter = MAX_CHAR_LIMIT - $(textArea).val().length;

  if (counter < 0) {
    input.attr('disabled', 'disabled');
    spanCount.removeClass('black-text').addClass('red-text');
  } else {
    input.removeAttr('disabled');
    spanCount.removeClass('red-text').addClass('black-text');
  }
}

$(document).ready(() => {
  console.log('Document has loaded!');

  // validate input again upon page refresh
  $('.counter').text(function () {
    validateInput($(this).siblings('textarea'));
    return MAX_CHAR_LIMIT - $(this).siblings('textarea').val().length;
  });

  // detect input and change state
  $('textarea').on('input', function () {
    validateInput(this);
    const spanCount = $(this).siblings('.counter');
    $(spanCount).text(MAX_CHAR_LIMIT - $(this).val().length);
  });
});