const haveSharedArrayBuffer = typeof globalThis.SharedArrayBuffer !== 'undefined' // eslint-disable-line

function getTransferables (data?: any[] | null): ArrayBuffer[] {
  if (!data?.length) {
    return []
  }
  const transferables: ArrayBuffer[] = [];
  for (let i=0; i<data.length; i++) {
    const transferable = getTransferable(data[i])
    if (transferable) {
      transferables.push(transferable)
    }
  }
  return transferables
}

function getTransferable (data?: any): ArrayBuffer | null {
  if (!data) {
    return null
  }
  let result: null | ArrayBuffer = null
  if (data.buffer !== undefined) {
    result = data.buffer as ArrayBuffer
  } else if (data.byteLength !== undefined) {
    result = data as ArrayBuffer
  }
  if (haveSharedArrayBuffer && result instanceof SharedArrayBuffer) { // eslint-disable-line
    return null
  }
  return result
}

export default getTransferables
