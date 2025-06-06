# Interface Types

ITK-Wasm execution pipelines support the following [interface types](https://github.com/InsightSoftwareConsortium/ITK-Wasm/tree/main/packages/core/typescript/itk-wasm/src/interface-types/interface-types.ts):

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
TransformList.md
Transform.md
TransformType.md
TransformParameterizations.md
JsonCompatible.md
```

These interfaces types are supported in the [Emscripten interface](/api/browser_pipelines), [WASI](https://wasi.dev/) embedding interfaces, and native or virtual [filesystem IO](../../introduction/file_formats/). They are intended to be forward-compatible with the [WebAssembly Component Model](https://github.com/WebAssembly/component-model). More information on the types and their relationships can be found in the [Interface Types Model](../../model/index.md).
