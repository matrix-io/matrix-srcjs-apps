// app code goes here
// matrix.init()....
//
// have fun
var startAngle = 0;
var leds = [];


setInterval(function(){
  matrix.led(_.values(ledState)).render();
}, 1000);



matrix.init('everloop').then(function(data){
  console.log('everloop >', data);

  matrix.type('everloop').send(data);

  leds.push({ color: 'green', arc: 360 });
  leds.push({ color: 'red', arc: 360 });
  leds.push({ color: 'blue', arc: 360 });
});
