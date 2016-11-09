// app code goes here
// matrix.init()....
//
// have fun

//matrix.led('yellow').render();

console.log("test********************************************");
matrix.on('buttonClick', function() {
  console.log(">>>>>>>>>> Clicking button <<<<<<<<<<");
  matrix.led('blue').render();
});
