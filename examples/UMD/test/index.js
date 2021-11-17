import test from 'tape'
import axios from 'axios'

test('Load an image file and display its contents', (t) => {
  const expectedOutput = `{
    "imageType": {
        "dimension": 2,
        "componentType": "uint8",
        "pixelType": "Scalar",
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
      processFile(event)
        .then(function () {
          outputTextArea.remove(outputTextArea)
          t.equal(outputTextArea.textContent, expectedOutput, 'Text area matches expected output')
          t.end()
        })
    })
})

test('Load a mesh file and display its contents', (t) => {
  const expectedOutput = `{
    "meshType": {
        "dimension": 3,
        "pointComponentType": "float",
        "pointPixelComponentType": "float",
        "pointPixelType": 1,
        "pointPixelComponents": 0,
        "cellComponentType": "uint32_t",
        "cellPixelComponentType": "float",
        "cellPixelType": 1,
        "cellPixelComponents": 0
    },
    "name": "Mesh",
    "numberOfPoints": 2903,
    "points": "3.716360092163086,2.3433899879455566,0,4.126560211181641,0.6420270204544067,0...",
    "numberOfPointPixels": 0,
    "pointData": null,
    "numberOfCells": 3263,
    "cells": "4,4,250,251,210,252...",
    "numberOfCellPixels": 0,
    "cellData": null,
    "cellBufferSize": 18856
}`
  const meshURL = 'https://data.kitware.com/api/v1/file/5c72abb18d777f072b610e69/download'
  return axios.get(meshURL, { responseType: 'blob' })
    .then((response) => {
      const testFile = new window.File([response.data], 'cow.vtk')
      // mock the event
      const event = { target: { files: [testFile] } }
      const outputTextArea = document.createElement('textarea')
      document.body.appendChild(outputTextArea)
      processFile(event)
        .then(function () {
          outputTextArea.remove()
          t.equal(outputTextArea.textContent, expectedOutput, 'Text area matches expected output')
          t.end()
        })
    })
})
