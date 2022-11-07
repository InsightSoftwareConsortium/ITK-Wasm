import path from 'path'

import loadEmscriptenModule from '../core/internal/loadEmscriptenModuleNode.js'
import PipelineEmscriptenModule from '../pipeline/PipelineEmscriptenModule.js'
import findLocalImageIOPath from './internal/findLocalImageIOPath.js'

import Image from '../core/Image.js'
import InterfaceTypes from '../core/InterfaceTypes.js'
import runPipelineEmscripten from '../pipeline/internal/runPipelineEmscripten.js'
import PipelineInput from '../pipeline/PipelineInput.js'
import ReadImageDICOMFileSeriesOptions from './ReadImageDICOMFileSeriesOptions.js'
import castImage from '../core/castImage.js'

async function readImageLocalDICOMFileSeries (
  fileNames: string[],
  options?: ReadImageDICOMFileSeriesOptions | boolean
): Promise<Image> {
  let singleSortedSeries = false
  if (typeof options === 'boolean') {
    // Backwards compatibility
    singleSortedSeries = options
  }

  if (fileNames.length < 1) {
    throw new Error('No fileNames provided')
  }
  const imageIOsPath = findLocalImageIOPath()
  const seriesReader = 'read-image-dicom-file-series'
  const seriesReaderPath = path.join(imageIOsPath, seriesReader + '.js')
  const seriesReaderModule = await loadEmscriptenModule(seriesReaderPath) as PipelineEmscriptenModule
  const mountedFilePath = seriesReaderModule.mountContainingDir(fileNames[0])
  const mountedDir = path.dirname(mountedFilePath)

  const mountedFileNames = fileNames.map((fileName) => {
    return path.join(mountedDir, path.basename(fileName))
  })
  const args = ['--memory-io', '--output-image', '0', '--input-images']
  mountedFileNames.forEach((fn) => {
    args.push(fn)
  })
  if (singleSortedSeries) {
    args.push('--single-sorted-series')
  }
  const desiredOutputs = [
    { type: InterfaceTypes.Image }
  ]
  const inputs = [
  ] as PipelineInput[]
  const { outputs } = runPipelineEmscripten(seriesReaderModule, args, desiredOutputs, inputs)

  let image = outputs[0].data as Image
  if (typeof options === 'object' && (typeof options.componentType !== 'undefined' || typeof options.pixelType !== 'undefined')) {
    image = castImage(image, options)
  }

  return image
}

export default readImageLocalDICOMFileSeries
