# Interface Types

itk-wasm execution pipelines support the following [interface types](https://github.com/InsightSoftwareConsortium/itk-wasm/tree/main/src/core/InterfaceTypes.ts):

- [TextFile](/api/TextFile)
- [BinaryFile](/api/BinaryFile)
- [TextStream](/api/TextStream)
- [BinaryStream](/api/BinaryStream)
- [Image](/api/Image)
- [Mesh](/api/Mesh)
- [PolyData](/api/PolyData)
- [JsonObject](/api/JsonObject)

These interfaces types are supported in the [Emscripten interface](/api/browser_pipelines), [WASI](https://wasi.dev/) embedding interfaces, and native or virtual [filesystem IO](/docs/file_formats). They are intended to be forward-compatible with the [WebAssembly Component Model](https://github.com/WebAssembly/component-model).

---

The following [CLI11](https://github.com/CLIUtils/CLI11) [`itk::wasm::Pipeline`](https://github.com/InsightSoftwareConsortium/itk-wasm/tree/main/include/itkPipeline.h) components can be included in a C++ to ingest and produce these interface types. For `Input` types, use `Get()` to get the corresponding C++ object value after `ITK_WASM_PARSE_ARGS` is called. For `Output` types, use `Set(value)` to output the value before `main` exits. For example,

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
  <dt><b><code>itk::wasm::InputTextStream</code></b><dt><dd>A string. To reader this data type in C++, using the resulting  <a href="https://www.cplusplus.com/reference/istream/istream/">std::istream</a>.</dd>
</dl>

*todo: document remaining CLI11 input and output classes.*

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
- `INPUT_POLYDATA`
- `OUTPUT_POLYDATA`