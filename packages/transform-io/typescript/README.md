# @itk-wasm/transform-io

[![npm version](https://badge.fury.io/js/@itk-wasm%2Ftransform-io.svg)](https://www.npmjs.com/package/@itk-wasm/transform-io)

> Input and output for scientific and medical coordinate transform file formats.

## Installation

```sh
npm install @itk-wasm/transform-io
```

## Usage

### Browser interface

Import:

```js
import {
  hdf5ReadTransform,
  hdf5WriteTransform,
  matReadTransform,
  matWriteTransform,
  mncReadTransform,
  mncWriteTransform,
  txtReadTransform,
  txtWriteTransform,
  wasmReadTransform,
  wasmWriteTransform,
  wasmZstdReadTransform,
  wasmZstdWriteTransform,
  setPipelinesBaseUrl,
  getPipelinesBaseUrl,
} from "@itk-wasm/transform-io"
```

#### hdf5ReadTransform

*Read an transform file format and convert it to the ITK-Wasm transform file format*

```ts
async function hdf5ReadTransform(
  serializedTransform: File | BinaryFile,
  options: Hdf5ReadTransformOptions = {}
) : Promise<Hdf5ReadTransformResult>
```

|       Parameter       |         Type        | Description                                   |
| :-------------------: | :-----------------: | :-------------------------------------------- |
| `serializedTransform` | *File | BinaryFile* | Input transform serialized in the file format |

**`Hdf5ReadTransformOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `floatParameters` |          *boolean*          | Use float for the parameter value type. The default is double.                                                                                        |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`Hdf5ReadTransformResult` interface:**

|   Property  |       Type       | Description                                                                   |
| :---------: | :--------------: | :---------------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output transform is not valid. |
| `transform` |    *Transform*   | Output transform                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                               |

#### hdf5WriteTransform

*Write an ITK-Wasm transform file format converted to a transform file format*

```ts
async function hdf5WriteTransform(
  transform: Transform,
  serializedTransform: string,
  options: Hdf5WriteTransformOptions = {}
) : Promise<Hdf5WriteTransformResult>
```

|       Parameter       |     Type    | Description                                     |
| :-------------------: | :---------: | :---------------------------------------------- |
|      `transform`      | *Transform* | Input transform                                 |
| `serializedTransform` |   *string*  | Output transform serialized in the file format. |

**`Hdf5WriteTransformOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `floatParameters` |          *boolean*          | Use float for the parameter value type. The default is double.                                                                                        |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`Hdf5WriteTransformResult` interface:**

|        Property       |       Type       | Description                                                                      |
| :-------------------: | :--------------: | :------------------------------------------------------------------------------- |
|      `couldWrite`     | *JsonCompatible* | Whether the input could be written. If false, the output transform is not valid. |
| `serializedTransform` |   *BinaryFile*   | Output transform serialized in the file format.                                  |
|      `webWorker`      |     *Worker*     | WebWorker used for computation.                                                  |

#### matReadTransform

*Read an transform file format and convert it to the ITK-Wasm transform file format*

```ts
async function matReadTransform(
  serializedTransform: File | BinaryFile,
  options: MatReadTransformOptions = {}
) : Promise<MatReadTransformResult>
```

|       Parameter       |         Type        | Description                                   |
| :-------------------: | :-----------------: | :-------------------------------------------- |
| `serializedTransform` | *File | BinaryFile* | Input transform serialized in the file format |

**`MatReadTransformOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `floatParameters` |          *boolean*          | Use float for the parameter value type. The default is double.                                                                                        |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`MatReadTransformResult` interface:**

|   Property  |       Type       | Description                                                                   |
| :---------: | :--------------: | :---------------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output transform is not valid. |
| `transform` |    *Transform*   | Output transform                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                               |

#### matWriteTransform

*Write an ITK-Wasm transform file format converted to a transform file format*

```ts
async function matWriteTransform(
  transform: Transform,
  serializedTransform: string,
  options: MatWriteTransformOptions = {}
) : Promise<MatWriteTransformResult>
```

|       Parameter       |     Type    | Description                                     |
| :-------------------: | :---------: | :---------------------------------------------- |
|      `transform`      | *Transform* | Input transform                                 |
| `serializedTransform` |   *string*  | Output transform serialized in the file format. |

**`MatWriteTransformOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `floatParameters` |          *boolean*          | Use float for the parameter value type. The default is double.                                                                                        |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`MatWriteTransformResult` interface:**

|        Property       |       Type       | Description                                                                      |
| :-------------------: | :--------------: | :------------------------------------------------------------------------------- |
|      `couldWrite`     | *JsonCompatible* | Whether the input could be written. If false, the output transform is not valid. |
| `serializedTransform` |   *BinaryFile*   | Output transform serialized in the file format.                                  |
|      `webWorker`      |     *Worker*     | WebWorker used for computation.                                                  |

#### mncReadTransform

*Read an transform file format and convert it to the ITK-Wasm transform file format*

```ts
async function mncReadTransform(
  serializedTransform: File | BinaryFile,
  options: MncReadTransformOptions = {}
) : Promise<MncReadTransformResult>
```

|       Parameter       |         Type        | Description                                   |
| :-------------------: | :-----------------: | :-------------------------------------------- |
| `serializedTransform` | *File | BinaryFile* | Input transform serialized in the file format |

**`MncReadTransformOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `floatParameters` |          *boolean*          | Use float for the parameter value type. The default is double.                                                                                        |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`MncReadTransformResult` interface:**

|   Property  |       Type       | Description                                                                   |
| :---------: | :--------------: | :---------------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output transform is not valid. |
| `transform` |    *Transform*   | Output transform                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                               |

#### mncWriteTransform

*Write an ITK-Wasm transform file format converted to a transform file format*

```ts
async function mncWriteTransform(
  transform: Transform,
  serializedTransform: string,
  options: MncWriteTransformOptions = {}
) : Promise<MncWriteTransformResult>
```

|       Parameter       |     Type    | Description                                     |
| :-------------------: | :---------: | :---------------------------------------------- |
|      `transform`      | *Transform* | Input transform                                 |
| `serializedTransform` |   *string*  | Output transform serialized in the file format. |

**`MncWriteTransformOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `floatParameters` |          *boolean*          | Use float for the parameter value type. The default is double.                                                                                        |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`MncWriteTransformResult` interface:**

|        Property       |       Type       | Description                                                                      |
| :-------------------: | :--------------: | :------------------------------------------------------------------------------- |
|      `couldWrite`     | *JsonCompatible* | Whether the input could be written. If false, the output transform is not valid. |
| `serializedTransform` |   *BinaryFile*   | Output transform serialized in the file format.                                  |
|      `webWorker`      |     *Worker*     | WebWorker used for computation.                                                  |

#### txtReadTransform

*Read an transform file format and convert it to the ITK-Wasm transform file format*

```ts
async function txtReadTransform(
  serializedTransform: File | BinaryFile,
  options: TxtReadTransformOptions = {}
) : Promise<TxtReadTransformResult>
```

|       Parameter       |         Type        | Description                                   |
| :-------------------: | :-----------------: | :-------------------------------------------- |
| `serializedTransform` | *File | BinaryFile* | Input transform serialized in the file format |

**`TxtReadTransformOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `floatParameters` |          *boolean*          | Use float for the parameter value type. The default is double.                                                                                        |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`TxtReadTransformResult` interface:**

|   Property  |       Type       | Description                                                                   |
| :---------: | :--------------: | :---------------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output transform is not valid. |
| `transform` |    *Transform*   | Output transform                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                               |

#### txtWriteTransform

*Write an ITK-Wasm transform file format converted to a transform file format*

```ts
async function txtWriteTransform(
  transform: Transform,
  serializedTransform: string,
  options: TxtWriteTransformOptions = {}
) : Promise<TxtWriteTransformResult>
```

|       Parameter       |     Type    | Description                                     |
| :-------------------: | :---------: | :---------------------------------------------- |
|      `transform`      | *Transform* | Input transform                                 |
| `serializedTransform` |   *string*  | Output transform serialized in the file format. |

**`TxtWriteTransformOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `floatParameters` |          *boolean*          | Use float for the parameter value type. The default is double.                                                                                        |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`TxtWriteTransformResult` interface:**

|        Property       |       Type       | Description                                                                      |
| :-------------------: | :--------------: | :------------------------------------------------------------------------------- |
|      `couldWrite`     | *JsonCompatible* | Whether the input could be written. If false, the output transform is not valid. |
| `serializedTransform` |   *BinaryFile*   | Output transform serialized in the file format.                                  |
|      `webWorker`      |     *Worker*     | WebWorker used for computation.                                                  |

#### wasmReadTransform

*Read an transform file format and convert it to the ITK-Wasm transform file format*

```ts
async function wasmReadTransform(
  serializedTransform: File | BinaryFile,
  options: WasmReadTransformOptions = {}
) : Promise<WasmReadTransformResult>
```

|       Parameter       |         Type        | Description                                   |
| :-------------------: | :-----------------: | :-------------------------------------------- |
| `serializedTransform` | *File | BinaryFile* | Input transform serialized in the file format |

**`WasmReadTransformOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `floatParameters` |          *boolean*          | Use float for the parameter value type. The default is double.                                                                                        |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`WasmReadTransformResult` interface:**

|   Property  |       Type       | Description                                                                   |
| :---------: | :--------------: | :---------------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output transform is not valid. |
| `transform` |    *Transform*   | Output transform                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                               |

#### wasmWriteTransform

*Write an ITK-Wasm transform file format converted to a transform file format*

```ts
async function wasmWriteTransform(
  transform: Transform,
  serializedTransform: string,
  options: WasmWriteTransformOptions = {}
) : Promise<WasmWriteTransformResult>
```

|       Parameter       |     Type    | Description                                     |
| :-------------------: | :---------: | :---------------------------------------------- |
|      `transform`      | *Transform* | Input transform                                 |
| `serializedTransform` |   *string*  | Output transform serialized in the file format. |

**`WasmWriteTransformOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `floatParameters` |          *boolean*          | Use float for the parameter value type. The default is double.                                                                                        |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`WasmWriteTransformResult` interface:**

|        Property       |       Type       | Description                                                                      |
| :-------------------: | :--------------: | :------------------------------------------------------------------------------- |
|      `couldWrite`     | *JsonCompatible* | Whether the input could be written. If false, the output transform is not valid. |
| `serializedTransform` |   *BinaryFile*   | Output transform serialized in the file format.                                  |
|      `webWorker`      |     *Worker*     | WebWorker used for computation.                                                  |

#### wasmZstdReadTransform

*Read an transform file format and convert it to the ITK-Wasm transform file format*

```ts
async function wasmZstdReadTransform(
  serializedTransform: File | BinaryFile,
  options: WasmZstdReadTransformOptions = {}
) : Promise<WasmZstdReadTransformResult>
```

|       Parameter       |         Type        | Description                                   |
| :-------------------: | :-----------------: | :-------------------------------------------- |
| `serializedTransform` | *File | BinaryFile* | Input transform serialized in the file format |

**`WasmZstdReadTransformOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `floatParameters` |          *boolean*          | Use float for the parameter value type. The default is double.                                                                                        |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`WasmZstdReadTransformResult` interface:**

|   Property  |       Type       | Description                                                                   |
| :---------: | :--------------: | :---------------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output transform is not valid. |
| `transform` |    *Transform*   | Output transform                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                               |

#### wasmZstdWriteTransform

*Write an ITK-Wasm transform file format converted to a transform file format*

```ts
async function wasmZstdWriteTransform(
  transform: Transform,
  serializedTransform: string,
  options: WasmZstdWriteTransformOptions = {}
) : Promise<WasmZstdWriteTransformResult>
```

|       Parameter       |     Type    | Description                                     |
| :-------------------: | :---------: | :---------------------------------------------- |
|      `transform`      | *Transform* | Input transform                                 |
| `serializedTransform` |   *string*  | Output transform serialized in the file format. |

**`WasmZstdWriteTransformOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `floatParameters` |          *boolean*          | Use float for the parameter value type. The default is double.                                                                                        |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`WasmZstdWriteTransformResult` interface:**

|        Property       |       Type       | Description                                                                      |
| :-------------------: | :--------------: | :------------------------------------------------------------------------------- |
|      `couldWrite`     | *JsonCompatible* | Whether the input could be written. If false, the output transform is not valid. |
| `serializedTransform` |   *BinaryFile*   | Output transform serialized in the file format.                                  |
|      `webWorker`      |     *Worker*     | WebWorker used for computation.                                                  |

#### setPipelinesBaseUrl

*Set base URL for WebAssembly assets when vendored.*

```ts
function setPipelinesBaseUrl(
  baseUrl: string | URL
) : void
```

#### getPipelinesBaseUrl

*Get base URL for WebAssembly assets when vendored.*

```ts
function getPipelinesBaseUrl() : string | URL
```


### Node interface

Import:

```js
import {
  hdf5ReadTransformNode,
  hdf5WriteTransformNode,
  matReadTransformNode,
  matWriteTransformNode,
  mncReadTransformNode,
  mncWriteTransformNode,
  txtReadTransformNode,
  txtWriteTransformNode,
  wasmReadTransformNode,
  wasmWriteTransformNode,
  wasmZstdReadTransformNode,
  wasmZstdWriteTransformNode,
} from "@itk-wasm/transform-io"
```

#### hdf5ReadTransformNode

*Read an transform file format and convert it to the ITK-Wasm transform file format*

```ts
async function hdf5ReadTransformNode(
  serializedTransform: string,
  options: Hdf5ReadTransformNodeOptions = {}
) : Promise<Hdf5ReadTransformNodeResult>
```

|       Parameter       |   Type   | Description                                   |
| :-------------------: | :------: | :-------------------------------------------- |
| `serializedTransform` | *string* | Input transform serialized in the file format |

**`Hdf5ReadTransformNodeOptions` interface:**

|      Property     |    Type   | Description                                                    |
| :---------------: | :-------: | :------------------------------------------------------------- |
| `floatParameters` | *boolean* | Use float for the parameter value type. The default is double. |

**`Hdf5ReadTransformNodeResult` interface:**

|   Property  |       Type       | Description                                                                   |
| :---------: | :--------------: | :---------------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output transform is not valid. |
| `transform` |    *Transform*   | Output transform                                                              |

#### hdf5WriteTransformNode

*Write an ITK-Wasm transform file format converted to a transform file format*

```ts
async function hdf5WriteTransformNode(
  transform: Transform,
  serializedTransform: string,
  options: Hdf5WriteTransformNodeOptions = {}
) : Promise<Hdf5WriteTransformNodeResult>
```

|       Parameter       |     Type    | Description                                     |
| :-------------------: | :---------: | :---------------------------------------------- |
|      `transform`      | *Transform* | Input transform                                 |
| `serializedTransform` |   *string*  | Output transform serialized in the file format. |

**`Hdf5WriteTransformNodeOptions` interface:**

|      Property     |    Type   | Description                                                    |
| :---------------: | :-------: | :------------------------------------------------------------- |
| `floatParameters` | *boolean* | Use float for the parameter value type. The default is double. |
|  `useCompression` | *boolean* | Use compression in the written file                            |

**`Hdf5WriteTransformNodeResult` interface:**

|        Property       |       Type       | Description                                                                      |
| :-------------------: | :--------------: | :------------------------------------------------------------------------------- |
|      `couldWrite`     | *JsonCompatible* | Whether the input could be written. If false, the output transform is not valid. |
| `serializedTransform` |   *BinaryFile*   | Output transform serialized in the file format.                                  |

#### matReadTransformNode

*Read an transform file format and convert it to the ITK-Wasm transform file format*

```ts
async function matReadTransformNode(
  serializedTransform: string,
  options: MatReadTransformNodeOptions = {}
) : Promise<MatReadTransformNodeResult>
```

|       Parameter       |   Type   | Description                                   |
| :-------------------: | :------: | :-------------------------------------------- |
| `serializedTransform` | *string* | Input transform serialized in the file format |

**`MatReadTransformNodeOptions` interface:**

|      Property     |    Type   | Description                                                    |
| :---------------: | :-------: | :------------------------------------------------------------- |
| `floatParameters` | *boolean* | Use float for the parameter value type. The default is double. |

**`MatReadTransformNodeResult` interface:**

|   Property  |       Type       | Description                                                                   |
| :---------: | :--------------: | :---------------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output transform is not valid. |
| `transform` |    *Transform*   | Output transform                                                              |

#### matWriteTransformNode

*Write an ITK-Wasm transform file format converted to a transform file format*

```ts
async function matWriteTransformNode(
  transform: Transform,
  serializedTransform: string,
  options: MatWriteTransformNodeOptions = {}
) : Promise<MatWriteTransformNodeResult>
```

|       Parameter       |     Type    | Description                                     |
| :-------------------: | :---------: | :---------------------------------------------- |
|      `transform`      | *Transform* | Input transform                                 |
| `serializedTransform` |   *string*  | Output transform serialized in the file format. |

**`MatWriteTransformNodeOptions` interface:**

|      Property     |    Type   | Description                                                    |
| :---------------: | :-------: | :------------------------------------------------------------- |
| `floatParameters` | *boolean* | Use float for the parameter value type. The default is double. |
|  `useCompression` | *boolean* | Use compression in the written file                            |

**`MatWriteTransformNodeResult` interface:**

|        Property       |       Type       | Description                                                                      |
| :-------------------: | :--------------: | :------------------------------------------------------------------------------- |
|      `couldWrite`     | *JsonCompatible* | Whether the input could be written. If false, the output transform is not valid. |
| `serializedTransform` |   *BinaryFile*   | Output transform serialized in the file format.                                  |

#### mncReadTransformNode

*Read an transform file format and convert it to the ITK-Wasm transform file format*

```ts
async function mncReadTransformNode(
  serializedTransform: string,
  options: MncReadTransformNodeOptions = {}
) : Promise<MncReadTransformNodeResult>
```

|       Parameter       |   Type   | Description                                   |
| :-------------------: | :------: | :-------------------------------------------- |
| `serializedTransform` | *string* | Input transform serialized in the file format |

**`MncReadTransformNodeOptions` interface:**

|      Property     |    Type   | Description                                                    |
| :---------------: | :-------: | :------------------------------------------------------------- |
| `floatParameters` | *boolean* | Use float for the parameter value type. The default is double. |

**`MncReadTransformNodeResult` interface:**

|   Property  |       Type       | Description                                                                   |
| :---------: | :--------------: | :---------------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output transform is not valid. |
| `transform` |    *Transform*   | Output transform                                                              |

#### mncWriteTransformNode

*Write an ITK-Wasm transform file format converted to a transform file format*

```ts
async function mncWriteTransformNode(
  transform: Transform,
  serializedTransform: string,
  options: MncWriteTransformNodeOptions = {}
) : Promise<MncWriteTransformNodeResult>
```

|       Parameter       |     Type    | Description                                     |
| :-------------------: | :---------: | :---------------------------------------------- |
|      `transform`      | *Transform* | Input transform                                 |
| `serializedTransform` |   *string*  | Output transform serialized in the file format. |

**`MncWriteTransformNodeOptions` interface:**

|      Property     |    Type   | Description                                                    |
| :---------------: | :-------: | :------------------------------------------------------------- |
| `floatParameters` | *boolean* | Use float for the parameter value type. The default is double. |
|  `useCompression` | *boolean* | Use compression in the written file                            |

**`MncWriteTransformNodeResult` interface:**

|        Property       |       Type       | Description                                                                      |
| :-------------------: | :--------------: | :------------------------------------------------------------------------------- |
|      `couldWrite`     | *JsonCompatible* | Whether the input could be written. If false, the output transform is not valid. |
| `serializedTransform` |   *BinaryFile*   | Output transform serialized in the file format.                                  |

#### txtReadTransformNode

*Read an transform file format and convert it to the ITK-Wasm transform file format*

```ts
async function txtReadTransformNode(
  serializedTransform: string,
  options: TxtReadTransformNodeOptions = {}
) : Promise<TxtReadTransformNodeResult>
```

|       Parameter       |   Type   | Description                                   |
| :-------------------: | :------: | :-------------------------------------------- |
| `serializedTransform` | *string* | Input transform serialized in the file format |

**`TxtReadTransformNodeOptions` interface:**

|      Property     |    Type   | Description                                                    |
| :---------------: | :-------: | :------------------------------------------------------------- |
| `floatParameters` | *boolean* | Use float for the parameter value type. The default is double. |

**`TxtReadTransformNodeResult` interface:**

|   Property  |       Type       | Description                                                                   |
| :---------: | :--------------: | :---------------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output transform is not valid. |
| `transform` |    *Transform*   | Output transform                                                              |

#### txtWriteTransformNode

*Write an ITK-Wasm transform file format converted to a transform file format*

```ts
async function txtWriteTransformNode(
  transform: Transform,
  serializedTransform: string,
  options: TxtWriteTransformNodeOptions = {}
) : Promise<TxtWriteTransformNodeResult>
```

|       Parameter       |     Type    | Description                                     |
| :-------------------: | :---------: | :---------------------------------------------- |
|      `transform`      | *Transform* | Input transform                                 |
| `serializedTransform` |   *string*  | Output transform serialized in the file format. |

**`TxtWriteTransformNodeOptions` interface:**

|      Property     |    Type   | Description                                                    |
| :---------------: | :-------: | :------------------------------------------------------------- |
| `floatParameters` | *boolean* | Use float for the parameter value type. The default is double. |
|  `useCompression` | *boolean* | Use compression in the written file                            |

**`TxtWriteTransformNodeResult` interface:**

|        Property       |       Type       | Description                                                                      |
| :-------------------: | :--------------: | :------------------------------------------------------------------------------- |
|      `couldWrite`     | *JsonCompatible* | Whether the input could be written. If false, the output transform is not valid. |
| `serializedTransform` |   *BinaryFile*   | Output transform serialized in the file format.                                  |

#### wasmReadTransformNode

*Read an transform file format and convert it to the ITK-Wasm transform file format*

```ts
async function wasmReadTransformNode(
  serializedTransform: string,
  options: WasmReadTransformNodeOptions = {}
) : Promise<WasmReadTransformNodeResult>
```

|       Parameter       |   Type   | Description                                   |
| :-------------------: | :------: | :-------------------------------------------- |
| `serializedTransform` | *string* | Input transform serialized in the file format |

**`WasmReadTransformNodeOptions` interface:**

|      Property     |    Type   | Description                                                    |
| :---------------: | :-------: | :------------------------------------------------------------- |
| `floatParameters` | *boolean* | Use float for the parameter value type. The default is double. |

**`WasmReadTransformNodeResult` interface:**

|   Property  |       Type       | Description                                                                   |
| :---------: | :--------------: | :---------------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output transform is not valid. |
| `transform` |    *Transform*   | Output transform                                                              |

#### wasmWriteTransformNode

*Write an ITK-Wasm transform file format converted to a transform file format*

```ts
async function wasmWriteTransformNode(
  transform: Transform,
  serializedTransform: string,
  options: WasmWriteTransformNodeOptions = {}
) : Promise<WasmWriteTransformNodeResult>
```

|       Parameter       |     Type    | Description                                     |
| :-------------------: | :---------: | :---------------------------------------------- |
|      `transform`      | *Transform* | Input transform                                 |
| `serializedTransform` |   *string*  | Output transform serialized in the file format. |

**`WasmWriteTransformNodeOptions` interface:**

|      Property     |    Type   | Description                                                    |
| :---------------: | :-------: | :------------------------------------------------------------- |
| `floatParameters` | *boolean* | Use float for the parameter value type. The default is double. |
|  `useCompression` | *boolean* | Use compression in the written file                            |

**`WasmWriteTransformNodeResult` interface:**

|        Property       |       Type       | Description                                                                      |
| :-------------------: | :--------------: | :------------------------------------------------------------------------------- |
|      `couldWrite`     | *JsonCompatible* | Whether the input could be written. If false, the output transform is not valid. |
| `serializedTransform` |   *BinaryFile*   | Output transform serialized in the file format.                                  |

#### wasmZstdReadTransformNode

*Read an transform file format and convert it to the ITK-Wasm transform file format*

```ts
async function wasmZstdReadTransformNode(
  serializedTransform: string,
  options: WasmZstdReadTransformNodeOptions = {}
) : Promise<WasmZstdReadTransformNodeResult>
```

|       Parameter       |   Type   | Description                                   |
| :-------------------: | :------: | :-------------------------------------------- |
| `serializedTransform` | *string* | Input transform serialized in the file format |

**`WasmZstdReadTransformNodeOptions` interface:**

|      Property     |    Type   | Description                                                    |
| :---------------: | :-------: | :------------------------------------------------------------- |
| `floatParameters` | *boolean* | Use float for the parameter value type. The default is double. |

**`WasmZstdReadTransformNodeResult` interface:**

|   Property  |       Type       | Description                                                                   |
| :---------: | :--------------: | :---------------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output transform is not valid. |
| `transform` |    *Transform*   | Output transform                                                              |

#### wasmZstdWriteTransformNode

*Write an ITK-Wasm transform file format converted to a transform file format*

```ts
async function wasmZstdWriteTransformNode(
  transform: Transform,
  serializedTransform: string,
  options: WasmZstdWriteTransformNodeOptions = {}
) : Promise<WasmZstdWriteTransformNodeResult>
```

|       Parameter       |     Type    | Description                                     |
| :-------------------: | :---------: | :---------------------------------------------- |
|      `transform`      | *Transform* | Input transform                                 |
| `serializedTransform` |   *string*  | Output transform serialized in the file format. |

**`WasmZstdWriteTransformNodeOptions` interface:**

|      Property     |    Type   | Description                                                    |
| :---------------: | :-------: | :------------------------------------------------------------- |
| `floatParameters` | *boolean* | Use float for the parameter value type. The default is double. |
|  `useCompression` | *boolean* | Use compression in the written file                            |

**`WasmZstdWriteTransformNodeResult` interface:**

|        Property       |       Type       | Description                                                                      |
| :-------------------: | :--------------: | :------------------------------------------------------------------------------- |
|      `couldWrite`     | *JsonCompatible* | Whether the input could be written. If false, the output transform is not valid. |
| `serializedTransform` |   *BinaryFile*   | Output transform serialized in the file format.                                  |
