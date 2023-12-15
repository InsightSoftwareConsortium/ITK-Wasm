import CastImageOptions from '../cast-image-options.js'

interface ReadImageFileSeriesOptions extends CastImageOptions {
  zSpacing?: number
  zOrigin?: number
  sortedSeries?: boolean
}

export default ReadImageFileSeriesOptions
