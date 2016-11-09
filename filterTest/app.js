// app code goes here
// matrix.init()....
//
// have fun


//so, this is just a (not a good one) controller for the ar conditioner
//matrix.init('temperature').then(function(data) {
//        console.log('Temperature', data);
//        key = matrix.type(temp).send(data);
//      });

var ledState = {};
var arcDeg = 15;

setInterval(function () {
  arcDeg += 5;
  if ( arcDeg > 60 ){
    arcDeg = 10;
  }

  matrix.led(_.values(ledState)).render();
}, 1000);

matrix.init('temperature').then(function(data){
  console.log('temperature >', data);
  matrix.type('temperature').send(data);
  ledState.temp = {
    arc: arcDeg,
    color: 'blue',
    start: 1,
    spin: arcDeg
  };
});
