// app code goes here
// matrix.init()....
//
// have fun

var options = {
  refresh: 1000, //milliseconds
  timeout: 1000 //milliseconds
};

matrix.init('temperature', options).then(function(data){
  matrix.type('temperatureValue').send({temp: data.value});
});

matrix.init('pressure').then(function(data){
  matrix.type('pressureValue').send({p: data.value});
});

matrix.init('gyroscope').then(function(data){
  matrix.type('gyroscopeValue').send({z: data.yaw, x: data.pitch, y: data.roll});
});

matrix.init('uv').then(function(data){
  matrix.type('uvValue').send({u: data.value});
});

matrix.init('altitude').then(function(data){
  matrix.type('altitudeValue').send({a: data.value});
});

matrix.init('humidity').then(function(data){
  matrix.type('humidityValue').send({h: data.value});
});
