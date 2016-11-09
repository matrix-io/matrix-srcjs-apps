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
}, 5000);

matrix.init('temperature').then(function(data){
  console.log("*******************************************************");
  console.log('temperature >', data);
  matrix.type('temperature').send(data);
  ledState.temp = {
    arc: arcDeg,
    color: 'blue',
    start: 1,
spin: arcDeg
}
;
});

matrix.init('pressure').then(function(data){
  console.log('pressure >', data);

  matrix.type('pressure').send(data);
  ledState.pres = {
    arc: arcDeg,
    color: 'purple',
    start: 60,
spin: arcDeg
};

});


matrix.init('gyroscope').then(function(data){
  console.log('gyroscope >', data);
matrix.type('gyroscope').send(data);
  ledState.g = {
    arc: arcDeg,
    color: 'green',
    start: 120,
    spin: arcDeg
  };


});



matrix.init('uv').then(function(data){
  console.log('uv >', data);
  matrix.type('uv').send(data);
  ledState.u = {
    arc: arcDeg,
    color: 'yellow',
    start: 180,
    spin: arcDeg
  };
});



matrix.init('altitude').then(function(data){
  console.log('altitude >', data);
  matrix.type('altitude').send(data);
  ledState.a = {
    arc: arcDeg,
    color: 'orange',
    start: 240,
    spin: arcDeg
  };
});



matrix.init('humidity').then(function(data){
  console.log('humidity >', data);

  matrix.type('humidity').send(data);
  ledState.h = {
    arc: arcDeg,
    color: 'red',
    start: 300,
    spin: arcDeg
  };
});
