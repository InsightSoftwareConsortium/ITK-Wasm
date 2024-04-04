import {
    Image,
    Mesh,
    PolyData,
} from 'itk-wasm'

import compressStringify from './compress-stringify.js'
import parseStringDecompress from './parse-string-decompress.js'
import { dir } from 'console'

export function imageToJson(image: Image): string {
    const level = 5

    const directionBytes = new Uint8Array(image.direction.buffer)
    image.direction = await compressStringify(directionBytes, { compressionLevel: level, stringify: True })

}