const LineSplitStream = require('./line-split');
const {createReadStream, createWriteStream} = require('fs');
const path = require('path');

const INPUT_FILE_NAME = path.resolve(__dirname/*process.cwd()*/, './input.txt');
const OUTPUT_FILE_NAME = path.resolve(__dirname/*process.cwd()*/, './output.txt');

const readStream = createReadStream(INPUT_FILE_NAME);
const writeStream = createWriteStream(OUTPUT_FILE_NAME, {flags: 'w'});
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