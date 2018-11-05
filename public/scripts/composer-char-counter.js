const MAX_CHAR_LIMIT = 140;

$(document).ready(() => {
  console.log('Document has loaded!');

  $('textarea').keyup(function() {
    let counter = MAX_CHAR_LIMIT - this.textLength;
    $('.counter').text(counter);
    if (counter < 0) {
      $('.counter').css('color', 'red');
    }
  });
});
