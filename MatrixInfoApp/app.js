// app code goes here
// matrix.init()....
//
// have fun

var options = {
  refresh: 2000, //milliseconds
  timeout: 2000 //milliseconds
};

matrix.init('temperature', options).then(function(data){
  if (typeof(data) !== "undefined") {
      if (data.hasOwnProperty('value') && data.hasOwnProperty('type')) {
          matrix.type('sensorValue').send({
              'Value': data.value,
              'TypeSensor': data.type
          });
      }
  }
});

matrix.init('pressure', options).then(function(data){
  if (typeof(data) !== "undefined") {
      if (data.hasOwnProperty('value') && data.hasOwnProperty('type')) {
          matrix.type('sensorValue').send({
              'Value': data.value,
              'TypeSensor': data.type
          });
      }
  }
});

matrix.init('altitude', options).then(function(data){
  if (typeof(data) !== "undefined") {
      if (data.hasOwnProperty('value') && data.hasOwnProperty('type')) {
          matrix.type('sensorValue').send({
              'Value': data.value,
              'TypeSensor': data.type
          });
      }
  }
});

matrix.init('humidity', options).then(function(data){
  if (typeof(data) !== "undefined") {
      if (data.hasOwnProperty('value') && data.hasOwnProperty('type')) {
          matrix.type('sensorValue').send({
              'Value': data.value,
              'TypeSensor': data.type
          });
      }
  }
});

matrix.init('gyroscope', options).then(function(data){
  if (typeof(data) !== "undefined") {
      if (data.hasOwnProperty('pitch') && data.hasOwnProperty('roll') && data.hasOwnProperty('yaw')) {
          matrix.type('gyroscopeValue').send({
              'Pitch': data.pitch,
              'Roll': data.roll,
              'Yaw': data.yaw
          });
      }
  }
});

matrix.init('uv', options).then(function(data){
  if (typeof(data) !== "undefined") {
      if (data.hasOwnProperty('value') && data.hasOwnProperty('risk')) {
          matrix.type('uvValue').send({
              'Risk': data.risk,
              'Percentage': data.value
          });
      }
  }
});
