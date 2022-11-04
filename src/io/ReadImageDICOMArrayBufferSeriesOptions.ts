import CastImageOptions from '../core/CastImageOptions.js'

interface ReadImageDICOMArrayBufferSeriesOptions extends CastImageOptions {
  singleSortedSeries?: boolean
  fileNames?: string[]
}

export default ReadImageDICOMArrayBufferSeriesOptions
