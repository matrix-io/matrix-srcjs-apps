var events = require('events');
var util = require('util');
var zmq = require('zeromq');

var started = false;
var sock = zmq.socket('sub');

var viewsOnly = true; //Demographics from views only?
var processDetections = {
  face: true,
  vehicle: true
};

var self = this;

/**
 * From a Windows App detection, form the sctructure required by the app
 * @param {Object} detection JSON Object with detection data
 * @param {Object} append JSON Object with data to be appended to the ending result
 */
function formFaceRequest(detection, append) {
  var response = {};
  detection = detection.data[0];
  if (detection.isNew && detection.isNew === 1) return; //Discard if new face
  //TODO Adjust in case more than one detection arrives at a time
  /*detectionsArray.forEach(function (result) {*/
  //TODO Validate detection fields 
  //if (!validateDetection()) return response;

  var isView = detection.isView ? 1 : 0;
  var addDemographic = (isView === 1 || !viewsOnly); //Only adss demographics for views if viewsOnly is true

  var age = detection.age || 0;
  var ageGroup = '';
  if (age >= 0 && age <= 20 && addDemographic) ageGroup = 'Young';
  else if (age >= 21 && age <= 30 && addDemographic) ageGroup = 'Young Adult';
  else if (age >= 31 && age <= 60 && addDemographic) ageGroup = 'Adult';
  else if (addDemographic) ageGroup = 'Senior';


  response = {
    View: isView,
    isNew: 0, //detection.isNew ? 1 : 0, //TODO still required?
    impression: 1,//isView === 1 ? 0 : 1,
    age: (age && addDemographic) ? age : 0,
    gender: (detection.sex && addDemographic) ? detection.sex : '',
    emotion: (detection.emotion && addDemographic) ? detection.emotion : '',
    dwellTime: detection.dwellTime || 0,
    ageGroup: ageGroup,
    latitude: 0,
    longitude: 0,
    count: isView
    //time: parseInt(createdAt), //Now added through append 
    //campaignId: detection.campaignId, //Now added through append
    //adId: detection.adId //Now added through append
  };

  response = _.merge(response, append);

  return response;
}


/**
 * Configure detections
 * @param {Object} options Json object with the detection options to modify, e.g.: {vehicle: false} to disable vehicle detection
 */
function set(options) {
  processDetections = _.merge(processDetections, options);
}

/**
 * From a Windows App detection, form the sctructure required by the app
 * @param {Object} detection JSON Object with detection data
 * @param {Object} append JSON Object with data to be appended to the ending result
 */
function formVehicleRequest(detection, append) {
  var response = {};
  //TODO Adjust in case more than one detection arrives at a time
  /*detectionsArray.forEach(function (result) {*/
  //TODO Validate detection fields 
  //if (!validateDetection()) return response;

  response = {
    count: 1,
    speed: detection.data[0].speed,
    zoneId: detection.data[0].zoneId,
    //time: parseInt(createdAt), //Now added through append 
    //campaignId: detection.campaignId, //Now added through append
    //adId: detection.adId //Now added through append
  };

  response = _.merge(response, append);

  return response;
}


/**
 * Validates if the object is correctly formed
 * @param {Object} data Json with the detection data
 */
function validateDetectionStructure(data) {
  //TODO Implement validation
  return true;
}

function transformDetection(detection) {
  var result;
  if (validateDetectionStructure()) {
    
    //var detectionData = detection.data.detection.results[0]; //This changed
    var detectionData = detection.results[0];

    var append = {
      //time: parseInt(detection.createdAt),
      time: parseInt(detectionData.meta.timestamp),
      campaignId: detection.campaignId,
      adId: detection.adId
    };

    if (detectionData.data[0].kind === 'face' && processDetections.face) result = formFaceRequest(detectionData, append);
    else if (detectionData.data[0].kind === 'vehicle' && processDetections.vehicle) result = formVehicleRequest(detectionData, append);
    else console.log('Unsupported detection type (' + detectionData.data[0].kind + ')');
  }
  return result;
}

/**
 * Validate type of detection, parse if appropriate, skip otherwise
 * @param {array} detections Array containing detections 
 * @param {function} cb 
 */
function transformDetections(detections, cb) {
  var response = [];
  detections.forEach(function (detection) {
    var result = transformDetections(detection);
    if (!_.isUndefined(result)) response.push(result);
  });

  cb(undefined, response);
}

/**
 * Connects and sets listeners
 * @param {int} port Port number for the connection
 * @param {function} cb
 */
function connect(port, cb) {
  var err;
  try {
    sock.monitor(500, 0); //Disable this if disconnection doesn't need to be monitored
    sock.connect('tcp://127.0.0.1:' + port);
    sock.subscribe('');
  } catch (error) {
    err = error;
  }

  if (!err && !started) addSocketListeners();

  return cb(err);
}

/**
 * Adds the message and disconnect listeners to the zmq socket
 */
function addSocketListeners() {
  started = true;
  //Listen for incoming Windows app detections
  sock.on('message', function (msg) {
    var err, obj;
    try {
      var jsonString = msg.toString('utf8');
      obj = JSON.parse(jsonString);
    } catch (error) {
      err = error;
    }

    if (!err) {
      self.emit('message', obj);
      //process.stdout.write('*>'); //Use to test
    }
  });

  sock.on('connect', function (fd, ep) {
    console.log('Connect, endpoint:', ep);
  });

  sock.on('disconnect', function (fd, ep) {
    console.log('Disconnect, endpoint:', ep);
  });

}

/*
WINDOWS DATA SAMPLES
   
FACES

  {
    "location": {
      "latitude": "4.6492",
      "longitude": "-74.0628",
      "type": "Point"
    },
    "data": {
      "detection": {
        "meta": {
          "txId": "202bf9d1-99e9-42db-b7f3-d3f127ceaed1",
          "apiVersion": "1.3"
        },
        "results": [
          {
            "meta": {
              "app": {
                "name": "MATRIX.exe",
                "ver": "14.0",
                "platform": "Microsoft Windows 7 Home Premium ",
                "engines": [
                  "admobilize-detection-manager#201f5a6"
                ]
              },
              "device": {
                "id": "db253e163bd6"
              },
              "timestamp": 1504296763352
            },
            "data": [
              {
                "kind": "face",
                "age": 20,
                "boundingBox": {
                  "tl": {
                    "x": 241,
                    "y": 147
                  },
                  "size": {
                    "width": 314,
                    "height": 314
                  }
                },
                "dwellTime": 0.0238302965,
                "emotion": "angry",
                "isView": false,
                "pose": {
                  "pitch": 0.151017233729362,
                  "yaw": -0.0652780085802078,
                  "roll": 0.0996544227263291
                },
                "isNew": true,
                "inFrame": true,
                "sex": "male",
                "uid": "1504296771-3261127018695-6687"
              }
            ]
          }
        ]
      }
    },
    "createdAt": 1504296763352
  }

VEHICLES

  {
    "location": {
      "latitude": "4.6492",
      "longitude": "-74.0628",
      "type": "Point"
    },
    "data": {
      "detection": {
        "meta": {
          "txId": "1b164405-a9d7-4fe7-8cff-543bdc46bcb1",
          "apiVersion": "1.3"
        },
        "results": [
          {
            "meta": {
              "app": {
                "name": "MATRIX.exe",
                "ver": "14.0",
                "platform": "Microsoft Windows 7 Home Premium ",
                "engines": [
                  "admobilize-detection-manager#201f5a6"
                ]
              },
              "device": {
                "id": "db253e163bd6"
              },
              "timestamp": 1504044074537
            },
            "data": [
              {
                "kind": "vehicle",
                "isView": false,
                "speed": 0,
                "zoneId": "testz1"
              }
            ]
          }
        ]
      }
    },
    "createdAt": 1504044074537
  }

*/


function Windows() {
  self = this;
  self.connect = connect;
  self.set = set;
  self.transformDetection = transformDetection;
  self.transformDetections = transformDetections;
}

util.inherits(Windows, events.EventEmitter);
module.exports = new Windows();