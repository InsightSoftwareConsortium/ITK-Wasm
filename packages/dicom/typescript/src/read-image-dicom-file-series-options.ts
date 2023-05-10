import { TextFile } from 'itk-wasm'

interface ReadImageDicomFileSeriesOptions {
  /** File names in the series */
  inputImages: string[] | TextFile[]

  /** The input files are a single sorted series */
  singleSortedSeries?: boolean

}

export default ReadImageDicomFileSeriesOptions
