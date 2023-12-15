import CastImageOptions from '../cast-image-options.js'

/**
 * @deprecated Use readImageDicomFileSeries from @itk-wasm/dicom instead
 */
interface ReadImageDICOMArrayBufferSeriesOptions extends CastImageOptions {
  singleSortedSeries?: boolean
  fileNames?: string[]
}

export default ReadImageDICOMArrayBufferSeriesOptions
