const extensionToPointSetIo = new Map([
  ["vtk", "vtk"],
  ["obj", "obj"],
  ["off", "off"],
  ["mz3", "mz3"],
  ["iwm", "wasm"],
  ["iwm.cbor", "wasm"],
  ["iwm.cbor.zst", "wasm-zstd"],
]);

export default extensionToPointSetIo;
