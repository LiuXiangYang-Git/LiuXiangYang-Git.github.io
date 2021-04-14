var H = 0;

$('.button').bind('mousedown touchstart',function(e) {
  $('.clicked').removeClass('clicked');
  $(this).addClass('clicked');
});

$(document).bind('mousemove touchmove',function(e) {
    e.preventDefault();
    var drawSize = 55;
    var drawType = $('.clicked').html();
    var floatTypes = Array('floatOne','floatTwo','floatThree','floatFour','floatFive');
    var floatType = floatTypes[Math.floor(Math.random()*floatTypes.length)];
    var xPos = e.originalEvent.pageX;
    var yPos = e.originalEvent.pageY;
    
    $('body').append('<div class="draw" style="font-size:'+drawSize+'px;left:'+xPos+'px;top:'+yPos+'px;-webkit-animation:'+floatType+' .9s 1;-moz-animation:'+floatType+' .9s 1;color:hsla('+H+',100%,70%,1)">'+drawType+'</div>');
  
    $('.draw').each(function() {
      var div = $(this);
      setTimeout(function() {$(div).remove();},800);
    });
});

setInterval(function() {
  if(H<=360) {H++;}
  else {H=0;}
},10);