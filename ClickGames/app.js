// app code goes here
// matrix.init()....
//
// have fun

var fs = require('fs'),
async = require('async'),
player = require('play-sound')(opts = {}),
treeKill = require('tree-kill'),
EventEmitter = require('events').EventEmitter;
var Mouse = require('./node-mouse.js');
var mouse = new Mouse();

var perfectHit = false;
var okHit = false;
var failedHit = false;
var okValueHigh = 44;
var perfectValueHigh = 30;
var perfectValueLow = 24;
var okValueLow = 14;
var currentLed;
var currentState;
var paused = false;

function loop(filepath) {
  var audioProcess = player.play(filepath, { omxplayer: ['--loop'], mplayer: ['-loop', 0] }, function (err) { });
  return audioProcess;
}

//MXSS ACTIONS
matrix.on('leftClick', function() { 
  onOkButton();
});

matrix.on('rightClick', function() { 
  onCancelButton();
});

// MOUSE ACTIONS
mouse.on('mousedown', function (actions) {
  if (actions.leftBtn) onOkButton();
  else if (actions.rightBtn) onCancelButton();
});

function onOkButton() {
  switch (currentState) {
    case 'menu':
      killMenuState();
      quickPlayState();
      break;
    case 'quickplay':
      if (!paused) {
        if (currentLed <= perfectValueHigh && currentLed >= perfectValueLow) {
          console.log("*********************************** PERFECT HIT *********************************** (" + perfectValueLow + " < " + currentLed + " < " + perfectValueHigh + ")");
          perfectHit = true;
        } else if (currentLed <= okValueHigh && currentLed >= okValueLow) {
          console.log("*********************************** OK HIT *********************************** (" + okValueLow + " < " + currentLed + " < " + okValueHigh + ")");
          okHit = true;
        } else {
          failedHit = true;
          console.log("*********************************** RANDOM HIT *********************************** (" + currentLed + ")");
        } 
      } else {
        paused = false;
        killQuickPlayState();
        currentState = 'menu';
        menuState();
      }
      break;
    default:
      break;
  }
  flashArc(0, 360, 'blue', 500, true, function () {});
}

function onCancelButton() {
  switch (currentState) {
    case 'menu':
      killMenuState();
      break;
    case 'quickplay':
      if (!paused) {
        paused = true;
        player.play(__dirname + '/Sounds/Speech/Diego/GiveUp.ogg', function (err) {});
      } else {
        paused = false;
      }
      break;
    default:
      break;
  }
  flashArc(0, 360, 'red', 500, true, function () {});
}

start(); //Intro arc

function start() {
  async.parallel([
    function (next) { 
      player.play(__dirname + '/Sounds/Speech/Diego/ClickGames.ogg', function (err) {
        next();
      });
    },
    function (next) {
      async.series([
        async.apply(flashArc, 0, 90, 'red', 125, true),
        async.apply(flashArc, 90, 90, 'blue', 125, true),
        async.apply(flashArc, 180, 90, 'green', 125, true),
        async.apply(flashArc, 270, 90, 'yellow', 125, true)
      ], next);
    }
  ], menuState);
}

var killMenuState = function () { };

function menuState() {
  currentState = 'menu';
  player.play(__dirname + '/Sounds/Speech/Diego/QuickPlay.ogg', function (err) { }); //Option selected by default
  var loopProcess = loop(__dirname + '/Sounds/Intro.ogg'); //Intro BGM
  killMenuState = function () {
    treeKill(loopProcess.pid);
  };
}

function drawScoreBarObject(color) { 
  return {
    arc: 30,
    color: color, // color
    start: 340 // index to start drawing arc
  };
}

var difficulty = 0;

function flashArc(start, length, color, time, reset, callback) {
  matrix.led({
    arc: length, // degrees of arc [ 90° = quadrant ]
    color: color, // color
    start: start // index to start drawing arc
  }).render();

  setTimeout(function () {
    if (reset) matrix.led('black').render();
    callback();
  }, time);
}

var killQuickPlayState = function() { }; //Placeholder

function quickPlayState() {
  currentState = 'quickplay';

  var bgmLoop = loop(__dirname + '/Sounds/Arcade/bgm.ogg'); //Intro BGM
  
  var ledArray = [];
  ledArray.push(drawScoreBarObject('white')); //Set score bar 0
  ledArray.push({
    arc: okValueHigh - perfectValueHigh,
    color: 'yellow',
    start: perfectValueHigh
  });
  ledArray.push({
    arc: perfectValueHigh - perfectValueLow,
    color: 'green',
    start: perfectValueLow
  });
  ledArray.push({
    arc: perfectValueLow - okValueLow,
    color: 'yellow',
    start: okValueLow
  });
  
  var failCount = 0;
  var failedCounter = 0;
  var perfectCounter = 0;
  var okCounter = 0;
  var perfectCounterNumber = 0;
  var okCounterNumber = 0;

  var quickPlayTimeout;

  startRunning(2);

  function startRunning(speed) {
    currentLed = 340;
    var previousLed;
    var endingLed = 10;
    
    quickPlayTimeout = setInterval(function () {
      if (!paused) {
        if (failedCounter > 0) {
          failedCounter--;
          ledArray = [];
          ledArray.push(drawScoreBarObject('red'));
        } else if (perfectCounter > 0) {
          perfectCounter--;
          ledArray = [];
          ledArray.push(drawScoreBarObject('green'));
        } else if (okCounter > 0) {
          okCounter--;
          ledArray = [];
          ledArray.push(drawScoreBarObject('yellow'));
        } else {
          ledArray = [];
          ledArray.push(drawScoreBarObject('white'));
          ledArray.push({
            arc: okValueHigh - perfectValueHigh,
            color: 'yellow',
            start: perfectValueHigh
          });
          ledArray.push({
            arc: perfectValueHigh - perfectValueLow,
            color: 'green',
            start: perfectValueLow
          });
          ledArray.push({
            arc: perfectValueLow - okValueLow,
            color: 'yellow',
            start: okValueLow
          });
          ////
          if (ledArray.length > 4) ledArray.splice(-1, 1);
        }
        previousLed = currentLed;
        if (currentLed > 0) currentLed -= 2;
        ledArray.push({ angle: currentLed, color: 'magenta' });
        matrix.led(ledArray).render();
        if (currentLed <= endingLed || failedHit) {
          failedHit = false;
          if (failCount == 3000) {
            killQuickPlayState();
            player.play(__dirname + '/Sounds/Arcade/explosion.wav', function (err) {
              currentState = 'menu';
              menuState();
            });
          } else {
            currentLed = 340;
            player.play(__dirname + '/Sounds/Arcade/miss.wav', function (err) {});
          }
          failCount++;
          //ledArray.splice(-1, 1);
          ledArray = [];
          ledArray.push(drawScoreBarObject('red'));
          failedCounter = 20;
          //ledArray.push({ angle: currentLed, color: 'magenta' });
          matrix.led(ledArray).render();
          matrix.type('clickGames').send({
                'failCount': failCount
          });

        } else if (perfectHit) {
          perfectCounterNumber += 1;
          matrix.type('clickGames').send({
                'perfect': perfectCounterNumber
          });
          perfectCounter = 20;
          player.play(__dirname + '/Sounds/Arcade/perfect.wav', function (err) {});
          currentLed = 340;
          perfectHit = false;
        } else if (okHit) {
          okCounterNumber += 1;
          matrix.type('clickGames').send({
                'ok': okCounterNumber
          });
          okCounter = 20;
          player.play(__dirname + '/Sounds/Arcade/progress.wav', function (err) {});
          currentLed = 340;
          okHit = false;
        } 
      }
    }, speed);
  }   

  killQuickPlayState = function () {
    if (quickPlayTimeout) clearTimeout(quickPlayTimeout);
    treeKill(bgmLoop.pid);
  };
}


// to close mouse
// mouse.close();
// mouse = undefined;

/*
leftBtn: true,
rightBtn: false,
middleBtn: false,
xSign: false,
ySign: true,
xOverflow: false,
yOverflow: false,
xDelta: 0,
yDelta: -1,
type: 'button',
dev: 'mice' }
*/

/*
[Breakbeat Drum Loop 122 bpm] (https://freesound.org/people/orangefreesounds/sounds/260820/) by [orangefreesounds](https://freesound.org/people/orangefreesounds/) under the CC [Attribution License](https://creativecommons.org/licenses/by/3.0/) 
Music Loop electronic 115 bpm https://freesound.org/people/orangefreesounds/sounds/262940/
Funk Guitar Loop 114 bpm https://freesound.org/people/orangefreesounds/sounds/331365/
[A Loop to Kill For](http://freemusicarchive.org/music/Steve_Combs/Steve_Combs_1437/09_A_Loop_to_Kill_For) by [Steve Combs](http://freemusicarchive.org/music/Steve_Combs/) under the CC [Attribution License](https://creativecommons.org/licenses/by/3.0/)

Intro [Funk Guitar Loop 114 bpm](https://freesound.org/people/orangefreesounds/sounds/331365/) by [orangefreesounds](https://freesound.org/people/orangefreesounds/) under the CC [Attribution License](https://creativecommons.org/licenses/by/3.0/)

Arcade
bgm [Music Loop electronic 115 bpm](https://freesound.org/people/orangefreesounds/sounds/262940/) by [orangefreesounds](https://freesound.org/people/orangefreesounds/) under the CC [Attribution-NonCommercial License](https://creativecommons.org/licenses/by-nc/3.0/)


Baseball
miss [swing1.mp3](http://freesound.org/people/Taira%20Komori/sounds/215025/) by [Taira Komori](http://freesound.org/people/Taira%20Komori/)
hit [Hittin Baseball](http://www.freesfx.co.uk/download/?type=mp3&id=13588) by [freeSFX](http://www.freesfx.co.uk/)
bgm [WALLA Ballpark Chatter](http://freesound.org/people/AshFox/sounds/191917/) by [AshFox](http://freesound.org/people/AshFox/) under the CC [Attribution License](https://creativecommons.org/licenses/by/3.0/)
perfect [korea_baseball.flac](http://freesound.org/people/nikitralala/sounds/239936/) by [nikitralala](http://freesound.org/people/nikitralala/)
*/