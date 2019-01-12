title: Node.js Processing Pipelines
---

These processing pipeline execution functions can be used from within a [Node.js](https://nodejs.org/) application or library on a workstation or server.

Similar to the [web browser API](./browser_pipelines.html), most of these functions return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

---

## runPipelineNode(pipelinePath, args, outputs, inputs) -> result

Read an itk.js Emscripten module with Node.js.

*pipelinePath*: Path the the built module, without `.js` or `Wasm.js` extensions.

*args*:         A JavaScript Array of strings to pass to the execution of the `main` function, i.e. arguments that would be passed on the command line to a native executable.

*outputs*:      A JavaScript Array containing JavaScript objects with two properties: `path` and `type`.
                `path` is the file path on the virtual filesystem to read after execution has completed.
                `type` is one of the `itk/IOTypes`, i.e. `IOTypes.Text`, `IOTypes.Binary`, `ITKTypes.Image`, or `ITKTypes.Mesh` to read as an UTF8-encoded string, binary `Uint8Array`, [`itk/Image`](./Image.html), or [`itk/Mesh`](./Mesh.html), respectively.

*inputs*:       A JavaScript Array containing JavaScript objects with three properties: `path`, `type`, and `data`.
                `path` and `type` are the same as *outputs*, while `data` contains the corresponding data to write to the virtual filesystem before executing the module.

*result*:       A JavaScript object with three properties: `stdout`, `stderr`, and `outputs`.
                `stdout` and `stderr` are strings. `outputs` is an array with `{ path, type, data }` contents corresponding to the values specified in the function call.

## runPipelineNodeSync(pipelinePath, args, outputs, inputs) -> result

Similar to `runPipelineNode`, but returns the result directly instead of a promise.
