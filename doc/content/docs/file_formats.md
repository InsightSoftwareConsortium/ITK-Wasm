title: ITK WASM File Formats
---

While IO modules are available to work with a number of [scientific image](./image_formats.html) and [mesh](./mesh_formats.html) file formats, itk-wasm execution pipeline WebAssembly modules only support the ITK WASM File Formats by default. This ensures that size of the WebAssembly pipeline binary is minimal.

The itk-wasm file formats provide performant mapping to the [interface types](./interface_types.html) in a simple JSON + binary array buffer format. The formats can be output in a directory or bundled in a single `.zip` file.

<dl>
  <dt><b>ITK WASM Image (.iwi,.iwi.zip)</b><dt><dd>Serialization of an [Image](../Image.html).</dd>
  <dt><b>ITK WASM Mesh (.iwm,.iwm.zip)</b><dt><dd>Serialization of a [Mesh](../Mesh.html), or [PolyData](../PolyData.html).</dd>
</dl>