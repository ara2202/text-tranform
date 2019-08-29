const LineSplitStream = require('./line-split');
const {createReadStream, createWriteStream} = require('fs');
const path = require('path');

const FILE_NAME = path.resolve(__dirname/*process.cwd()*/, './input.txt');

const readStream = createReadStream(FILE_NAME);
const writeStream = createWriteStream(`${FILE_NAME}.bak`, {flags: 'w'});
const linesSplitStream = new LineSplitStream({encoding: 'utf-8', lineLength: 23});
/* pipe method */

readStream
  .pipe(linesSplitStream)
  .pipe(writeStream)
  .on('error', err => {
    console.log(`Write error ${err.message}`);
  });

readStream.on('error', err => {
  console.log(`Read error: ${err.message}`);
  // delete junk file
});

// writeStream.on('error', );

readStream.once('close', () => {
  console.log("Stream closed");
});