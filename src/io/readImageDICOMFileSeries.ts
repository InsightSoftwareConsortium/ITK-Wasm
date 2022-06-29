import { readAsArrayBuffer } from 'promise-file-reader'

import ReadImageFileSeriesResult from './ReadImageFileSeriesResult.js'
import readImageDICOMArrayBufferSeries from './readImageDICOMArrayBufferSeries.js'

const readImageDICOMFileSeries = async (
  fileList: FileList | File[],
  singleSortedSeries = false
): Promise<ReadImageFileSeriesResult> => {
  const fetchFileContents = Array.from(fileList, async function (file) {
    return await readAsArrayBuffer(file)
  })
  const fileContents: ArrayBuffer[] = await Promise.all(fetchFileContents)

  const fileNames = Array.from(fileList, (file) => file.name)
  return await readImageDICOMArrayBufferSeries(fileContents, singleSortedSeries, fileNames)
}

export default readImageDICOMFileSeries
