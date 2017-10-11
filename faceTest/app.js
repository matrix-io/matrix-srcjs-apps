matrix.led(['darkturquoise','deepskyblue','darkgreen','darkkhaki']).render();

matrix.service('face').start().then(function(data){
  console.log('>>>>>>>>>>', data);
  matrix.led('green').render();
  setTimeout(function() {
  	matrix.led('black').render();
  },2000);
});
