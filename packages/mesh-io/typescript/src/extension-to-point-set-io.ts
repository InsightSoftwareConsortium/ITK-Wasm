const extensionToPointSetIo = new Map([
  ["vtk", "vtk"],
  ["obj", "obj"],
  ["off", "off"],
  ["iwm", "wasm"],
  ["iwm.cbor", "wasm"],
  ["iwm.cbor.zst", "wasm-zstd"],
]);

export default extensionToPointSetIo;
