const extensionToMeshIo = new Map([
  ['vtk', 'vtk'],
  ['byu', 'byu'],
  ['fsa', 'free-surfer-ascii'],
  ['fsb', 'free-surfer-binary'],
  ['obj', 'obj'],
  ['off', 'off'],
  ['stl', 'stl'],
  ['swc', 'swc'],
  ['iwm', 'wasm'],
  ['iwm.cbor', 'wasm'],
  ['iwm.cbor.zst', 'wasm-zstd']
])

export default extensionToMeshIo
