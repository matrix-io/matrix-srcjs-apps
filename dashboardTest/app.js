// app code goes here
// matrix.init()....
//
// have fun

var women = 0;
var men = 0;
var happy = 0;
var sad = 0;
var disgust = 0;
var surprised = 0;
var confused = 0;
var calm = 0;
var angry = 0;
var views = 0;
var count = 0;

matrix.on('blueColorClick', function() {
    matrix.led('blue').render();
});

matrix.on('redColorClick', function() {
    matrix.led('red').render();
});

matrix.on('greenColorSelected', function() {
    matrix.led('green').render();
});

matrix.on('yellowColorSelected', function() {
    matrix.led('yellow').render();
});

matrix.on('turnOnLeds', function(p) {
    if(p.value === true){
        matrix.led('white').render();
    } else {
        matrix.led('black').render();
    }
    matrix.type('systemLeds').send({
        'ledsOn': p.value
    });
});

matrix.on('numberOfLeds', function(p) {
    var leds = [];
    for(i=0; i < 35; i++) {
		if(i < p.value) {
			leds[i] = 'white';
		}else{
			leds[i] = 'black';
		}
	}
	matrix.led(leds).render();
});

var options = {
  refresh: 1000,//milliseconds
  timeout: 1000 //milliseconds
};

matrix.init('temperature', options).then(function(data, val){
    if (typeof(data) !== "undefined") {
        if (data.hasOwnProperty('value')) {
            matrix.type('systemTemperature').send({
                'temperature': data.value
            });
        }
    }
});

matrix.init('humidity', options).then(function(data){
    if (typeof(data) !== "undefined") {
        if (data.hasOwnProperty('value')) {
            matrix.type('systemHumidity').send({
                'humidity': data.value
            });
        }
    }
});

matrix.init('uv', options).then(function(data){
    if (typeof(data) !== "undefined") {
        if (data.hasOwnProperty('value') && data.hasOwnProperty('risk')) {
            matrix.type('systemUV').send({
                'uv': data.value,
                'uvRisk': data.risk
            });
        }
    }
});

matrix.init('accelerometer', options).then(function(data){
    if (typeof(data) !== "undefined") {
        if (data.hasOwnProperty('x') && data.hasOwnProperty('y') && data.hasOwnProperty('z')) {
            matrix.type('systemAccelerometer').send({
                'x': data.x,
                'y': data.y,
                'z': data.z
            });
        }
    }
});

matrix.init('gyroscope', options).then(function(data){
    if (typeof(data) !== "undefined") {
        if (data.hasOwnProperty('yaw') && data.hasOwnProperty('pitch') && data.hasOwnProperty('roll')) {
            matrix.type('systemGyroscope').send({
                'yaw': data.yaw,
                'pitch': data.pitch,
                'roll': data.roll
            });
        }
    }
});

matrix.init('pressure', options).then(function(data){
    if (typeof(data) !== "undefined") {
        if (data.hasOwnProperty('value')) {
            matrix.type('systemPressure').send({
                'pressure': data.value
            });
        }
    }
});

matrix.init('demographics').then(function (data) {
    if (typeof(data) !== "undefined") {
        count += 1;
        if (data.hasOwnProperty('demographics')) {
            var gender = '';
            var emotion = '';
            var age = 0;
            var view = false;
            var pitch = 0;
            var yaw = 0;
            var roll = 0;
            if (data.demographics.hasOwnProperty('gender')) {
                gender = data.demographics.gender;
                if (gender === 'MALE'){
                    men += 1;
                } else {
                    women += 1;
                }
            }
            if (data.demographics.hasOwnProperty('emotion')) {
                emotion = data.demographics.emotion;
                if (emotion === 'ANGRY'){
                    angry += 1;
                } else if (emotion === 'DISGUST'){
                    disgust += 1;
                } else if (emotion === 'CONFUSED'){
                    confused += 1;
                } else if (emotion === 'HAPPY'){
                    happy += 1;
                } else if (emotion === 'SAD'){
                    sad += 1;
                } else if (emotion === 'SURPRISED'){
                    surprised += 1;
                } else if (emotion === 'CALM'){
                    calm += 1;
                }
            }
            if (data.demographics.hasOwnProperty('age')) {
                age = data.demographics.age;
            }
            if (data.demographics.hasOwnProperty('pose')) {
                if (data.demographics.pose.hasOwnProperty('yaw')) {
                    yaw = data.demographics.pose.yaw;
                }
                if (data.demographics.pose.hasOwnProperty('roll')) {
                    roll = data.demographics.pose.roll;
                }
                if (data.demographics.pose.hasOwnProperty('pitch')) {
                    pitch = data.demographics.pose.pitch;
                }
                    var xangletest = false;
                    var yangletest = false;
                    if (Math.abs(yaw) <= ((40*Math.PI)/180.0)) {
                        xangletest = true;
                    }
                    if (Math.abs(pitch) <= ((40*Math.PI)/180.0)) {
                        yangletest = true;
                    }
                    if (xangletest === true && yangletest === true){
                        view = true;
                        views += 1;
                    } else {
                        view = false;
                    }
            }
            var viewsPercentage =  views/count*100;
            matrix.type('face').send({
                'view': view,
                'count': count,
                'gender': gender,
                'age': age,
                'women': women,
                'men': men,
                'emotion': emotion,
                'happy': happy,
                'sad': sad,
                'disgust': disgust,
                'surprised': surprised,
                'confused': confused,
                'calm': calm,
                'angry': angry,
                'views': views,
                'viewsPercentage' : viewsPercentage
            });
        }
    }
});