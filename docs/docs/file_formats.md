# File Formats

While IO modules are available to work with a number of [scientific image](/docs/image_formats) and [mesh](/docs/mesh_formats) file formats, itk-wasm execution pipeline WebAssembly modules only support the itk-wasm file formats by default. This ensures that size of the WebAssembly pipeline binary is minimal.

## itk-wasm file formats

itk-wasm provides its own file formats. itk-wasm file formats are a performant, one-to-one mapping to the spatial [interface types](/api/interface_types) in a simple JSON + binary array buffer format.

The formats can be output in a directory or bundled in a single `.cbor` file.

The itk-wasm file formats are available in the itk-wasm IO functions, but also in C++ via the *WebAssemblyInterface* ITK module and through native binary Python bindings via the *itk-webassemblyinterface* Python package.

<dl>
  <dt><b>ITK Wasm Image (.iwi, .iwi.cbor)</b><dt><dd>Serialization of an <a href="/api/Image"><code>Image</code></a>.</dd>
  <dt><b>ITK Wasm Mesh (.iwm, .iwm.cbor)</b><dt><dd>Serialization of a <a href="/api/Mesh"><code>Mesh</code></a>, or <a href="/api/PolyData"><code>PolyData</code></a>.</dd>
</dl>
