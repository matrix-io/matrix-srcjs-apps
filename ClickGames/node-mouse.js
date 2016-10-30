/**
 * Author: Javier Infante (jabi@irontec.com)
 * Modified by: Diego Ribero (diegoribero@gmail.com)
 *
 * (very lightly) Adapted  from Read Linux mouse(s) in node.js
 * Author: Marc Loehe (marcloehe@gmail.com)
 * https://gist.github.com/bfncs/2020943
 *
 * Adapted from Tim Caswell's nice solution to read a linux joystick
 * http://nodebits.org/linux-joystick
 * https://github.com/nodebits/linux-joystick
 */

var fs = require('fs'),
    EventEmitter = require('events').EventEmitter;

/**
 * Keep previous status
 */
var prevEvent;

/**
 * Parse PS/2 mouse protocol
 * According to http://www.computer-engineering.org/ps2mouse/
 */
function parse(mouse, buffer) {
  var event = {
    leftBtn:    (buffer[0] & 1  ) > 0, // Bit 0
    rightBtn:   (buffer[0] & 2  ) > 0, // Bit 1
    middleBtn:  (buffer[0] & 4  ) > 0, // Bit 2
    xSign:      (buffer[0] & 16 ) > 0, // Bit 4
    ySign:      (buffer[0] & 32 ) > 0, // Bit 5
    xOverflow:  (buffer[0] & 64 ) > 0, // Bit 6
    yOverflow:  (buffer[0] & 128) > 0, // Bit 7
    xDelta:      buffer.readInt8(1),   // Byte 2 as signed int
    yDelta:      buffer.readInt8(2)    // Byte 3 as signed int
  };

  event.types = [];
  event.buttons;

  if (typeof prevEvent === 'undefined') { //It it is the first event
    if (event.leftBtn || event.rightBtn || event.middleBtn) {
      event.buttons = { down: [] };
      event.types.push('mousedown');
      if (event.leftBtn) event.buttons.down.push(0);
      if (event.middleBtn) event.buttons.down.push(1);
      if (event.rightBtn) event.buttons.down.push(2);
    }
    if (event.xSign || event.ySign || event.xOverflow || event.yOverflow || event.xDelta || event.yDelta) {
      event.types.push('mousemove');
    }
  } else { //If we have a previous state  else { //If we have a previous state 
    if (event.leftBtn != prevEvent.leftBtn || event.rightBtn != prevEvent.rightBtn || event.middleBtn != prevEvent.middleBtn) { //Button change detected
      var up = false;
      var down = false;
      event.buttons = { down: [], up: [] };
      if (event.leftBtn != prevEvent.leftBtn) {
        if (event.leftBtn == true) {
          down = true;
          event.buttons.down.push(0);
        } else {
          up = true;
          event.buttons.up.push(0);
        }
      }
      if (event.middleBtn != prevEvent.middleBtn) {
        if (event.middleBtn == true) {
          down = true;
          event.buttons.down.push(1);
        } else {
          up = true;
          event.buttons.up.push(1);
        }
      }
      if (event.rightBtn != prevEvent.rightBtn) {
        if (event.rightBtn == true) {
          down = true;
          event.buttons.down.push(2);
        } else {
          up = true;
          event.buttons.up.push(2);
        }
      }

      if (down) event.types.push('mousedown');
      else delete event.buttons.down;

      if (up) event.types.push('mouseup');
      else delete event.buttons.up;
    }

    if (event.xSign != prevEvent.xSign || event.ySign != prevEvent.ySign || event.xOverflow != prevEvent.xOverflow || event.yOverflow != prevEvent.yOverflow || event.xDelta != prevEvent.xDelta || event.yDelta != prevEvent.yDelta) {
      event.types.push('mousemove');
    }
  }

  prevEvent = event;
  return event;
}

function Mouse(mouseid) {
  this.wrap('onOpen');
  this.wrap('onRead');
  this.dev = typeof(mouseid) === 'number' ? 'mouse' + mouseid : 'mice';
  this.buf = new Buffer(3);
  fs.open('/dev/input/' + this.dev, 'r', this.onOpen);
}

Mouse.prototype = Object.create(EventEmitter.prototype, {
  constructor: {value: Mouse}
});

Mouse.prototype.wrap = function(name) {
  var self = this;
  var fn = this[name];
  this[name] = function (err) {
    if (err) return self.emit('error', err);

    return fn.apply(self, Array.prototype.slice.call(arguments, 1));
  };
};

Mouse.prototype.onOpen = function(fd) {
  this.fd = fd;
  this.read();
};

Mouse.prototype.read = function() {
  fs.read(this.fd, this.buf, 0, 3, null, this.onRead);
};

Mouse.prototype.onRead = function (bytesRead) {
  var self = this;
  var event = parse(this, this.buf);
  event.dev = this.dev;
  event.types.forEach(function (eventType) {
    self.emit(eventType, event);
  });  
  if (event.types.indexOf('mouseup') != -1) {
    self.emit('click', event);
  }
  if (this.fd) this.read();
};

Mouse.prototype.close = function(callback) {
  fs.close(this.fd, (function(){console.log(this);}));
  this.fd = undefined;
};

module.exports = Mouse;

