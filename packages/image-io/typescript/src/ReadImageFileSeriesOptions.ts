import { CastImageOptions } from 'itk-wasm'

interface ReadImageFileSeriesOptions extends CastImageOptions {
  zSpacing?: number
  zOrigin?: number
  sortedSeries?: boolean
}

export default ReadImageFileSeriesOptions
