// Generated file. To retain edits, remove this comment.

import { JsonCompatible, Image } from 'itk-wasm'

interface Hdf5ReadImageNodeResult {
  /** Whether the input could be read. If false, the output image is not valid. */
  couldRead: JsonCompatible

  /** Output image */
  image: Image

}

export default Hdf5ReadImageNodeResult
