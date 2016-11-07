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
