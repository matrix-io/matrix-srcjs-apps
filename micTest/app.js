matrix.init('mic', {number: 0}).then(function(data){
  var c = ( data.value < 50 )? 'green' : ( data.value < 125 ) ? 'yellow' :
  (data.value < 200 ) ? 'orange' : 'red';

  matrix.led({
    arc: 0,
    color: { r: data.value }
  }).render();
});

matrix.init('mic', {number: 1}).then(function(data){
  var c = ( data.value < 50 )? 'green' : ( data.value < 125 ) ? 'yellow' :
  (data.value < 200 ) ? 'orange' : 'red';

  matrix.led({
    arc: 30,
    color: { r: data.value }
  }).render();
});

matrix.init('mic', {number: 2}).then(function(data){
  var c = ( data.value < 50 )? 'green' : ( data.value < 125 ) ? 'yellow' :
  (data.value < 200 ) ? 'orange' : 'red';

  matrix.led({
    arc: 60,
    color: { r: data.value }
  }).render();
});

matrix.init('mic', {number: 3}).then(function(data){
  var c = ( data.value < 50 )? 'green' : ( data.value < 125 ) ? 'yellow' :
  (data.value < 200 ) ? 'orange' : 'red';

  matrix.led({
    arc: 90,
    color: { r: data.value }
  }).render();
});

matrix.init('mic', {number: 4}).then(function(data){
  var c = ( data.value < 50 )? 'green' : ( data.value < 125 ) ? 'yellow' :
  (data.value < 200 ) ? 'orange' : 'red';

  matrix.led({
    arc: 120,
    color: { r: data.value }
  }).render();
});

matrix.init('mic', {number: 5}).then(function(data){
  var c = ( data.value < 50 )? 'green' : ( data.value < 125 ) ? 'yellow' :
  (data.value < 200 ) ? 'orange' : 'red';

  matrix.led({
    arc: 150,
    color: { r: data.value }
  }).render();
});

matrix.init('mic', {number: 6}).then(function(data){
  var c = ( data.value < 50 )? 'green' : ( data.value < 125 ) ? 'yellow' :
  (data.value < 200 ) ? 'orange' : 'red';

  matrix.led({
    arc: 180,
    color: { r: data.value }
  }).render();
});

matrix.init('mic', {number: 7}).then(function(data){
  var c = ( data.value < 50 )? 'green' : ( data.value < 125 ) ? 'yellow' :
  (data.value < 200 ) ? 'orange' : 'red';

  matrix.led({
    arc: 210,
    color: { r: data.value }
  }).render();
});


//  var c = ( data.value < 50 )? 'green' : ( data.value < 125 ) ? 'yellow' :
  // (data.value < 200 ) ? 'orange' : 'red';
