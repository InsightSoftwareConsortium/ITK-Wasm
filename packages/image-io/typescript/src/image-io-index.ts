import pngReadImage from './png-read-image.js'
import pngWriteImage from './png-write-image.js'
import metaReadImage from './meta-read-image.js'
import metaWriteImage from './meta-write-image.js'
import tiffReadImage from './tiff-read-image.js'
import tiffWriteImage from './tiff-write-image.js'
import niftiReadImage from './nifti-read-image.js'
import niftiWriteImage from './nifti-write-image.js'
import jpegReadImage from './jpeg-read-image.js'
import jpegWriteImage from './jpeg-write-image.js'
import nrrdReadImage from './nrrd-read-image.js'
import nrrdWriteImage from './nrrd-write-image.js'
import vtkReadImage from './vtk-read-image.js'
import vtkWriteImage from './vtk-write-image.js'
import bmpReadImage from './bmp-read-image.js'
import bmpWriteImage from './bmp-write-image.js'
import hdf5ReadImage from './hdf5-read-image.js'
import hdf5WriteImage from './hdf5-write-image.js'
import mincReadImage from './minc-read-image.js'
import mincWriteImage from './minc-write-image.js'
import mrcReadImage from './mrc-read-image.js'
import mrcWriteImage from './mrc-write-image.js'
import lsmReadImage from './lsm-read-image.js'
import lsmWriteImage from './lsm-write-image.js'
import mghReadImage from './mgh-read-image.js'
import mghWriteImage from './mgh-write-image.js'
import bioRadReadImage from './bio-rad-read-image.js'
import bioRadWriteImage from './bio-rad-write-image.js'
import giplReadImage from './gipl-read-image.js'
import giplWriteImage from './gipl-write-image.js'
import geAdwReadImage from './ge-adw-read-image.js'
import geAdwWriteImage from './ge-adw-write-image.js'
import ge4ReadImage from './ge4-read-image.js'
import ge4WriteImage from './ge4-write-image.js'
import ge5ReadImage from './ge5-read-image.js'
import ge5WriteImage from './ge5-write-image.js'
import gdcmReadImage from './gdcm-read-image.js'
import gdcmWriteImage from './gdcm-write-image.js'
import scancoReadImage from './scanco-read-image.js'
import scancoWriteImage from './scanco-write-image.js'
import fdfReadImage from './fdf-read-image.js'
import wasmReadImage from './wasm-read-image.js'
import wasmWriteImage from './wasm-write-image.js'
import wasmZstdReadImage from './wasm-zstd-read-image.js'
import wasmZstdWriteImage from './wasm-zstd-write-image.js'

const imageIoIndex = new Map([
  ['png', [pngReadImage, pngWriteImage]],
  ['meta', [metaReadImage, metaWriteImage]],
  ['tiff', [tiffReadImage, tiffWriteImage]],
  ['nifti', [niftiReadImage, niftiWriteImage]],
  ['jpeg', [jpegReadImage, jpegWriteImage]],
  ['nrrd', [nrrdReadImage, nrrdWriteImage]],
  ['vtk', [vtkReadImage, vtkWriteImage]],
  ['bmp', [bmpReadImage, bmpWriteImage]],
  ['hdf5', [hdf5ReadImage, hdf5WriteImage]],
  ['mnc', [mincReadImage, mincWriteImage]],
  ['mrc', [mrcReadImage, mrcWriteImage]],
  ['lsm', [lsmReadImage, lsmWriteImage]],
  ['mgh', [mghReadImage, mghWriteImage]],
  ['bioRad', [bioRadReadImage, bioRadWriteImage]],
  ['gipl', [giplReadImage, giplWriteImage]],
  ['geAdw', [geAdwReadImage, geAdwWriteImage]],
  ['ge4', [ge4ReadImage, ge4WriteImage]],
  ['ge5', [ge5ReadImage, ge5WriteImage]],
  ['gdcm', [gdcmReadImage, gdcmWriteImage]],
  ['scanco', [scancoReadImage, scancoWriteImage]],
  ['fdf', [fdfReadImage, null]],
  ['wasm', [wasmReadImage, wasmWriteImage]],
  ['wasmZstd', [wasmZstdReadImage, wasmZstdWriteImage]]
])

export default imageIoIndex

