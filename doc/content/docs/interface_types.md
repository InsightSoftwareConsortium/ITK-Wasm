title: Interface Types
---

itk-wasm execution pipelines support the following [interface types](https://github.com/InsightSoftwareConsortum/itk-wasm/tree/master/src/core/InterfaceTypes.ts):

- [TextFile](../api/TextFile.html)
- [BinaryFile](../api/BinaryFile.html)
- [TextStream](../api/TextStream.html)
- [BinaryStream](../api/BinaryStream.html)
- [Image](../api/Image.html)
- [Mesh](../api/Mesh.html)
- [PolyData](../api/PolyData.html)

These interfaces types are supported in the [Emscripten interface](../api/runPipelineBrowser.html), WASI embedding interfaces, and native or virtual [filesystem IO](./file_formats.html).

---

The following [`itk::wasm::Pipeline`](https://github.com/InsightSoftwareConsortium/itk-wasm/tree/master/include/itkPipeline.h) components can be included in a C++ to ingest and produce these interface types.

<dl>
  <dt><b>InputTextStream</b><dt><dd>A string. To write this data type in C++, write a plain text file with, e.g.  <a href="http://www.cplusplus.com/reference/fstream/ofstream">std::ofstream</a>.</dd>
</dl>