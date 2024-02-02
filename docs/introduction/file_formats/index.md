# File Formats

Support for data serialized in file formats are a critical bridge that facilitate comprehensive analysis with a suite of diverse software tools.

ITK-Wasm provides IO modules to work with a number of open standard [scientific image](./images) and [mesh](./meshes) file formats, These IO modules can be used to load data into language-native [interfaces types](/typescript/interface_types/index) in with bindings such as TypeScript and Python.

## ITK-Wasm file formats

ITK-Wasm provides its own file formats. ITK-Wasm file formats are a performant, one-to-one mapping to the spatial [interface types](/typescript/interface_types/index) in a simple JSON + binary array buffer format.

Execution pipeline WebAssembly modules only support ITK-Wasm formats by default -- this ensures that size of the WebAssembly pipeline binary is minimal. When using ITK-Wasm pipelines on with the command line interface, wasm modules from the image-io and mesh-io packages can transform data in other formats into the format supported by all ITK-Wasm modules.

ITK-Wasm formats can be output in a directory or bundled in a single `.cbor` file. The [Concise Binary Object Representation (CBOR)](https://cbor.io/) format supports JSON + binary array data in the data schema, is extremely small and lightweight in implementations, has support across programming languages, is highly performant, and provides a [link to Web3 storage mechanisms](https://ipld.io/docs/codecs/known/dag-cbor/).

ITK-Wasm file formats are available in ITK-Wasm IO functions but also in C++ via the *WebAssemblyInterface* ITK module. This module can be enabled in an ITK build by setting the `-DModule_WebAssemblyInterface:BOOL=ON` flag in CMake. And, loading and conversion is also available native-binary Python bindings via the [*itk-webassemblyinterface* Python package](https://pypi.org/project/itk-webassemblyinterface/).

<dl>
  <dt><b>ITK-Wasm Image (.iwi, .iwi.cbor, .iwi.cbor.zst)</b><dt><dd>Serialization of an <a href="../../typescript/interface_types/Image.html"><code>Image</code></a>.</dd>
  <dt><b>ITK-Wasm Mesh (.iwm, .iwm.cbor, .iwi.cbor.zst)</b><dt><dd>Serialization of a <a href="../../typescript/interface_types/Mesh.html"><code>Mesh</code></a>, or <a href="../../typescript/interface_types/PolyData.html"><code>PolyData</code></a>.</dd>
</dl>


```{toctree}
:hidden:
:maxdepth: 3

images.md
meshes.md
dicom.md
```
