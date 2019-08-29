const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._buffer = '';
  }

  _transform(chunk, encoding, callback) {
    chunk.toString().split(os.EOL).forEach((item, index, arr) => {
      if (arr.length === 1)  {this._buffer += item; return;}
      if (index === 0) {this.push(this._buffer + item); this._buffer = ''; return;}
      if (index === arr.length - 1) { this._buffer = item; return;}
    });
    callback();
  }

  _flush(callback) {
    callback(null, this._buffer);
  }
}

module.exports = LineSplitStream;
