title: Node.js Processing Pipelines
---

These processing pipeline execution functions can be used from within a [Node.js](https://nodejs.org/) application or library on a workstation or server.

Similar to the [web browser API](./browser_pipelines.html), most of these functions return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

---

## runPipelineNode(pipelinePath: string, args: string[], outputs: [PipelineOutput](https://github.com/InsightSoftwareConsortium/itk-wasm/blob/master/src/pipeline/PipelineInput.ts)[], inputs: [PipelineInput](https://github.com/InsightSoftwareConsortium/itk-wasm/blob/master/src/pipeline/PipelineOutput.ts)[] | null): Promise<[RunPipelineResult](https://github.com/InsightSoftwareConsortium/itk-wasm/blob/master/src/pipeline/RunPipelineResult.ts)>

Run an itk-wasm Emscripten module with Node.js.

*pipelinePath*: Path to the pre-built pipeline module, without `.js` or `.wasm` extensions.

*args*:         A JavaScript Array of strings to pass to the execution of the `main` function, i.e. arguments that would be passed on the command line to a native executable.

*outputs*:      A JavaScript Array containing JavaScript objects with two properties: `path` and `type`.

`path` is the file path on the virtual filesystem to read after execution has completed.

`type` is one of the [IOTypes](https://github.com/InsightSoftwareConsortium/itk-wasm/blob/master/src/core/IOTypes.ts):
<dl>
  <dt><b>IOTypes.Text</b><dt><dd>A string. To write this data type in C++, write a plain text file with, e.g.  <a href="https://www.cplusplus.com/reference/fstream/ofstream">std::ofstream</a>.</dd>
  <dt><b>IOTypes.Binary</b><dt><dd>A binary <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array">Uint8Array</a>. To write this data type in C++, read the binary file with, e.g.  <a href="https://www.cplusplus.com/reference/fstream/ofstream/">std::ofstream</a> with the `std::ofstream::binary` flag to <a href="https://www.cplusplus.com/reference/fstream/ofstream/open/">std::ofstream::open</a>.</dd>
  <dt><b>IOTypes.Image</b></dt><dd>An <a href="./Image.html">Image</a>. To write this data type in C++, use the <href a="https://itk.org/Doxygen/html/classitk_1_1ImageFileWriter.html">itk::ImageFileWriter</a>, add `WebAssemblyInterface` module to the ITK `find_package` `COMPONENTS` in your *CMakeLists.txt*, and use `.iwi` for the image file name extension.</dd>
  <dt><b>IOTypes.Mesh</b></dt><dd>An <a href="Mesh.html">Mesh</a>. To write this data type in C++, use the <a href="https://itk.org/Doxygen/html/classitk_1_1MeshFileWriter.html">itk::MeshFileWriter</a>, add `WebAssemblyInterface` module to the ITK `find_package` `COMPONENTS` in your *CMakeLists.txt*, and use `.json` for the image file name extension.</dd>
</dl>

*inputs*:       A JavaScript Array containing JavaScript objects with three properties: `path`, `type`, and `data`.

`data` contains the corresponding data to write to the virtual filesystem before executing the module.

`path` is the file path on the virtual filesystem to read after execution has completed.

`type` is one of the `IOTypes`:
<dl>
  <dt><b>IOTypes.Text</b></dt><dd>A string. To read this data type in C++, read the plain text file with, e.g.  <a href="https://www.cplusplus.com/reference/fstream/ifstream/">std::ifstream</a>. </dd>
  <dt><b>IOTypes.Binary</b></dt><dd>A binary <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array">Uint8Array</a>. To read this data type in C++, read the binary file with, e.g. <a href="https://www.cplusplus.com/reference/fstream/ifstream/">std::ifstream</a> with the `std::ifstream::binary` flag to <a href="https://www.cplusplus.com/reference/fstream/ofstream/open/">std::ifstream::open</a>.</dd>
  <dt><b>IOTypes.Image</b></dt><dd>An <a href="./Image.html">Image</a>. To read this data type in C++, use the <a href="https://itk.org/Doxygen/html/classitk_1_1ImageFileReader.html">itk::ImageFileReader</a>, add `WebAssemblyInterface` module to the ITK `find_package` `COMPONENTS` in your *CMakeLists.txt*, and use `.iwi` for the image file name extension.</dd>
  <dt><b>IOTypes.Mesh</b><dt><dd>An <a href="./Mesh.html">Mesh</a>. To read this data type in C++, use the <a href="https://itk.org/Doxygen/html/classitk_1_1MeshFileReader.html">itk::MeshFileReader</a>, add `WebAssemblyInterface` module to the ITK `find_package` `COMPONENTS` in your *CMakeLists.txt*, and use `.json` for the image file name extension.</dd>
</dl>

**result**:       A JavaScript object with three properties: `stdout`, `stderr`, and `outputs`.
                `stdout` and `stderr` are strings. `outputs` is an array with `{ path, type, data }` content that corresponds to the values specified in the function call.
