// lighting
var a = 180;
var a2 = 0;
var l = setInterval(function() {
  matrix.led([{
    arc: Math.round(175 * Math.sin(a)),
    color: 'red',
    start: a2
  }, {
    arc: -Math.round(175 * Math.sin(a)),
    color: 'blue',
    start: a2 + 270
  }]).render();
  a = (a < 0) ? 180 : a - 0.1;
  //a2 = (a2 > 360) ? 0 : a2 + 5;
}, 25);

function stopLights() {
  clearInterval(l);
}

