// app code goes here
// matrix.init()....
//
// have fun

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
  // matrix.type('c').send(data);
  ledState.temp = {
    arc: arcDeg,
    color: 'blue',
    start: 1
  };
});

matrix.init('pressure').then(function(data){
  console.log('pressure >', data);

  ledState.pres = {
    arc: arcDeg,
    color: 'purple',
    start: 60
  };

});


matrix.init('gyroscope').then(function(data){
  console.log('gyroscope >', data);

  ledState.g = {
    arc: arcDeg,
    color: 'green',
    start: 120
  };


});



matrix.init('uv').then(function(data){
  console.log('uv >', data);
  ledState.u = {
    arc: arcDeg,
    color: 'yellow',
    start: 180
  };
});



matrix.init('altitude').then(function(data){
  console.log('altitude >', data);
  ledState.a = {
    arc: arcDeg,
    color: 'orange',
    start: 240
  };
});



matrix.init('humidity').then(function(data){
  console.log('humidity >', data);
  ledState.h = {
    arc: arcDeg,
    color: 'red',
    start: 300
  };
});
