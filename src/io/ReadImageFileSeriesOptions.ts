import CastImageOptions from '../core/CastImageOptions.js'

interface ReadImageFileSeriesOptions extends CastImageOptions {
  zSpacing?: number
  zOrigin?: number
  sortedSeries?: boolean
}

export default ReadImageFileSeriesOptions
