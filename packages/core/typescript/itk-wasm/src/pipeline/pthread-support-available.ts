function pthreadSupportAvailable(): boolean {
  const haveSharedArrayBuffer =
    typeof globalThis.SharedArrayBuffer === 'function'

  // Emscripten ENVIRONMENT_IS_NODE
  const isNode =
    typeof process === 'object' &&
    typeof process.versions === 'object' &&
    typeof process.versions.node === 'string' &&
    // @ts-ignore: ts(2339)
    process.type !== 'renderer'

  const isCrossOriginIsolated =
    typeof crossOriginIsolated !== 'undefined'
      ? crossOriginIsolated
      : globalThis.crossOriginIsolated || false

  if (isNode) {
    return haveSharedArrayBuffer
  }

  return haveSharedArrayBuffer && isCrossOriginIsolated
}

export default pthreadSupportAvailable
