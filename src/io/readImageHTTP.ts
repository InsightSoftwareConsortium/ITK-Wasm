import axios from 'axios'

import bufferToTypedArray from '../core/bufferToTypedArray.js'
import Image from '../core/Image.js'

async function readImageHTTP(url: string): Promise<Image> {
  const imageResponse = await axios.get(url, { responseType: 'json' })
  const image = imageResponse.data
  const pixelBufferResponse = await axios.get(url + '.data', { responseType: 'arraybuffer' })
  image.data = bufferToTypedArray(image.imageType.componentType, pixelBufferResponse.data)
  return image
}

export default readImageHTTP
