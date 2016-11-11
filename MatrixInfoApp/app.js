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
  console.log(data);
  console.log('<< temperature >>');
  matrix.type('temperature').send({'temperatureValue': data.value});
  ledState.temp = {
    arc: arcDeg,
    color: 'blue',
    start: 1,
    spin: arcDeg
  };
});

matrix.init('pressure').then(function(data){
  console.log("*******************************************************");
  console.log(data);
  console.log('<< pressure >>');

  matrix.type('pressure').send(function(data) {
    return {'pressureValue': data.value};
  });
  ledState.pres = {
    arc: arcDeg,
    color: 'purple',
    start: 60,
    spin: arcDeg
  };

});


matrix.init('gyroscope').then(function(data){
  console.log("*******************************************************");
  console.log('<< gyroscope >>', data);
  matrix.type('gyroscope').send({'z': data.yaw, 'x': data.pitch, 'y': data.roll});
  ledState.g = {
    arc: arcDeg,
    color: 'green',
    start: 120,
    spin: arcDeg
  };


});



matrix.init('uv').then(function(data){
  console.log("*******************************************************");
  console.log('<< uv >>', data);
  uvValue = matrix.type('uv').send(data.value);
  ledState.u = {
    arc: arcDeg,
    color: 'yellow',
    start: 180,
    spin: arcDeg
  };
});



matrix.init('altitude').then(function(data){
  console.log("*******************************************************");
  console.log('<< altitude >>', data);
  matrix.type('altitude').send({'altitudeValue': data.value});
  ledState.a = {
    arc: arcDeg,
    color: 'orange',
    start: 240,
    spin: arcDeg
  };
});



matrix.init('humidity').then(function(data){
  console.log("*******************************************************");
  console.log('<< humidity >>', data);

  matrix.type('humidity').send({'humidityValue': data.value});
  ledState.h = {
    arc: arcDeg,
    color: 'red',
    start: 300,
    spin: arcDeg
  };
});
