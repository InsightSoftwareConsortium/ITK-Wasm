# promise-file-reader
Wraps [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader) in a Promise

![travis ci](https://travis-ci.org/jahredhope/promise-file-reader.svg?branch=master)
[![npm](https://img.shields.io/npm/v/promise-file-reader.svg)](https://www.npmjs.com/package/promise-file-reader)

## Install
```
npm install --save promise-file-reader
```

## Usage

### Basic syntax
```javascript
const PromiseFileReader = require('promise-file-reader');

PromiseFileReader.readAsDataURL(fileData)
  .then(newImage)
  .catch(err => console.error(err));
```

### Example: file input
```javascript
import {readAsDataURL, readAsText, readAsArrayBuffer} from 'promise-file-reader';

function newImage(imageDataUrl) {
  ...
}
function newTextFile(text) {
  ...
}
function loadedArrayBuffer(arrayBuffer) {
  ...
}

// e.g. <input id="file-input" type="file" />
const fileInput = document.getElementById('file-input');
fileInput.addEventListener("change", handleFiles, false);
function handleFiles(event) {
  const fileMetaData =  event.target.files[0];

  if(fileMetaData) {
    if (/^image/.test(fileMetaData.type)) {
      readAsDataURL(fileMetaData)
      .then(newImage)
      .catch(err => console.error(err));
    } else {
      readAsText(fileMetaData)
      .then(newTextFile)
      .catch(err => console.error(err));
    }
    // or
    readAsArrayBuffer(fileMetaData)
      .then(loadedArrayBuffer)
      .catch(err => console.error(err));
  }
}
```
