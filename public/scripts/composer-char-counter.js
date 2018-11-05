const MAX_CHAR_LIMIT = 140;

$(document).ready(() => {
  console.log('Document has loaded!');

  $('.counter').text(function () {
    let countAtReload = MAX_CHAR_LIMIT - $(this).siblings('textarea').val().length;

    if (countAtReload < 0) {
      $(this).removeClass('black-text').addClass('red-text');
    } else {
      $(this).removeClass('red-text').addClass('black-text');
    }

    return MAX_CHAR_LIMIT - $(this).siblings('textarea').val().length;
  });


  $('textarea').on('input', function() {
    let counter = MAX_CHAR_LIMIT - this.textLength;
    $(this).siblings('.counter').text(counter);
    if (counter < 0) {
      $(this).siblings('.counter').removeClass('black-text').addClass('red-text');
    } else {
      $(this).siblings('.counter').removeClass('red-text').addClass('black-text');
    }
  });
});
