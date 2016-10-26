// app code goes here
// matrix.init()....
//
// have fun
var startAngle = 0;
setInterval(function(){
  var leds = [];
  for ( i = 0; i <= 37; i++ ){
    leds.push({
      angle: i * 9 + 1 + startAngle,
      color: { r: 255, g:0, b: 0},
      spin: i*10,
      blend: true
    });
  }
  matrix.led(leds).render();
  startAngle += 5;
}, 50);
