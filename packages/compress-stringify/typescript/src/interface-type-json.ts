import {
    Image,
//    Mesh,
//    PolyData,
} from 'itk-wasm'

import compressStringify from './compress-stringify.js'
// import parseStringDecompress from './parse-string-decompress.js'

export async function imageToJson(image: Image): Promise<string> {
  const level = 5

  const encoded = new Image(image.imageType)
  encoded.origin = image.origin
  encoded.spacing = image.spacing
  encoded.size = image.size
  encoded.metadata = image.metadata

  const directionBytes = new Uint8Array(image.direction.buffer)
  // @ts-ignore
  image.direction = await compressStringify(directionBytes, { compressionLevel: level, stringify: true })

  if (image.data === null) {
    encoded.data = null
  } else {
    const dataBytes = new Uint8Array(image.data.buffer)
    // @ts-ignore
    encoded.data = await compressStringify(dataBytes, {
      compressionLevel: level,
      stringify: true,
    })
  }

  const encodedJson = JSON.stringify(encoded)
  return encodedJson
}