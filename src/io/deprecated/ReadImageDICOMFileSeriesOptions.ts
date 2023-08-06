import CastImageOptions from '../../core/CastImageOptions.js'

/**
 * @deprecated Use readImageDicomFileSeries from @itk-wasm/dicom instead
 */
interface ReadImageDICOMFileSeriesOptions extends CastImageOptions {
  singleSortedSeries?: boolean
}

export default ReadImageDICOMFileSeriesOptions
