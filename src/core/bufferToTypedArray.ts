import IntTypes, * as Ints from "./IntTypes.js"
import FloatTypes, * as Floats from "./FloatTypes.js"
import type TypedArray from "./TypedArray.js"

function bufferToTypedArray(jsType: IntTypes | FloatTypes | 'null' | null, buffer: ArrayBuffer): null | TypedArray {
  let typedArray: null | TypedArray = null
  switch (jsType) {
    case Ints.UInt8: {
      typedArray = new Uint8Array(buffer)
      break
    }
    case Ints.Int8: {
      typedArray = new Int8Array(buffer)
      break
    }
    case Ints.UInt16: {
      typedArray = new Uint16Array(buffer)
      break
    }
    case Ints.Int16: {
      typedArray = new Int16Array(buffer)
      break
    }
    case Ints.UInt32: {
      typedArray = new Uint32Array(buffer)
      break
    }
    case Ints.Int32: {
      typedArray = new Int32Array(buffer)
      break
    }
    case Ints.UInt64: {
      throw new BigUint64Array(buffer)
    }
    case Ints.Int64: {
      throw new BigInt64Array(buffer)
    }
    case Floats.Float32: {
      typedArray = new Float32Array(buffer)
      break
    }
    case Floats.Float64: {
      typedArray = new Float64Array(buffer)
      break
    }
    case 'null': {
      typedArray = null
      break
    }
    case null: {
      typedArray = null
      break
    }
    default:
      throw new Error('Type is not supported as a TypedArray')
  }

  return typedArray
}

export default bufferToTypedArray
