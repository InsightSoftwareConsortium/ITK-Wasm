const haveSharedArrayBuffer = typeof globalThis.SharedArrayBuffer !== 'undefined' // eslint-disable-line

function getTransferables (data?: any[] | null, noCopy?: boolean): ArrayBuffer[] {
  if (data === undefined || data === null) {
    return []
  }
  const transferables: ArrayBuffer[] = []
  for (let i = 0; i < data.length; i++) {
    const transferable = getTransferable(data[i], noCopy)
    if (transferable !== null) {
      transferables.push(transferable)
    }
  }
  return transferables
}

function getTransferable (data?: any, noCopy?: boolean): ArrayBuffer | null {
  if (data === undefined || data === null) {
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
  // eslint-disable-next-line
  if (noCopy) {
    return result
  }
  return (result as ArrayBuffer).slice(0)
}

export default getTransferables
