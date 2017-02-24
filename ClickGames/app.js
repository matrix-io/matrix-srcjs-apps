// app code goes here
// matrix.init()....
//
// have fun

var fs = require('fs'),
async = require('async'),
player = require('play-sound')(opts = {}),
treeKill = require('tree-kill'),
EventEmitter = require('events').EventEmitter,
Mouse = require('./node-mouse.js');
var mouse = new Mouse();

/*

menu
  - quickplay
  - singleplayer
    - normal mode
    - endless mode
    - practice mode
  - multiplayer
    - versus
    - round robin 
  - options
    - themes
      - arcade
      - baseball

*/

  var failedHitsCounter = 0.0;
  var perfectHitsCounter = 0.0;
  var okHitsCounter = 0.0;
  var perfectsInARow = 0;
  var newLifePerfectCount = 5;
  var perfectHitScore = 2;
  var okHitScore = 1;
  var failedHitScore = -2;

var states = {
  'menu': {}, 
  'quickplay': {},
  'options': {},
  'themes': {},
};

var themes;


var defaultUIColor = 'darkgray';
//rgba(255, 0, 100, 0.6)
var hitColor = {
  perfect: 'green',
  ok: 'yellow',
  failed: 'red'
};

var currentHit = 'none';
var finalHit = false;
var paused = false;

//This section is used to display menus and results
var ledAmount = 34; 
var uiLower = 1;
var uiWidth = 5;
var uiHigher = (uiLower + uiWidth - 1) % ledAmount;
var uiBorderColor = 'darkblue';
var uiLivesColor = '#CC6600';

var startingLed = uiHigher + 2; // +2 to keep a separator between UI and starting LED
var endingLed = 34; 

// Starting configuration 
var okLowerLimit = 20;
var okHigherLimit = 34;
var okLimitRange = okHigherLimit - okLowerLimit + 1; //25 - 34 = 10 LEDS
var okDesiredRange = 3;
var perfectRange = 1;
var difficulty = 0; //NOT USED
var startingSpeed = 5;
var startingLives = 3;
var maxLives = 5;
var currentLives = startingLives;
var ledArray = [];
var score = 0;

// These variables are used to place the current target, crosshair and state
var currentOkLow, currentOkHigh, currentPerfectLow, currentPerfectHigh, currentLed, currentState;


////////////////////////////////////// MISC FUNCTIONS START //////////////////////////////////////

// Returns a random integer between a min (inclusive) and a max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loop(filepath) {
  var audioProcess = player.play(filepath, { omxplayer: ['--loop'], mplayer: ['-loop', 0] }, function (err) { });
  return audioProcess;
}

function changeState(previousState, nextState) {
  if (_.isUndefined(nextState)) {
    nextState = previousState;
  } else {
    states[previousState].kill();
  }
  currentState = nextState;
  states[nextState].start();
}

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

function paintRange(fromLed, toLed, color) {
  for (var i = fromLed; i <= toLed; i++) { ledArray[i] = color; } 
}

function drawScoreBarObject(color) {
  paintRange(uiLower, uiHigher, color); // Background
  ledArray[uiLower - 1] = uiBorderColor; // Left limit
  ledArray[uiHigher + 1] = uiBorderColor; // Right limit
  var livestoDraw = currentLives;
  if (livestoDraw > uiWidth) livestoDraw = uiWidth; // Don't exceed ui limits
  if (color == defaultUIColor) {
    paintRange(uiLower, uiLower + livestoDraw - 1, uiLivesColor); // Paint lives
  }
}

function relocateTarget() {
  currentOkLow = getRandomInt(okLowerLimit, okHigherLimit - (okDesiredRange + 1)); //25, (34 - (3 + 1)) = 30 in max case scenario
  currentOkHigh = currentOkLow + okDesiredRange - 1; // 30 + (3 - 1) = 32
  currentPerfectLow = currentOkLow + Math.floor(okDesiredRange / 2); // 30 + (3/2=1) = 31
  currentPerfectHigh = currentPerfectLow + perfectRange - 1; // 31 + 1 - 1 = 31 
}
////////////////////////////////////// MISC FUNCTIONS END //////////////////////////////////////


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
      changeState('menu', 'quickplay');
      break;
    case 'quickplay':
      if (paused) { //Go to Main Menu
        paused = false;
        changeState('quickplay', 'menu');
      } else { //Playing
        if (currentLed <= currentPerfectHigh && currentLed >= currentPerfectLow) {
          console.log("*********************************** PERFECT HIT *********************************** (" + currentPerfectLow + " < " + currentLed + " < " + currentPerfectHigh + ")");
          currentHit = 'perfect';
        } else if (currentLed <= currentOkHigh && currentLed >= currentOkLow) {
          console.log("*********************************** OK HIT *********************************** (" + currentOkLow + " < " + currentLed + " < " + currentOkHigh + ")");
          currentHit = 'ok';
        } else {
          console.log("*********************************** FAILED HIT *********************************** (" + currentLed + ")");
          currentHit = 'failed';
        } 
      }
      break;
    default:
      break;
  }
  //flashArc(0, 360, 'blue', 500, true, function () {});
}

function onCancelButton() {
  switch (currentState) {
    case 'menu':
      //Easter Egg maybe
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
  //flashArc(0, 360, 'red', 500, true, function () {});
}

start(); //Intro arc

function start() {
  async.parallel([
    function (next) { 
      player.play(__dirname + '/Sounds/Speech/Diego/ClickGames.ogg', function (err) { next(); });
    },
    function (next) {
      async.series([
        async.apply(flashArc, 0, 90, 'red', 100, true),
        async.apply(flashArc, 90, 90, 'blue', 100, true),
        async.apply(flashArc, 180, 90, 'green', 100, true),
        async.apply(flashArc, 270, 90, 'yellow', 100, true)
      ], next);
    }
  ], function () { 
    //matrix.type('clickGames').send({ 'status': 'Main Menu' });
    matrix.type('clickGames').send({ 'lives': currentLives, 'failedHitsCounter': failedHitsCounter, 'okHitsCounter': okHitsCounter, 'perfectHitsCounter': perfectHitsCounter, 'score': score, 'status': "Main menu" });
   
    changeState('menu');
  });
}

states.menu.start = function () {
  paintRange(0, 34, '0'); //Set background
  paintRange(uiLower, uiHigher, defaultUIColor); // Background
  ledArray[uiLower - 1] = uiBorderColor; // Left limit
  ledArray[uiHigher + 1] = uiBorderColor; // Right limit
  player.play(__dirname + '/Sounds/Speech/Diego/QuickPlay.ogg', function (err) { }); //Option selected by default
  var menuBGMProcess = loop(__dirname + '/Sounds/Intro.ogg'); //Intro BGM
  
  states.menu.kill = function () {
    treeKill(menuBGMProcess.pid);
  };
  
  matrix.led(ledArray).render();
};

states.quickplay.start = function () {

  states.quickplay.bgm = loop(__dirname + '/Sounds/Arcade/bgm.ogg'); //Intro BGM
  states.quickplay.kill = function () {
    if(states.quickplay.hasOwnProperty('interval') && states.quickplay.interval) clearInterval(states.quickplay.interval);
    treeKill(states.quickplay.bgm.pid);
  };

  var failedUIFor = 5;
  var perfectUIFor = 5;
  var okUIFor = 5;

  failedHitsCounter = 0.0;
  perfectHitsCounter = 0.0;
  okHitsCounter = 0.0;
  perfectsInARow = 0;
  newLifePerfectCount = 5;
  perfectHitScore = 2;
  okHitScore = 1;
  failedHitScore = -2;


  function resetHit() {
    currentHit = "none";
    currentLed = startingLed;
    relocateTarget();
  }

  function countHit(type) {
    var coloredJumps = 5;
    switch (type) {
      case 'perfect':
        drawScoreBarObject(hitColor.perfect);
        resetHit();
        perfectHitsCounter++;
        score += perfectHitScore;
        perfectUIFor = coloredJumps;
        perfectsInARow++;
        if (perfectsInARow == newLifePerfectCount && currentLives < maxLives) {
          currentLives++;
          perfectsInARow = 0;
          player.play(__dirname + '/Sounds/Arcade/lifeUp.wav', function (err) { });
        } else {
          player.play(__dirname + '/Sounds/Arcade/perfect.wav', function (err) { });
        }
        //matrix.type('clickGames').send({ 'lives': currentLives, 'perfectHitsCounter': perfectHitsCounter, 'status': 'PERFECT!', 'score': score  });
        matrix.type('clickGames').send({ 'lives': currentLives, 'failedHitsCounter': failedHitsCounter, 'okHitsCounter': okHitsCounter, 'perfectHitsCounter': perfectHitsCounter, 'score': score, 'status': "Perfect" });
   
        break;
      case 'ok':
        drawScoreBarObject(hitColor.ok);
        resetHit();
        okHitsCounter++;
        score += okHitScore;
        okUIFor = coloredJumps;
        //matrix.type('clickGames').send({ 'okHitsCounter': okHitsCounter, 'status': 'GOOD', 'score': score });
        matrix.type('clickGames').send({ 'lives': currentLives, 'failedHitsCounter': failedHitsCounter, 'okHitsCounter': okHitsCounter, 'perfectHitsCounter': perfectHitsCounter, 'score': score, 'status': "Good" });
   
        player.play(__dirname + '/Sounds/Arcade/progress.wav', function (err) { });
        perfectsInARow = 0;
        break;
      case 'failed':
        drawScoreBarObject(hitColor.failed);
        resetHit();
        failedHitsCounter++;
        score += failedHitScore;
        currentLives--;
        failedUIFor = coloredJumps;
        if (currentLives === 0) { // If lives are over, stop
          finalHit = true;
        } else { // Reset to start 
          player.play(__dirname + '/Sounds/Arcade/miss.wav', function (err) { });
        }
        //matrix.type('clickGames').send({ 'lives': currentLives, 'failedHitsCounter': failedHitsCounter, 'status': 'MISS!', 'score': score  });
        matrix.type('clickGames').send({ 'lives': currentLives, 'failedHitsCounter': failedHitsCounter, 'okHitsCounter': okHitsCounter, 'perfectHitsCounter': perfectHitsCounter, 'score': score, 'status': "MISS!" });
   
        perfectsInARow = 0;
        break;
      default:
        break;
    }
  }

  startRunning(startingSpeed);
  /*var prevDate = new Date();
  var currDate = new Date();
  var timeCounter = new Date();
  var prevTimeCounter = new Date();*/
  function startRunning(speed) {
    resetHit();
    currentLives = startingLives;
    matrix.type('clickGames').send({ 'lives': currentLives, 'failedHitsCounter': failedHitsCounter, 'okHitsCounter': okHitsCounter, 'perfectHitsCounter': perfectHitsCounter, 'score': score, 'status': "Quick Play" });
    score = 0;
    states.quickplay.interval = setInterval(function () {
      /*prevDate = currDate;
      currDate = new Date();*/
      paintRange(0, 34, 0); // Set background LEDs to black
      
      if (!paused) {

        currentLed++; // Move current led
        paintRange(currentOkLow, currentOkHigh, 'yellow'); // Paint ok
        paintRange(currentPerfectLow, currentPerfectHigh, 'green'); // Paint perfect

        // Color the UI according to previous hit
        if (failedUIFor > 0) { // Failed hit
          drawScoreBarObject(hitColor.failed);
        } else if (perfectUIFor > 0) { // Perfect Hit
          drawScoreBarObject(hitColor.perfect);
        } else if (okUIFor > 0) { // Ok Hit
          drawScoreBarObject(hitColor.ok);
        } else { // Normal UI
          drawScoreBarObject(defaultUIColor);
        }

        failedUIFor--;
        perfectUIFor--;
        okUIFor--;

        //Count hit        
        if (currentLed >= endingLed || currentHit == 'failed') {
          countHit('failed');
        } else if (currentHit == 'perfect') {
          countHit('perfect');
        } else if (currentHit == 'ok') {
          countHit('ok');
        }

        ledArray[currentLed] = 'magenta'; // Paint current led
        matrix.led(ledArray).render(); // Render Everloop

        if (finalHit) {
          finalHit = false;
          clearInterval(states.quickplay.interval); // Stop moving currentLed
          //matrix.type('clickGames').send({ 'status': 'Game Over', 'score': score });
          matrix.type('clickGames').send({ 'lives': currentLives, 'failedHitsCounter': failedHitsCounter, 'okHitsCounter': okHitsCounter, 'perfectHitsCounter': perfectHitsCounter, 'score': score, 'status': "Game Over" });
   
          player.play(__dirname + '/Sounds/Arcade/explosion.wav', function (err) {
            changeState('quickplay', 'menu');
          });
        }
      } else {
        paintRange(0, 34, uiLivesColor);
        matrix.led(ledArray).render();
      }
    }, speed);
  }

};


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