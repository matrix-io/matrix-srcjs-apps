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
}, 100);

matrix.init('temperature').then(function(data){
  console.log("*******************************************************");
  console.log(data);
  console.log('<< temperature >>');
  matrix.type('temperatureValue').send({value: data.value, type: data.type});
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

  matrix.type('pressureValue').send({value: data.value, type: data.type});
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
  matrix.type('gyroscope').send({z: data.yaw, x: data.pitch, y: data.roll});
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
  matrix.type('uvValue').send({value: data.value, risk: data.risk});
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
  matrix.type('altitudeValue').send({value: data.value, type: data.type});
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

  matrix.type('humidityValue').send({value: data.value, type: data.type});
  ledState.h = {
    arc: arcDeg,
    color: 'red',
    start: 300,
    spin: arcDeg
  };
});
