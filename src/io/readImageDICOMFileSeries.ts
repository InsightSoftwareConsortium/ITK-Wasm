import { readAsArrayBuffer } from 'promise-file-reader'

import ReadImageFileSeriesResult from './ReadImageFileSeriesResult.js'
import readImageDICOMArrayBufferSeries from './readImageDICOMArrayBufferSeries.js'
import ReadImageDICOMFileSeriesOptions from './ReadImageDICOMFileSeriesOptions.js'
import ReadImageDICOMArrayBufferSeriesOptions from './ReadImageDICOMArrayBufferSeriesOptions.js'

const readImageDICOMFileSeries = async (
  fileList: FileList | File[],
  options?: ReadImageDICOMFileSeriesOptions | boolean
): Promise<ReadImageFileSeriesResult> => {
  const fetchFileContents = Array.from(fileList, async function (file) {
    return await readAsArrayBuffer(file)
  })
  const fileContents: ArrayBuffer[] = await Promise.all(fetchFileContents)

  let optionsToPass: ReadImageDICOMArrayBufferSeriesOptions = {}
  if (typeof options === 'object') {
    optionsToPass = { ...options }
  }
  if (typeof options === 'boolean') {
    // Backwards compatibility
    optionsToPass.singleSortedSeries = options
  }

  const fileNames = Array.from(fileList, (file) => file.name)
  optionsToPass.fileNames = fileNames
  return await readImageDICOMArrayBufferSeries(fileContents, optionsToPass)
}

export default readImageDICOMFileSeries
