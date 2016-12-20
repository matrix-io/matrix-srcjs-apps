// app code goes here
// matrix.init()....
//
// have fun


var pinAmount = 16;
var pinNumber = 0;
var movementThreshold = 0.2;

matrix.on('angle0', function() { 
  matrix.servo(pinNumber, 0);
  console.log('ANGLE SET TO 0');
});

matrix.on('angle45', function() { 
  matrix.servo(pinNumber, 45);
  console.log('ANGLE SET TO 45');
});

matrix.on('angle90', function() { 
  matrix.servo(pinNumber, 90);
  console.log('ANGLE SET TO 90');
});

matrix.on('angle135', function() { 
  matrix.servo(pinNumber, 135);
  console.log('ANGLE SET TO 135');
});

matrix.on('angle180', function() { 
  matrix.servo(pinNumber, 180);
  console.log('ANGLE SET TO 180');
});

matrix.on('angleJoystick', function (value) {
  var angle = value.value.angle;
  //console.log('(JOYSTICK) ANGLE SET TO ', angle);
  matrix.servo(pinNumber, angle);
});

matrix.on('angleSlider', function (value) {
  var angle = value.value;
  //console.log('(SLIDER) ANGLE SET TO ', angle);
  matrix.servo(pinNumber, angle);
});

matrix.on('pinInput', function (value) {
  var pin = value.value;
  if (!isNaN(pin) && pin < pinAmount) {
    pinNumber = pin;
    console.log('PIN SET TO ', pin); 
  } else { 
    console.log('Invalid pin ', pin);
  }
});

matrix.on('pin0', function () {
  pinNumber = 0;
  //console.log('PIN SET TO ', 0); 
});

matrix.on('pin1', function () {
  pinNumber = 1;
  //console.log('PIN SET TO ', 1); 
});

matrix.on('pin2', function () {
  pinNumber = 2;
  //console.log('PIN SET TO ', 2); 
});


//////////// Arm Controls ////////////

//LeftJoystick

var servos = {
  //#0 Sideways
  rotation: {
    pin: 0,
    low: 0,
    high: 180,
    speed: 12.0,
    value: 30.0
  },
  //#1 First arm point
  base: {
    pin: 1,
    low: 10,
    high: 140,
    speed: 6.0,
    value: 30.0
  },
  //#2 Right Joystick
  arm: {
    pin: 2,
    low: 0,
    high: 80,
    speed: 6.0,
    value: 30.0
  },
  //#3 not implemented yet
  bucket: {
    pin: 3,
    low: 0,
    high: 180,
    speed: 6.0,
    value: 30.0
  }
};

function getNewAngle(lowerLimit, higherLimit, value, currentAngle, speed) {
  console.log('|||||||||||||||| ', lowerLimit, higherLimit, value, currentAngle, speed, ' ||||||||||||||||');
  var step;
  var result = currentAngle;
  
  if (Math.abs(value) > movementThreshold) {
    if (higherLimit < lowerLimit) {
      step = -(value * speed);
    } else {
      step = (value * speed);
    }
    if (currentAngle + step < lowerLimit && currentAngle + step > higherLimit) result = currentAngle + step; 
  }
  console.log('*************** ', value, ' -> ', result, ' ***************');
  return result;
}

function setAngleFromServo(servoDescription, value, invert) { 
  var result;
  if (invert) {
    result = getNewAngle(servoDescription.high, servoDescription.low, value, servoDescription.value, servoDescription.speed);
  } else {
    result = getNewAngle(servoDescription.low, servoDescription.high, value, servoDescription.value, servoDescription.speed);
  }

  console.log(servoDescription);
  servoDescription.value = result;
  matrix.servo(servoDescription.pin, result);
}

matrix.on('leftJoystick', function (output) {

  //Map X 1 to 0º and -1 to 180º
  setAngleFromServo(servos.rotation, output.value.x, true);

  //Map Y 1 to 80º and -1 to 0º
  setAngleFromServo(servos.arm, output.value.y, true);
  
});

matrix.on('rightJoystick', function (output) {

  //Map X 1 to 0º and -1 to 180º
  setAngleFromServo(servos.bucket, output.value.x, false);

  //Map Y 1 to 80º and -1 to 0º
  setAngleFromServo(servos.base, output.value.y, false);
});


