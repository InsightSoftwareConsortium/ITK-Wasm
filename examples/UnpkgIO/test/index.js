import test from 'tape'
import axios from 'axios'

import config from './itkConfig'

import { outputFileInformation } from '../src/index'
console.log(config)

test('Loading an image file and displaying its contents', (t) => {
  const expectedOutput = `{
    "imageType": {
        "dimension": 2,
        "componentType": "uint8_t",
        "pixelType": 1,
        "components": 1
    },
    "name": "Image",
    "origin": [
        0,
        0
    ],
    "spacing": [
        1,
        1
    ],
    "direction": {
        "rows": 2,
        "columns": 2,
        "data": [
            1,
            0,
            0,
            1
        ]
    },
    "size": [
        100,
        100
    ],
    "data": "0,0,0,0,0,0..."
}`
  const imageURL = 'https://data.kitware.com/api/v1/file/57b76d848d777f10f269bcdf/download'
  return axios.get(imageURL, { responseType: 'blob' })
    .then((response) => {
      const testFile = new window.File([response.data], 'BinaryImageWithVariousShapes01.png')
      // mock the event
      const event = { target: { files: [testFile] } }
      const outputTextArea = document.createElement('textarea')
      document.body.appendChild(outputTextArea)
      outputFileInformation(outputTextArea, event)
        .then(function () {
          t.equal(outputTextArea.textContent, expectedOutput)
          t.end()
        })
    })
})
