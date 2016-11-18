// app code goes here
// matrix.init()....
//
// have fun

var options = {
  refresh: 1000, //milliseconds
  timeout: 1000 //milliseconds
};

matrix.init('temperature', options).then(function(data){
  if (typeof(data) !== "undefined") {
      if (data.hasOwnProperty('value') && data.hasOwnProperty('type')) {
          matrix.type('sensorValue').send({
              'value': data.value,
              'sensorName': data.type
          });
      }
  }
});

matrix.init('pressure', options).then(function(data){
  if (typeof(data) !== "undefined") {
      if (data.hasOwnProperty('value') && data.hasOwnProperty('type')) {
          matrix.type('sensorValue').send({
              'value': data.value,
              'sensorName': data.type
          });
      }
  }
});

matrix.init('gyroscope', options).then(function(data){
  if (typeof(data) !== "undefined") {
      if (data.hasOwnProperty('value') && data.hasOwnProperty('type')) {
          matrix.type('sensorValue').send({
              'value': data.pitch + ' | ' + data.roll  + ' | ' + data.yaw,
              'sensorName': data.type
          });
      }
  }
});

matrix.init('uv', options).then(function(data){
  if (typeof(data) !== "undefined") {
      if (data.hasOwnProperty('value') && data.hasOwnProperty('type')) {
          matrix.type('sensorValue').send({
              'value': data.value,
              'sensorName': data.type
          });
      }
  }
});

matrix.init('altitude', options).then(function(data){
  if (typeof(data) !== "undefined") {
      if (data.hasOwnProperty('value') && data.hasOwnProperty('type')) {
          matrix.type('sensorValue').send({
              'value': data.value,
              'sensorName': data.type
          });
      }
  }
});

matrix.init('humidity', options).then(function(data){
  if (typeof(data) !== "undefined") {
      if (data.hasOwnProperty('value') && data.hasOwnProperty('type')) {
          matrix.type('sensorValue').send({
              'value': data.value,
              'sensorName': data.type
          });
      }
  }
});
