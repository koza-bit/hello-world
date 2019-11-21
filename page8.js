$('#container').click(function(){
  
  $(this).prepend('<div class="circle"></div>');// adds circle to DOM
  
  $('.circle').addClass('active');
  
});

$(document).ready(function(){
  

  $('#container').trigger('click').prepend('<div class="circle"></div>');// adds circle to DOM
  
});