// app code goes here
// matrix.sensor()....
//
// have fun

var options = {
  refresh: 2000, //milliseconds
  timeout: 2000 //milliseconds
};

matrix.sensor('temperature', options).then(function(data){
  if (typeof(data) !== "undefined") {
      if (data.hasOwnProperty('value') && data.hasOwnProperty('type')) {
          matrix.type('sensorValue').send({
              'Value': data.value,
              'TypeSensor': data.type
          });
      }
  }
});

matrix.sensor('pressure', options).then(function(data){
  if (typeof(data) !== "undefined") {
      if (data.hasOwnProperty('value') && data.hasOwnProperty('type')) {
          matrix.type('sensorValue').send({
              'Value': data.value,
              'TypeSensor': data.type
          });
      }
  }
});

matrix.sensor('altitude', options).then(function(data){
  if (typeof(data) !== "undefined") {
      if (data.hasOwnProperty('value') && data.hasOwnProperty('type')) {
          matrix.type('sensorValue').send({
              'Value': data.value,
              'TypeSensor': data.type
          });
      }
  }
});

matrix.sensor('humidity', options).then(function(data){
  if (typeof(data) !== "undefined") {
      if (data.hasOwnProperty('value') && data.hasOwnProperty('type')) {
          matrix.type('sensorValue').send({
              'Value': data.value,
              'TypeSensor': data.type
          });
      }
  }
});

matrix.sensor('gyroscope', options).then(function(data){
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

matrix.sensor('uv', options).then(function(data){
  if (typeof(data) !== "undefined") {
      if (data.hasOwnProperty('value') && data.hasOwnProperty('risk')) {
          matrix.type('uvValue').send({
              'Risk': data.risk,
              'Percentage': data.value
          });
      }
  }
});
