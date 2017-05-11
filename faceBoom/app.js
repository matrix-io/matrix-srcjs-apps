
matrix.led(['brown']).render();

var booms = [];


// Boom constructor
var Boom = function (angle) {
  console.log('Boom', angle);
  var self = this;
  self.tick = 0;
  self.start = ( angle < 0 ) ? (angle % 360) + 360 : angle % 360 ;
  // booms.push(self);
  booms = [self];
  // booms = _.takeRight(booms, 2);

  self.color = {
    r: Math.round(Math.random() * 255),
    g: Math.round(Math.random() * 255),
    b: Math.round(Math.random() * 255)
  }

  self.speed = Math.round(Math.max(2, Math.random() * 4));
  self.particles = Math.round(Math.max(5, Math.random() * 12));

  // determines speed mod and direction
  self.particleWeight = _.map(Array(self.particles), function () { 
    return (Math.random() > 0.5) ? 1 : -1 * Math.max(1, Math.random() * 10 )
  });

  console.log(self);


  self.render = function () {
    self.tick++;
    // if ( self.tick > 250 ) {
    //   booms.shift();
    //   return;
    // }
    var lights = [self.start];

    // animate
    for (var i = 0; i < this.particles; i++) {
      var targetAngle = self.start + (
        (self.speed / self.particleWeight[i]) * 
        self.tick );
      targetAngle = (targetAngle > 360) ? targetAngle % 360 : targetAngle;
      targetAngle = (targetAngle < 0) ? (targetAngle % 360) + 360 : targetAngle;
      lights.push(Math.round(targetAngle));
    }

    // dim
    lights = lights.map((a) => {
      return {
        angle: a,
        color: {
          r: Math.round((self.color.r) / self.tick * Math.abs(self.particleWeight[i])),
          g: Math.round((self.color.g) / self.tick * Math.abs(self.particleWeight[i]) ),
          b: Math.round((self.color.b) / self.tick * Math.abs(self.particleWeight[i]) )
        },
        // blend: true
        // color: self.color
      }
    })

    // console.log('L', lights);

    return lights;
  }
}

var faceTime;
var noFace = true;

var t = function faceTimer(){
  clearTimeout(faceTime);
  
  faceTime = setTimeout(function(){
    noFace = true;
  }, 1000)
}


matrix.on('s', function () {
  var lastFace;
  matrix.service('face').start().then(function (data) {
    // console.log('>>>>>>>>>>', data);
    var p = data.location;

    var a = Math.round(Math.atan2(p.x-320, p.y-240) * (180/Math.PI));
    
    lastFace = {
      angle: a,
      color: 'green', 
      // blend: true
    };

    if ( noFace ){
      noFace = false;
      new Boom(a);
    }
    t();

  });

  setInterval(function drawer() {
    var r = [lastFace];
    
    booms.forEach((b)=>{
      r = r.concat(b.render())  
    })
    console.log('r', r)
    r = _.compact(_.flatten(r));
    if ( r.length > 0){
      matrix.led(r).render();
    }
  }, 50)

})
