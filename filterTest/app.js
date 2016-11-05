// app code goes here
// matrix.init()....
//
// have fun


//so, this is just a (not a good one) controller for the ar conditioner
matrix.init('temperatureDown')
  .has()
    .above(28)
      .then(function(data) {
        console.log('Temperature above 28C > ', data);
        matrix.type('temperatureDown').send(data);
        //shows at the dashboard that the temperature is high
        matrix.emit('ac-control', 'turnOn', data);
      });

matrix.init('temperatureUp')
  .has()
    .below(16)
      .then(function(data) {
        console.log('Temperature under 16C <', data);
        matrix.type('temperatureUp').send(data);
        //shows at the dashboard that the temperature is low
        matrix.emit('ac-control', 'turnOff', data);
      })

//so, this is just a (not a good one (this is not a good way of doing this)) controller for the door
matrix.init('face')
  .has('happy')
    .above(50)
      .then(function(data) {
        console.log('Happy detection <', data);
        matrix.type('happyFace').send(data);
        //shows at the dashboard that the door is unlocked
        matrix.emit('door-control', 'unlock', data);
      });



matrix.on('turnOn', function(data) {
  //
  console.log('>>>>>>> Reducing temperature <<<<<<<');
  setTimeout(function() {
  	matrix.led('blue').render();
  }, 500);
});

matrix.on('turnOff', function(data) {
  //
  console.log('>>>>>>> Increasing temperature <<<<<<<');
  setTimeout(function() {
  	matrix.led('red').render();
  }, 500);
});


matrix.on('unlock', function(data) {
  //so, here i need to unlock the door
  console.log('>>>>>>> You are happy enough to enter <<<<<<<');
  setTimeout(function() {
  	matrix.led('green').render();
  }, 500);
});

})
