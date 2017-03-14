matrix.service('palm').start().then(function(data) {
  console.log('>>>>>>>>>>', data);
  var x = 320 - data.location.x;
  var y = 240 - data.location.y;
  matrix.led({
    angle: Math.atan2(y, -x) * (180 / Math.PI),
    color: 'blue'
  }).render();
});