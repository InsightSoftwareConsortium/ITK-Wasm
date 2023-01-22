# Node.js Processing Pipelines

These processing pipeline execution functions can be used from within a [Node.js](https://nodejs.org/) application or library on a workstation or server.

Similar to the [web browser API](./browser_pipelines.html), most of these functions return a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

---

## `runPipelineNode`

```ts
runPipelineNode(pipelinePath: string,
  args: string[],
  outputs: PipelineOutput[],
  inputs: PipelineInput[] | null):
  Promise<{
    returnValue: number,
    stdout: string,
    stderr: string,
    outputs: PipelineOutput[],
    webWorker?: Worker,
  }>
```


*Run an itk-wasm Emscripten module with Node.js.*

### `pipelinePath`

Path to the pre-built pipeline module, without `.js` or `.wasm` extensions.

### `args`

A JavaScript Array of strings to pass to the execution of the `main` function, i.e. arguments that would be passed on the command line to a native executable.

### `outputs`

A JavaScript Array of desired [`PipelineOutput`](https://github.com/InsightSoftwareConsortium/itk-wasm/blob/main/src/pipeline/PipelineOutput.ts)'s that provide an interface `type` and an optional `path` when required by an interface type.

- `type` is one of the [`InterfaceTypes`](/api/interface_types).
- `path` is the optional file path on the filesystem to write after execution has completed.

### `inputs`

A JavaScript Array of [`PipelineInput`](https://github.com/InsightSoftwareConsortium/itk-wasm/blob/main/src/pipeline/PipelineInput.ts)'s or `null` that provide an interface `type`, an optional `path` when required by an interface type, and the input `data`.


- `type` is one of the [`InterfaceTypes`](/api/interface_types).
- `data` contains the corresponding data for the interface type.
- `path` is the optional file path on the filesystem to read after execution has completed.

### Result

Promise resolving a JavaScript object with the properties:

- `returnValue`: Integer return code from the pipeline.
- `stdout`: Text sent to stdout
- `stderr`: Text sent to stderr
-  `outputs`: An Array of [`PipelineOutput`](https://github.com/InsightSoftwareConsortium/itk-wasm/blob/main/src/pipeline/PipelineOutput.ts)'s with the `data` property populated.