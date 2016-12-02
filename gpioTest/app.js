// app code goes here
// matrix.init()....
//
// have fun

var pinToWrite = 4;
var value = 1;
var pinValues = [];
var ledArray = [];
var pinOnColor = 'darkblue';
var pinOffColor = 'darkred';

function pollPin(pinToRead) {
  matrix.gpio.read(pinToRead, function (value) {
    if (pinValues.hasOwnProperty(pinToRead)) {
      if (pinValues[pinToRead] != value) {
        pinValues[pinToRead] = value;
        console.log('GPIO PIN #' + pinToRead + ' changed to ' + value);
        for (var index = 0; index < pinValues.length; index++) {
          pinValues[index] == 1 ? ledArray[index] = pinOnColor : ledArray[index] = pinOffColor;
        }
        matrix.led(ledArray).render();
      }
    } else {
      pinValues[pinToRead] = value;
      console.log('GPIO PIN #' + pinToRead + ' is set to ' + value);
    }
  });
}

pollPin(0);
pollPin(2);

matrix.on('setPin', function () {
  if (value == 1) value = 0;
  else value = 1;
  matrix.gpio.write(pinToWrite, value, function (err) {
    console.log("Wrote pin", err);
  });
});