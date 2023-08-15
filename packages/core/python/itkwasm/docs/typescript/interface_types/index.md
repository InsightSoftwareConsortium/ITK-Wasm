# Interface Types

itk-wasm execution pipelines support the following [interface types](https://github.com/InsightSoftwareConsortium/itk-wasm/tree/main/src/core/InterfaceTypes.ts):

```{toctree}
:maxdepth: 3
:caption: Interface Types

TextFile.md
BinaryFile.md
TextStream.md
BinaryStream.md
Image.md
ImageType.md
Mesh.md
MeshType.md
PolyData.md
JsonObject.md
```

These interfaces types are supported in the [Emscripten interface](/api/browser_pipelines), [WASI](https://wasi.dev/) embedding interfaces, and native or virtual [filesystem IO](/introduction/file_formats/index.html). They are intended to be forward-compatible with the [WebAssembly Component Model](https://github.com/WebAssembly/component-model).