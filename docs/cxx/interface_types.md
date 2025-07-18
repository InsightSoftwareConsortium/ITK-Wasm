# Interface Types

ITK-Wasm execution pipelines support the following [interface types](https://github.com/InsightSoftwareConsortium/ITK-Wasm/tree/main/src/core/InterfaceTypes.ts):

- [TextFile](../typescript/interface_types/TextFile)
- [BinaryFile](../typescript/interface_types/BinaryFile)
- [TextStream](../typescript/interface_types/TextStream)
- [BinaryStream](../typescript/interface_types/BinaryStream)
- [Image](../typescript/interface_types/Image)
- [Mesh](../typescript/interface_types/Mesh)
- [PolyData](../typescript/interface_types/PolyData)
- [Transform](../typescript/interface_types/Transform)
- [JsonCompatible](../typescript/interface_types/JsonCompatible)

These interfaces types are supported in the [Emscripten interface](../typescript/browser_pipelines), [WASI](https://wasi.dev/) embedding interfaces, and native or virtual [filesystem IO](../introduction/file_formats/index). They are intended to be forward-compatible with the [WebAssembly Component Model](https://github.com/WebAssembly/component-model).

---

The following [CLI11](https://github.com/CLIUtils/CLI11) [`itk::wasm::Pipeline`](https://github.com/InsightSoftwareConsortium/ITK-Wasm/tree/main/include/itkPipeline.h) components can be included in a C++ to ingest and produce these interface types. For `Input` types, use `Get()` to get the corresponding C++ object value after `ITK_WASM_PARSE_ARGS` is called. For `Output` types, use `Set(value)` to output the value before `main` exits. For example,

```cpp
#include "itkPipeline.h"
#include "itkInputTextStream.h"
#include "itkOutputTextStream.h"

int main(argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("test-pipeline", "A test ITK Wasm Pipeline", argc, argv);

  itk::wasm::InputTextStream inputTextStream;
  pipeline.add_option("InputText", inputTextStream,
    "The input text")->required()->type_name("INPUT_TEXT_STREAM");

  itk::wasm::OutputTextStream outputTextStream;
  pipeline.add_option("OutputText", outputTextStream,
    "The output text")->required()->type_name("OUTPUT_TEXT_STREAM");


  ITK_WASM_PARSE(pipeline);


  const std::string inputTextStreamContent{ std::istreambuf_iterator<char>(inputTextStream.Get()),
                                            std::istreambuf_iterator<char>() };

  outputTextStream.Get() << inputTextStreamContent;
}
```

<dl>
  <dt><b><code>itk::wasm::InputTextStream</code></b><dt><dd>A text stream input. To read this data type in C++, use the resulting <a href="https://www.cplusplus.com/reference/istream/istream/">std::istream</a> from <code>Get()</code>.</dd>
  
  <dt><b><code>itk::wasm::OutputTextStream</code></b><dt><dd>A text stream output. To write to this data type in C++, use the resulting <a href="https://www.cplusplus.com/reference/ostream/ostream/">std::ostream</a> from <code>Get()</code>.</dd>
  
  <dt><b><code>itk::wasm::InputBinaryStream</code></b><dt><dd>A binary stream input. To read this data type in C++, use the resulting <a href="https://www.cplusplus.com/reference/istream/istream/">std::istream</a> from <code>Get()</code>.</dd>
  
  <dt><b><code>itk::wasm::OutputBinaryStream</code></b><dt><dd>A binary stream output. To write to this data type in C++, use the resulting <a href="https://www.cplusplus.com/reference/ostream/ostream/">std::ostream</a> from <code>Get()</code>.</dd>
  
  <dt><b><code>itk::wasm::InputImage&lt;TImage&gt;</code></b><dt><dd>An input image of type <code>TImage</code>. To access the image in C++, use <code>Get()</code> to get a pointer to the <code>TImage</code>.</dd>
  
  <dt><b><code>itk::wasm::OutputImage&lt;TImage&gt;</code></b><dt><dd>An output image of type <code>TImage</code>. To set the output image in C++, use <code>Set(image)</code> with a pointer to the <code>TImage</code>.</dd>
  
  <dt><b><code>itk::wasm::InputMesh&lt;TMesh&gt;</code></b><dt><dd>An input mesh of type <code>TMesh</code>. To access the mesh in C++, use <code>Get()</code> to get a pointer to the <code>TMesh</code>.</dd>
  
  <dt><b><code>itk::wasm::OutputMesh&lt;TMesh&gt;</code></b><dt><dd>An output mesh of type <code>TMesh</code>. To set the output mesh in C++, use <code>Set(mesh)</code> with a pointer to the <code>TMesh</code>.</dd>
  
  <dt><b><code>itk::wasm::InputPointSet&lt;TPointSet&gt;</code></b><dt><dd>An input point set of type <code>TPointSet</code>. To access the point set in C++, use <code>Get()</code> to get a pointer to the <code>TPointSet</code>.</dd>
  
  <dt><b><code>itk::wasm::OutputPointSet&lt;TPointSet&gt;</code></b><dt><dd>An output point set of type <code>TPointSet</code>. To set the output point set in C++, use <code>Set(pointSet)</code> with a pointer to the <code>TPointSet</code>.</dd>
  
  <dt><b><code>itk::wasm::InputPolyData&lt;TPolyData&gt;</code></b><dt><dd>An input polydata of type <code>TPolyData</code>. To access the polydata in C++, use <code>Get()</code> to get a pointer to the <code>TPolyData</code>.</dd>
  
  <dt><b><code>itk::wasm::OutputPolyData&lt;TPolyData&gt;</code></b><dt><dd>An output polydata of type <code>TPolyData</code>. To set the output polydata in C++, use <code>Set(polyData)</code> with a pointer to the <code>TPolyData</code>.</dd>
  
  <dt><b><code>itk::wasm::InputTransform&lt;TTransform&gt;</code></b><dt><dd>An input transform of type <code>TTransform</code>. To access the transform in C++, use <code>Get()</code> to get a pointer to the <code>TTransform</code>.</dd>
  
  <dt><b><code>itk::wasm::OutputTransform&lt;TTransform&gt;</code></b><dt><dd>An output transform of type <code>TTransform</code>. To set the output transform in C++, use <code>Set(transform)</code> with a pointer to the <code>TTransform</code>.</dd>
  
  <dt><b><code>std::string</code> (for files)</b><dt><dd>File paths for input and output files. Use the type names <code>INPUT_TEXT_FILE</code>, <code>OUTPUT_TEXT_FILE</code>, <code>INPUT_BINARY_FILE</code>, or <code>OUTPUT_BINARY_FILE</code>. The string contains the file path that can be used with standard file I/O operations.</dd>
  
  <dt><b><code>itk::wasm::InputTextStream</code> (for JSON)</b><dt><dd>JSON input data. Use the type name <code>INPUT_JSON</code>. To read the JSON data in C++, use the resulting <a href="https://www.cplusplus.com/reference/istream/istream/">std::istream</a> from <code>Get()</code> and parse the JSON content.</dd>
  
  <dt><b><code>itk::wasm::OutputTextStream</code> (for JSON)</b><dt><dd>JSON output data. Use the type name <code>OUTPUT_JSON</code>. To write JSON data in C++, use the resulting <a href="https://www.cplusplus.com/reference/ostream/ostream/">std::ostream</a> from <code>Get()</code> and write the JSON content.</dd>
</dl>

For binding generation, set the `type_name` an the options accordingly. The type names are:

- `INPUT_TEXT_FILE`
- `OUTPUT_TEXT_FILE`
- `INPUT_BINARY_FILE`
- `OUTPUT_BINARY_FILE`
- `INPUT_TEXT_STREAM`
- `OUTPUT_TEXT_STREAM`
- `INPUT_BINARY_STREAM`
- `OUTPUT_BINARY_STREAM`
- `INPUT_IMAGE`
- `OUTPUT_IMAGE`
- `INPUT_MESH`
- `OUTPUT_MESH`
- `INPUT_POINTSET`
- `OUTPUT_POINTSET`
- `INPUT_POLYDATA`
- `OUTPUT_POLYDATA`
- `INPUT_TRANSFORM`
- `OUTPUT_TRANSFORM`
- `INPUT_JSON`
- `OUTPUT_JSON`