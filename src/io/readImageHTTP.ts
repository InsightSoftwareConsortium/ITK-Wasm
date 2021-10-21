import axios from 'axios'

import bufferToTypedArray from '../core/bufferToTypedArray.js'
import Image from '../core/Image.js'
import type TypedArray from '../core/TypedArray.js'

async function readImageHTTP (url: string): Promise<Image> {
  const imageResponse = await axios.get(url, { responseType: 'json' })
  const image = imageResponse.data as Image
  const pixelBufferResponse = await axios.get(url + '.data', { responseType: 'arraybuffer' })
  image.data = bufferToTypedArray(image.imageType.componentType, pixelBufferResponse.data as ArrayBuffer) as TypedArray
  return image
}

export default readImageHTTP
