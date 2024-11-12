const extensionToTransformIo = new Map([
  ["h5", "hdf5"],
  ["hdf5", "hdf5"],
  ["txt", "txt"],
  ["mat", "mat"],
  ["xfm", "mnc"],
  ["iwt", "wasm"],
  ["iwt.cbor", "wasm"],
  ["iwt.cbor.zst", "wasm-zstd"],
]);

export default extensionToTransformIo;
