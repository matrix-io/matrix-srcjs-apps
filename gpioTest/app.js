var pin = 4;
var value = 1;
var readPin = 1;
var readPin2 = 3;

matrix.gpio.read(readPin, function (value) {
  console.log("Value for PIN #" + readPin, value);   // The current state of the pin
});

matrix.gpio.read(readPin2, function (value) {
  console.log("Value for PIN #" + readPin2, value);   // The current state of the pin
});

matrix.on('setPin', function () {
  if (value === 1) value = 0;
  else value = 1;
  matrix.gpio.write(pin, value, function (err) {
    console.log("Wrote pin", err);
  });
});


matrix.servo(10, 50);
