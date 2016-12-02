matrix.init('mic').then(function(data){
  var c = ( data.value < 50 )? 'green' : ( data.value < 125 ) ? 'yellow' :
  (data.value < 200 ) ? 'orange' : 'red';
  
  matrix.led({
    arc: Math.round(data.value),
    color: c
  }).render();
});
