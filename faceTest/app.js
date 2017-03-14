matrix.led('red').render();

matrix.service('face').then(function(data){
  console.log('>>>>>>>>>>', data);
  matrix.led('green').render();
  setTimeout(function() {
  	matrix.led('black').render();
  },2000);
});
