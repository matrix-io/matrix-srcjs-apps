// app code goes here
// matrix.init()....
//
// have fun

//example clock
var clock = function(){
  var time = new Date();
  var h = time.getHours();
  var m = time.getMinutes();
  var s = time.getSeconds();

  var hourLed = {
    // translate hours (12) to angle (360)
    arc: h * 3,
    color: 'blue',
    darken: 50
  };

  var minuteLed = {
    //translate minutes (60) to angle (360)
    angle: m * 6,
    color: 'green'
  };

  var secondLed = {
    //translate seconds (60) to angle (360)
    angle: s * 6,
    color: 'yellow',
    blend: true
  };

  matrix.led([hourLed, minuteLed]).render();
};
var smile = [ {
                angle: 45,
                color: 'yellow'
              },
              {
                angle: 135,
                color: 'yellow'
              },
              {
                arc: 90,
                color: 'yellow',
                start: 225
              }
            ];

var examples = [
  matrix.led('blue').render,
  matrix.led(['#bada55', '#e1ee7e']).render, //interleave two colors
  matrix.led(['blue', 'red']).render, //interleave two colors
  matrix.led('rgba(255, 0, 100, 0.6)').render, //support opacity
  matrix.led('rgba(255, 255, 0, 1)').render, //support opacity
  matrix.led({ arc: 90, color: 'green', start:12 }).render, //generate shapes
  matrix.led({ arc: 180, color: 'blue', start:12 }).render, //generate shapes
  matrix.led({ arc: 360 }).render, //no color assumes off
  matrix.led({ color: 'red', arc: 200 }).render, //red arc
  matrix.led({ angle: 245, color: 'white', blend: true }).render, //draw a point
  matrix.led({ angle: 245, color: 'green', blend: false }).render, //draw a point
  matrix.led(smile).render, //shape objects, make a smiley face
  matrix.led(smile).rotate(90).render, //manipulate position//rotate the lights clockwise by a specified angle
  matrix.led(['purple', 0, 0, 0, 'blue', 0, 0, 0, 0, 0, 0, 0, 0, 'blue', 0, 0,
                0, 0, 0, 0, 0, 0, 'blue', 'blue', 'blue', 'blue', 'green', 'white',
                'red', 'red', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue']).render, //direct pixel manipulation
  clock
];
var i = 0;
setInterval(function(){
  examples[(i++)%examples.length]();
}, 1000);
