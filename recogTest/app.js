matrix.on('train', function(d) {
  matrix.init('recognition', { mode: 'train', tag: 'test' }).then(function(d) {
    if (d.hasOwnProperty('count')) {
      // means it's partially done
      matrix.led({
        arc: Math.round(360 * (d.count / d.target)),
        color: 'blue'
      }).render();
    }
    console.log('trained!', d);
  });
  console.log('training started>>>>>', d);
});

//
// matrix.init('recognition', {tag: 'test'}).then(function (d) {
//   console.log('RECOGNIZED!!>!!>!>>!>!>!>', d);
// })

matrix.on('recog', function(d) {
  matrix.init('recognition', { tag: 'test' }).then(function(d) {
    console.log('RECOG>>>!', d);
    matrix.led('green').render();
  });
  console.log('recog!');
})