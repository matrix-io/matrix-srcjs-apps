// app code goes here
// matrix.init()....
//
// have fun


//so, this is just a (not a good one) controller for the ar conditioner
//matrix.init('temperature').then(function(data) {
//        console.log('Temperature', data);
//        key = matrix.type(temp).send(data);
//      });



matrix.init('temperature').then(function(data) {
  console.log('temperature >', data);
  matrix.type('temperature').send(data);
  matrix.led('black').render();
});
