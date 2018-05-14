

const moment = require('moment');
const winData = require('./lib/windows.js');
const detectionType = 'face';

/////////////
// Windows //
/////////////

let detectionsEnabled = { face: false, vehicle: false };
detectionsEnabled[detectionType] = true;
winData.set(detectionsEnabled); //Ignore opposite detection requests

let maleSample = {
  'meta': {
    'txId': '202bf9d1-99e9-42db-b7f3-d3f127ceaed1',
    'apiVersion': '1.3'
  },
  'results': [
    {
      'meta': {
        'app': {
          'name': 'MATRIX.exe',
          'ver': '14.0',
          'platform': 'Microsoft Windows 7 Home Premium ',
          'engines': [
            'admobilize-detection-manager#201f5a6'
          ]
        },
        'device': {
          'id': 'db253e163bd6'
        },
        'timestamp': 1504296763352
      },
      'data': [
        {
          'kind': 'face',
          'age': 40,
          'boundingBox': {
            'tl': {
              'x': 241,
              'y': 147
            },
            'size': {
              'width': 314,
              'height': 314
            }
          },
          'dwellTime': 2.0238302965,
          'emotion': 'happy',
          'isView': true,
          'pose': {
            'pitch': 0.151017233729362,
            'yaw': -0.0652780085802078,
            'roll': 0.0996544227263291
          },
          'isNew': false,
          'inFrame': true,
          'sex': 'male',
          'uid': '1504296771-3261127018695-6687'
        }
      ]
    }
  ]
};

let femaleSample = {

  'meta': {
    'txId': '202bf9d1-99e9-42db-b7f3-d3f127ceaed1',
    'apiVersion': '1.3'
  },
  'results': [
    {
      'meta': {
        'app': {
          'name': 'MATRIX.exe',
          'ver': '14.0',
          'platform': 'Microsoft Windows 7 Home Premium ',
          'engines': [
            'admobilize-detection-manager#201f5a6'
          ]
        },
        'device': {
          'id': 'db253e163bd6'
        },
        'timestamp': 1504296763352
      },
      'data': [
        {
          'kind': 'face',
          'age': 30,
          'boundingBox': {
            'tl': {
              'x': 241,
              'y': 147
            },
            'size': {
              'width': 314,
              'height': 314
            }
          },
          'dwellTime': 1.0238302965,
          'emotion': 'angry',
          'isView': true,
          'pose': {
            'pitch': 0.151017233729362,
            'yaw': -0.0652780085802078,
            'roll': 0.0996544227263291
          },
          'isNew': false,
          'inFrame': true,
          'sex': 'female',
          'uid': '1504296771-3261127018695-6687'
        }
      ]
    }
  ]
};

let impressionSample = {

  'meta': {
    'txId': '202bf9d1-99e9-42db-b7f3-d3f127ceaed1',
    'apiVersion': '1.3'
  },
  'results': [
    {
      'meta': {
        'app': {
          'name': 'MATRIX.exe',
          'ver': '14.0',
          'platform': 'Microsoft Windows 7 Home Premium ',
          'engines': [
            'admobilize-detection-manager#201f5a6'
          ]
        },
        'device': {
          'id': 'db253e163bd6'
        },
        'timestamp': 1504296763352
      },
      'data': [
        {
          'kind': 'face',
          'age': 20,
          'boundingBox': {
            'tl': {
              'x': 241,
              'y': 147
            },
            'size': {
              'width': 314,
              'height': 314
            }
          },
          'dwellTime': 0.0238302965,
          'emotion': 'angry',
          'isView': false,
          'pose': {
            'pitch': 0.151017233729362,
            'yaw': -0.0652780085802078,
            'roll': 0.0996544227263291
          },
          'isNew': false,
          'inFrame': true,
          'sex': 'female',
          'uid': '1504296771-3261127018695-6687'
        }
      ]
    }
  ]
};

function randomSample() {
  let options = [impressionSample, femaleSample, maleSample];
  let detection = options[Math.floor(Math.random() * options.length)];
  //console.log('detection:', detection);
  let date = moment().valueOf();
  detection.adId = 'TestAd' + (Math.floor(Math.random() * 4) + 1);
  detection.campaignId = 'TestCampaign' + (Math.floor(Math.random() * 2) + 1);
  detection.results[0].meta.timestamp = date;
  detection = winData.transformDetection(detection);
  if (!detection) console.log('Bad detection formed');
  return detection;
}

function sendOne() {
  let detection = randomSample();
  matrix.type(detectionType).send(detection); //Send the data
}

function sendMany(number) {
  for (let i = 0; i < number; i++) {
    sendOne();
  }
}

setTimeout(() => {
  sendOne();
}, matrix.siegeInterval || 10000)

matrix.on('send1', function () {
  sendOne();
});

matrix.on('send10', function () {
  sendMany(10);
});

matrix.on('send100', function () {
  sendMany(100);
});

matrix.on('send500', function () {
  sendMany(500);
});

matrix.on('send1000', function () {
  sendMany(1000);
});

matrix.on('send5000', function () {
  sendMany(5000);
});

matrix.on('send20000', function () {
  sendMany(20000);
});

matrix.on('send100000', function () {
  sendMany(100000);
});

matrix.on('send300000', function () {
  sendMany(300000);
});