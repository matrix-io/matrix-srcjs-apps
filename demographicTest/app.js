// app code goes here
// matrix.init()....
//
// have fun
matrix.led('red').render();

matrix.service('demographics').start().then(function(data) {
  console.log('>>>>>>>>>>', data);
  if (data.hasOwnProperty('demographics')) {
    var d = data.demographics;
    if (d.emotion === 'SAD') {
      matrix.led('blue').render();
    } else if (d.emotion === 'HAPPY') {
      matrix.led('yellow').render();
    } else if (d.emotion === 'ANGRY') {
      matrix.led('red').render();
    } else if (d.emotion === 'CALM') {
      matrix.led('green').render();
    } else if (d.emotion === 'SURPRISED') {
      matrix.led('orange').render();
    } else if (d.emotion === 'DISGUST') {
      matrix.led('#BADA55').render();
    } else if (d.emotion === 'CONFUSED') {
      matrix.led('purple').render();
    }
  }
});