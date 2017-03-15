// app code goes here
// matrix.sensor()....
//
// have fun

var ledState = {};
var arcDeg = 10;

setInterval(function() {
  arcDeg += 5;
  if (arcDeg > 45) {
    arcDeg = 5;
  }

  matrix.led(_.values(ledState)).render();
}, 1000);

matrix.sensor('accelerometer').then(function(data) {
  console.log('axl>', data);
  matrix.type('accelerometer').send(data);
  ledState.accel = {
    arc: arcDeg,
    color: 'yellow',
    start: 1,
    spin: arcDeg
  };
});

matrix.sensor('magnetometer').then(function(data) {
  console.log('mag>', data);
  matrix.type('magnetometer').send(data);
  ledState.mag = {
    arc: arcDeg,
    color: 'green',
    start: 45,
    spin: arcDeg
  };
});

matrix.sensor('temperature').then(function(data) {
  console.log('temperature >', data);
  matrix.type('temperature').send(data.value);
  ledState.temp = {
    arc: arcDeg,
    color: 'blue',
    start: 90,
    spin: arcDeg
  };
});

matrix.sensor('pressure').then(function(data) {
  console.log('pressure >', data);

  matrix.type('pressure').send(data.value);
  ledState.pres = {
    arc: arcDeg,
    color: 'purple',
    start: 135,
    spin: arcDeg
  };

});


matrix.sensor('gyroscope').then(function(data) {
  console.log('gyroscope >', data);
  matrix.type('gyroscope').send(data);
  ledState.g = {
    arc: arcDeg,
    color: 'green',
    start: 180,
    spin: arcDeg
  };
});



matrix.sensor('uv').then(function(data) {
  console.log('uv >', data);
  matrix.type('uv').send(data.value);
  ledState.u = {
    arc: arcDeg,
    color: 'yellow',
    start: 225,
    spin: arcDeg
  };
});



matrix.sensor('altitude').then(function(data) {
  console.log('altitude >', data);
  matrix.type('altitude').send(data.value);
  ledState.alt = {
    arc: arcDeg,
    color: 'orange',
    start: 270,
    spin: arcDeg
  };
});



matrix.sensor('humidity').then(function(data) {
  console.log('humidity >', data);

  matrix.type('humidity').send(data.value);
  ledState.h = {
    arc: arcDeg,
    color: 'red',
    start: 315,
    spin: arcDeg
  };
});