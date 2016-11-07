// app code goes here
// matrix.init()....
//
// have fun
var startAngle = 0;
var leds = [];


setInterval(function(){
  matrix.led(_.values(leds)).render();
}, 1000);



matrix.init('everloop').then(function(data){
  console.log('everloop >', data);

  matrix.type('everloop').send(data);

  for (var i = 0; i < 36; i++) {
    leds.push({
      angle: i * 9 + 1 + startAngle,
      color: { r: 255, g:0, b: 0},
      spin: i*10,
      blend: true
    });
  }

});
