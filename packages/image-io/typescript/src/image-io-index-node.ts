import pngReadImageNode from './png-read-image-node.js'
import pngWriteImageNode from './png-write-image-node.js'
import metaReadImageNode from './meta-read-image-node.js'
import metaWriteImageNode from './meta-write-image-node.js'
import tiffReadImageNode from './tiff-read-image-node.js'
import tiffWriteImageNode from './tiff-write-image-node.js'
import niftiReadImageNode from './nifti-read-image-node.js'
import niftiWriteImageNode from './nifti-write-image-node.js'
import jpegReadImageNode from './jpeg-read-image-node.js'
import jpegWriteImageNode from './jpeg-write-image-node.js'
import nrrdReadImageNode from './nrrd-read-image-node.js'
import nrrdWriteImageNode from './nrrd-write-image-node.js'
import vtkReadImageNode from './vtk-read-image-node.js'
import vtkWriteImageNode from './vtk-write-image-node.js'
import bmpReadImageNode from './bmp-read-image-node.js'
import bmpWriteImageNode from './bmp-write-image-node.js'
import hdf5ReadImageNode from './hdf5-read-image-node.js'
import hdf5WriteImageNode from './hdf5-write-image-node.js'
import mincReadImageNode from './minc-read-image-node.js'
import mincWriteImageNode from './minc-write-image-node.js'
import mrcReadImageNode from './mrc-read-image-node.js'
import mrcWriteImageNode from './mrc-write-image-node.js'
import lsmReadImageNode from './lsm-read-image-node.js'
import lsmWriteImageNode from './lsm-write-image-node.js'
import mghReadImageNode from './mgh-read-image-node.js'
import mghWriteImageNode from './mgh-write-image-node.js'
import bioRadReadImageNode from './bio-rad-read-image-node.js'
import bioRadWriteImageNode from './bio-rad-write-image-node.js'
import giplReadImageNode from './gipl-read-image-node.js'
import giplWriteImageNode from './gipl-write-image-node.js'
import geAdwReadImageNode from './ge-adw-read-image-node.js'
import geAdwWriteImageNode from './ge-adw-write-image-node.js'
import ge4ReadImageNode from './ge4-read-image-node.js'
import ge4WriteImageNode from './ge4-write-image-node.js'
import ge5ReadImageNode from './ge5-read-image-node.js'
import ge5WriteImageNode from './ge5-write-image-node.js'
import gdcmReadImageNode from './gdcm-read-image-node.js'
import gdcmWriteImageNode from './gdcm-write-image-node.js'
import scancoReadImageNode from './scanco-read-image-node.js'
import scancoWriteImageNode from './scanco-write-image-node.js'
import fdfReadImageNode from './fdf-read-image-node.js'
import wasmReadImageNode from './wasm-read-image-node.js'
import wasmWriteImageNode from './wasm-write-image-node.js'
import wasmZstdReadImageNode from './wasm-zstd-read-image-node.js'
import wasmZstdWriteImageNode from './wasm-zstd-write-image-node.js'

const imageIoIndexNode = new Map([
  ['png', [pngReadImageNode, pngWriteImageNode]],
  ['meta', [metaReadImageNode, metaWriteImageNode]],
  ['tiff', [tiffReadImageNode, tiffWriteImageNode]],
  ['nifti', [niftiReadImageNode, niftiWriteImageNode]],
  ['jpeg', [jpegReadImageNode, jpegWriteImageNode]],
  ['nrrd', [nrrdReadImageNode, nrrdWriteImageNode]],
  ['vtk', [vtkReadImageNode, vtkWriteImageNode]],
  ['bmp', [bmpReadImageNode, bmpWriteImageNode]],
  ['hdf5', [hdf5ReadImageNode, hdf5WriteImageNode]],
  ['minc', [mincReadImageNode, mincWriteImageNode]],
  ['mrc', [mrcReadImageNode, mrcWriteImageNode]],
  ['lsm', [lsmReadImageNode, lsmWriteImageNode]],
  ['mgh', [mghReadImageNode, mghWriteImageNode]],
  ['bioRad', [bioRadReadImageNode, bioRadWriteImageNode]],
  ['gipl', [giplReadImageNode, giplWriteImageNode]],
  ['geAdw', [geAdwReadImageNode, geAdwWriteImageNode]],
  ['ge4', [ge4ReadImageNode, ge4WriteImageNode]],
  ['ge5', [ge5ReadImageNode, ge5WriteImageNode]],
  ['gdcm', [gdcmReadImageNode, gdcmWriteImageNode]],
  ['scanco', [scancoReadImageNode, scancoWriteImageNode]],
  ['fdf', [fdfReadImageNode, null]],
  ['wasm', [wasmReadImageNode, wasmWriteImageNode]],
  ['wasmZstd', [wasmZstdReadImageNode, wasmZstdWriteImageNode]]
])

export default imageIoIndexNode
