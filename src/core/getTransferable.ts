import type TypedArray from "./TypedArray.js"

const haveSharedArrayBuffer = typeof self.SharedArrayBuffer === 'function' // eslint-disable-line

function getTransferable(data: any):  null | ArrayBuffer {
  let result: null | ArrayBuffer = null
  if ("buffer" in data) {
    result: ArrayBuffer = data.buffer
  } else if ("byteLength" in data) {
    result = data
  }
  if (!!result && haveSharedArrayBuffer && result instanceof SharedArrayBuffer) { // eslint-disable-line
    result = null
  }
  return result
}

export default getTransferable
