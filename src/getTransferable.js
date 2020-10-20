const haveSharedArrayBuffer = typeof self.SharedArrayBuffer === 'function' // eslint-disable-line

function getTransferable (data) {
  let result = null
  if (data.buffer) {
    result = data.buffer
  } else if (data.byteLength) {
    result = data
  }
  if (!!result && haveSharedArrayBuffer && result instanceof SharedArrayBuffer) { // eslint-disable-line
    result = null
  }
  return result
}

export default getTransferable
