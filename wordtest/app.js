// app code goes here
// matrix.init()....
//
// have fun
matrix.service('voice').listen('matrix', function(phrase){
  var detail = phrase.split(' ')[1];
  var cmd = phrase.split(' ')[0];
  if ( cmd === 'shine'){
    matrix.led(detail).render();
  } else if (cmd === 'turn'){
    matrix.led('black').render();
  }
})