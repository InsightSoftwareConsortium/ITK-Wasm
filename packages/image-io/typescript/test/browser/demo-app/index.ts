import * as imageIo from '../../../dist/index.js'

globalThis.imageIo = imageIo

// Use local, vendored WebAssembly module assets
const pipelinesBaseUrl: string | URL = new URL('/pipelines', document.location.origin).href
imageIo.setPipelinesBaseUrl(pipelinesBaseUrl)

const params = new URLSearchParams(window.location.search)
if (!params.has('functionName')) {
// Begin added content
  params.set('functionName', 'readImage')
  const url = new URL(document.location)
  url.search = params
  window.history.replaceState({ functionName: 'readImage' }, '', url)
}

import './read-image-controller.js'
import './write-image-controller.js'
// End added content
import './bio-rad-read-image-controller.js'
import './bio-rad-write-image-controller.js'
import './bmp-read-image-controller.js'
import './bmp-write-image-controller.js'
import './fdf-read-image-controller.js'
import './fdf-write-image-controller.js'
import './gdcm-read-image-controller.js'
import './gdcm-write-image-controller.js'
import './ge-adw-read-image-controller.js'
import './ge-adw-write-image-controller.js'
import './ge4-read-image-controller.js'
import './ge4-write-image-controller.js'
import './ge5-read-image-controller.js'
import './ge5-write-image-controller.js'
import './gipl-read-image-controller.js'
import './gipl-write-image-controller.js'
import './hdf5-read-image-controller.js'
import './hdf5-write-image-controller.js'
import './jpeg-read-image-controller.js'
import './jpeg-write-image-controller.js'
import './lsm-read-image-controller.js'
import './lsm-write-image-controller.js'
import './meta-read-image-controller.js'
import './meta-write-image-controller.js'
import './mgh-read-image-controller.js'
import './mgh-write-image-controller.js'
import './minc-read-image-controller.js'
import './minc-write-image-controller.js'
import './mrc-read-image-controller.js'
import './mrc-write-image-controller.js'
import './nifti-read-image-controller.js'
import './nifti-write-image-controller.js'
import './nrrd-read-image-controller.js'
import './nrrd-write-image-controller.js'
import './png-read-image-controller.js'
import './png-write-image-controller.js'
import './scanco-read-image-controller.js'
import './scanco-write-image-controller.js'
import './tiff-read-image-controller.js'
import './tiff-write-image-controller.js'
import './vtk-read-image-controller.js'
import './vtk-write-image-controller.js'
import './wasm-read-image-controller.js'
import './wasm-write-image-controller.js'
import './wasm-zstd-read-image-controller.js'
import './wasm-zstd-write-image-controller.js'
