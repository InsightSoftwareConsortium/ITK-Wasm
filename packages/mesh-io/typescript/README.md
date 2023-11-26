# @itk-wasm/mesh-io

[![npm version](https://badge.fury.io/js/@itk-wasm%2Fmesh-io.svg)](https://www.npmjs.com/package/@itk-wasm/mesh-io)

> Input and output for scientific and medical image file formats.

## Installation

```sh
npm install @itk-wasm/mesh-io
```

## Usage

### Browser interface

Import:

```js
import {
  byuReadMesh,
  byuWriteMesh,
  freeSurferAsciiReadMesh,
  freeSurferAsciiWriteMesh,
  freeSurferBinaryReadMesh,
  freeSurferBinaryWriteMesh,
  objReadMesh,
  objWriteMesh,
  offReadMesh,
  offWriteMesh,
  stlReadMesh,
  stlWriteMesh,
  swcReadMesh,
  swcWriteMesh,
  vtkPolyDataReadMesh,
  vtkPolyDataWriteMesh,
  wasmReadMesh,
  wasmWriteMesh,
  wasmZtdReadMesh,
  wasmZtdWriteMesh,
  setPipelinesBaseUrl,
  getPipelinesBaseUrl,
} from "@itk-wasm/mesh-io"
```

#### byuReadMesh

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function byuReadMesh(
  webWorker: null | Worker | boolean,
  serializedMesh: File | BinaryFile,
  options: ByuReadMeshOptions = {}
) : Promise<ByuReadMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `webWorker`   | *null or Worker or boolean* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
| `serializedMesh` |     *File | BinaryFile*     | Input mesh serialized in the file format                                                                                                                     |

**`ByuReadMeshOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`ByuReadMeshResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                          |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### byuWriteMesh

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function byuWriteMesh(
  webWorker: null | Worker | boolean,
  mesh: Mesh,
  serializedMesh: string,
  options: ByuWriteMeshOptions = {}
) : Promise<ByuWriteMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `webWorker`   | *null or Worker or boolean* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `mesh`      |            *Mesh*           | Input mesh                                                                                                                                                   |
| `serializedMesh` |           *string*          | Output mesh                                                                                                                                                  |

**`ByuWriteMeshOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |

**`ByuWriteMeshResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|    `webWorker`   |     *Worker*     | WebWorker used for computation.                                             |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |

#### freeSurferAsciiReadMesh

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function freeSurferAsciiReadMesh(
  webWorker: null | Worker | boolean,
  serializedMesh: File | BinaryFile,
  options: FreeSurferAsciiReadMeshOptions = {}
) : Promise<FreeSurferAsciiReadMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `webWorker`   | *null or Worker or boolean* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
| `serializedMesh` |     *File | BinaryFile*     | Input mesh serialized in the file format                                                                                                                     |

**`FreeSurferAsciiReadMeshOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`FreeSurferAsciiReadMeshResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                          |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### freeSurferAsciiWriteMesh

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function freeSurferAsciiWriteMesh(
  webWorker: null | Worker | boolean,
  mesh: Mesh,
  serializedMesh: string,
  options: FreeSurferAsciiWriteMeshOptions = {}
) : Promise<FreeSurferAsciiWriteMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `webWorker`   | *null or Worker or boolean* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `mesh`      |            *Mesh*           | Input mesh                                                                                                                                                   |
| `serializedMesh` |           *string*          | Output mesh                                                                                                                                                  |

**`FreeSurferAsciiWriteMeshOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |

**`FreeSurferAsciiWriteMeshResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|    `webWorker`   |     *Worker*     | WebWorker used for computation.                                             |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |

#### freeSurferBinaryReadMesh

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function freeSurferBinaryReadMesh(
  webWorker: null | Worker | boolean,
  serializedMesh: File | BinaryFile,
  options: FreeSurferBinaryReadMeshOptions = {}
) : Promise<FreeSurferBinaryReadMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `webWorker`   | *null or Worker or boolean* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
| `serializedMesh` |     *File | BinaryFile*     | Input mesh serialized in the file format                                                                                                                     |

**`FreeSurferBinaryReadMeshOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`FreeSurferBinaryReadMeshResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                          |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### freeSurferBinaryWriteMesh

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function freeSurferBinaryWriteMesh(
  webWorker: null | Worker | boolean,
  mesh: Mesh,
  serializedMesh: string,
  options: FreeSurferBinaryWriteMeshOptions = {}
) : Promise<FreeSurferBinaryWriteMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `webWorker`   | *null or Worker or boolean* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `mesh`      |            *Mesh*           | Input mesh                                                                                                                                                   |
| `serializedMesh` |           *string*          | Output mesh                                                                                                                                                  |

**`FreeSurferBinaryWriteMeshOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |

**`FreeSurferBinaryWriteMeshResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|    `webWorker`   |     *Worker*     | WebWorker used for computation.                                             |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |

#### objReadMesh

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function objReadMesh(
  webWorker: null | Worker | boolean,
  serializedMesh: File | BinaryFile,
  options: ObjReadMeshOptions = {}
) : Promise<ObjReadMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `webWorker`   | *null or Worker or boolean* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
| `serializedMesh` |     *File | BinaryFile*     | Input mesh serialized in the file format                                                                                                                     |

**`ObjReadMeshOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`ObjReadMeshResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                          |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### objWriteMesh

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function objWriteMesh(
  webWorker: null | Worker | boolean,
  mesh: Mesh,
  serializedMesh: string,
  options: ObjWriteMeshOptions = {}
) : Promise<ObjWriteMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `webWorker`   | *null or Worker or boolean* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `mesh`      |            *Mesh*           | Input mesh                                                                                                                                                   |
| `serializedMesh` |           *string*          | Output mesh                                                                                                                                                  |

**`ObjWriteMeshOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |

**`ObjWriteMeshResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|    `webWorker`   |     *Worker*     | WebWorker used for computation.                                             |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |

#### offReadMesh

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function offReadMesh(
  webWorker: null | Worker | boolean,
  serializedMesh: File | BinaryFile,
  options: OffReadMeshOptions = {}
) : Promise<OffReadMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `webWorker`   | *null or Worker or boolean* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
| `serializedMesh` |     *File | BinaryFile*     | Input mesh serialized in the file format                                                                                                                     |

**`OffReadMeshOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`OffReadMeshResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                          |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### offWriteMesh

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function offWriteMesh(
  webWorker: null | Worker | boolean,
  mesh: Mesh,
  serializedMesh: string,
  options: OffWriteMeshOptions = {}
) : Promise<OffWriteMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `webWorker`   | *null or Worker or boolean* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `mesh`      |            *Mesh*           | Input mesh                                                                                                                                                   |
| `serializedMesh` |           *string*          | Output mesh                                                                                                                                                  |

**`OffWriteMeshOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |

**`OffWriteMeshResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|    `webWorker`   |     *Worker*     | WebWorker used for computation.                                             |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |

#### stlReadMesh

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function stlReadMesh(
  webWorker: null | Worker | boolean,
  serializedMesh: File | BinaryFile,
  options: StlReadMeshOptions = {}
) : Promise<StlReadMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `webWorker`   | *null or Worker or boolean* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
| `serializedMesh` |     *File | BinaryFile*     | Input mesh serialized in the file format                                                                                                                     |

**`StlReadMeshOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`StlReadMeshResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                          |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### stlWriteMesh

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function stlWriteMesh(
  webWorker: null | Worker | boolean,
  mesh: Mesh,
  serializedMesh: string,
  options: StlWriteMeshOptions = {}
) : Promise<StlWriteMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `webWorker`   | *null or Worker or boolean* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `mesh`      |            *Mesh*           | Input mesh                                                                                                                                                   |
| `serializedMesh` |           *string*          | Output mesh                                                                                                                                                  |

**`StlWriteMeshOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |

**`StlWriteMeshResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|    `webWorker`   |     *Worker*     | WebWorker used for computation.                                             |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |

#### swcReadMesh

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function swcReadMesh(
  webWorker: null | Worker | boolean,
  serializedMesh: File | BinaryFile,
  options: SwcReadMeshOptions = {}
) : Promise<SwcReadMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `webWorker`   | *null or Worker or boolean* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
| `serializedMesh` |     *File | BinaryFile*     | Input mesh serialized in the file format                                                                                                                     |

**`SwcReadMeshOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`SwcReadMeshResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                          |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### swcWriteMesh

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function swcWriteMesh(
  webWorker: null | Worker | boolean,
  mesh: Mesh,
  serializedMesh: string,
  options: SwcWriteMeshOptions = {}
) : Promise<SwcWriteMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `webWorker`   | *null or Worker or boolean* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `mesh`      |            *Mesh*           | Input mesh                                                                                                                                                   |
| `serializedMesh` |           *string*          | Output mesh                                                                                                                                                  |

**`SwcWriteMeshOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |

**`SwcWriteMeshResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|    `webWorker`   |     *Worker*     | WebWorker used for computation.                                             |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |

#### vtkPolyDataReadMesh

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function vtkPolyDataReadMesh(
  webWorker: null | Worker | boolean,
  serializedMesh: File | BinaryFile,
  options: VtkPolyDataReadMeshOptions = {}
) : Promise<VtkPolyDataReadMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `webWorker`   | *null or Worker or boolean* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
| `serializedMesh` |     *File | BinaryFile*     | Input mesh serialized in the file format                                                                                                                     |

**`VtkPolyDataReadMeshOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`VtkPolyDataReadMeshResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                          |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### vtkPolyDataWriteMesh

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function vtkPolyDataWriteMesh(
  webWorker: null | Worker | boolean,
  mesh: Mesh,
  serializedMesh: string,
  options: VtkPolyDataWriteMeshOptions = {}
) : Promise<VtkPolyDataWriteMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `webWorker`   | *null or Worker or boolean* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `mesh`      |            *Mesh*           | Input mesh                                                                                                                                                   |
| `serializedMesh` |           *string*          | Output mesh                                                                                                                                                  |

**`VtkPolyDataWriteMeshOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |

**`VtkPolyDataWriteMeshResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|    `webWorker`   |     *Worker*     | WebWorker used for computation.                                             |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |

#### wasmReadMesh

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function wasmReadMesh(
  webWorker: null | Worker | boolean,
  serializedMesh: File | BinaryFile,
  options: WasmReadMeshOptions = {}
) : Promise<WasmReadMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `webWorker`   | *null or Worker or boolean* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
| `serializedMesh` |     *File | BinaryFile*     | Input mesh serialized in the file format                                                                                                                     |

**`WasmReadMeshOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`WasmReadMeshResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                          |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### wasmWriteMesh

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function wasmWriteMesh(
  webWorker: null | Worker | boolean,
  mesh: Mesh,
  serializedMesh: string,
  options: WasmWriteMeshOptions = {}
) : Promise<WasmWriteMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `webWorker`   | *null or Worker or boolean* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `mesh`      |            *Mesh*           | Input mesh                                                                                                                                                   |
| `serializedMesh` |           *string*          | Output mesh                                                                                                                                                  |

**`WasmWriteMeshOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |

**`WasmWriteMeshResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|    `webWorker`   |     *Worker*     | WebWorker used for computation.                                             |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |

#### wasmZtdReadMesh

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function wasmZtdReadMesh(
  webWorker: null | Worker | boolean,
  serializedMesh: File | BinaryFile,
  options: WasmZtdReadMeshOptions = {}
) : Promise<WasmZtdReadMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `webWorker`   | *null or Worker or boolean* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
| `serializedMesh` |     *File | BinaryFile*     | Input mesh serialized in the file format                                                                                                                     |

**`WasmZtdReadMeshOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`WasmZtdReadMeshResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                          |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### wasmZtdWriteMesh

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function wasmZtdWriteMesh(
  webWorker: null | Worker | boolean,
  mesh: Mesh,
  serializedMesh: string,
  options: WasmZtdWriteMeshOptions = {}
) : Promise<WasmZtdWriteMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `webWorker`   | *null or Worker or boolean* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `mesh`      |            *Mesh*           | Input mesh                                                                                                                                                   |
| `serializedMesh` |           *string*          | Output mesh                                                                                                                                                  |

**`WasmZtdWriteMeshOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |

**`WasmZtdWriteMeshResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|    `webWorker`   |     *Worker*     | WebWorker used for computation.                                             |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |

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
  byuReadMeshNode,
  byuWriteMeshNode,
  freeSurferAsciiReadMeshNode,
  freeSurferAsciiWriteMeshNode,
  freeSurferBinaryReadMeshNode,
  freeSurferBinaryWriteMeshNode,
  objReadMeshNode,
  objWriteMeshNode,
  offReadMeshNode,
  offWriteMeshNode,
  stlReadMeshNode,
  stlWriteMeshNode,
  swcReadMeshNode,
  swcWriteMeshNode,
  vtkPolyDataReadMeshNode,
  vtkPolyDataWriteMeshNode,
  wasmReadMeshNode,
  wasmWriteMeshNode,
  wasmZtdReadMeshNode,
  wasmZtdWriteMeshNode,
} from "@itk-wasm/mesh-io"
```

#### byuReadMeshNode

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function byuReadMeshNode(
  serializedMesh: string,
  options: ByuReadMeshOptions = {}
) : Promise<ByuReadMeshNodeResult>
```

|     Parameter    |   Type   | Description                              |
| :--------------: | :------: | :--------------------------------------- |
| `serializedMesh` | *string* | Input mesh serialized in the file format |

**`ByuReadMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`ByuReadMeshNodeResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### byuWriteMeshNode

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function byuWriteMeshNode(
  mesh: Mesh,
  serializedMesh: string,
  options: ByuWriteMeshOptions = {}
) : Promise<ByuWriteMeshNodeResult>
```

|     Parameter    |   Type   | Description |
| :--------------: | :------: | :---------- |
|      `mesh`      |  *Mesh*  | Input mesh  |
| `serializedMesh` | *string* | Output mesh |

**`ByuWriteMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |

**`ByuWriteMeshNodeResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |

#### freeSurferAsciiReadMeshNode

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function freeSurferAsciiReadMeshNode(
  serializedMesh: string,
  options: FreeSurferAsciiReadMeshOptions = {}
) : Promise<FreeSurferAsciiReadMeshNodeResult>
```

|     Parameter    |   Type   | Description                              |
| :--------------: | :------: | :--------------------------------------- |
| `serializedMesh` | *string* | Input mesh serialized in the file format |

**`FreeSurferAsciiReadMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`FreeSurferAsciiReadMeshNodeResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### freeSurferAsciiWriteMeshNode

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function freeSurferAsciiWriteMeshNode(
  mesh: Mesh,
  serializedMesh: string,
  options: FreeSurferAsciiWriteMeshOptions = {}
) : Promise<FreeSurferAsciiWriteMeshNodeResult>
```

|     Parameter    |   Type   | Description |
| :--------------: | :------: | :---------- |
|      `mesh`      |  *Mesh*  | Input mesh  |
| `serializedMesh` | *string* | Output mesh |

**`FreeSurferAsciiWriteMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |

**`FreeSurferAsciiWriteMeshNodeResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |

#### freeSurferBinaryReadMeshNode

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function freeSurferBinaryReadMeshNode(
  serializedMesh: string,
  options: FreeSurferBinaryReadMeshOptions = {}
) : Promise<FreeSurferBinaryReadMeshNodeResult>
```

|     Parameter    |   Type   | Description                              |
| :--------------: | :------: | :--------------------------------------- |
| `serializedMesh` | *string* | Input mesh serialized in the file format |

**`FreeSurferBinaryReadMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`FreeSurferBinaryReadMeshNodeResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### freeSurferBinaryWriteMeshNode

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function freeSurferBinaryWriteMeshNode(
  mesh: Mesh,
  serializedMesh: string,
  options: FreeSurferBinaryWriteMeshOptions = {}
) : Promise<FreeSurferBinaryWriteMeshNodeResult>
```

|     Parameter    |   Type   | Description |
| :--------------: | :------: | :---------- |
|      `mesh`      |  *Mesh*  | Input mesh  |
| `serializedMesh` | *string* | Output mesh |

**`FreeSurferBinaryWriteMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |

**`FreeSurferBinaryWriteMeshNodeResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |

#### objReadMeshNode

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function objReadMeshNode(
  serializedMesh: string,
  options: ObjReadMeshOptions = {}
) : Promise<ObjReadMeshNodeResult>
```

|     Parameter    |   Type   | Description                              |
| :--------------: | :------: | :--------------------------------------- |
| `serializedMesh` | *string* | Input mesh serialized in the file format |

**`ObjReadMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`ObjReadMeshNodeResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### objWriteMeshNode

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function objWriteMeshNode(
  mesh: Mesh,
  serializedMesh: string,
  options: ObjWriteMeshOptions = {}
) : Promise<ObjWriteMeshNodeResult>
```

|     Parameter    |   Type   | Description |
| :--------------: | :------: | :---------- |
|      `mesh`      |  *Mesh*  | Input mesh  |
| `serializedMesh` | *string* | Output mesh |

**`ObjWriteMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |

**`ObjWriteMeshNodeResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |

#### offReadMeshNode

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function offReadMeshNode(
  serializedMesh: string,
  options: OffReadMeshOptions = {}
) : Promise<OffReadMeshNodeResult>
```

|     Parameter    |   Type   | Description                              |
| :--------------: | :------: | :--------------------------------------- |
| `serializedMesh` | *string* | Input mesh serialized in the file format |

**`OffReadMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`OffReadMeshNodeResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### offWriteMeshNode

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function offWriteMeshNode(
  mesh: Mesh,
  serializedMesh: string,
  options: OffWriteMeshOptions = {}
) : Promise<OffWriteMeshNodeResult>
```

|     Parameter    |   Type   | Description |
| :--------------: | :------: | :---------- |
|      `mesh`      |  *Mesh*  | Input mesh  |
| `serializedMesh` | *string* | Output mesh |

**`OffWriteMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |

**`OffWriteMeshNodeResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |

#### stlReadMeshNode

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function stlReadMeshNode(
  serializedMesh: string,
  options: StlReadMeshOptions = {}
) : Promise<StlReadMeshNodeResult>
```

|     Parameter    |   Type   | Description                              |
| :--------------: | :------: | :--------------------------------------- |
| `serializedMesh` | *string* | Input mesh serialized in the file format |

**`StlReadMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`StlReadMeshNodeResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### stlWriteMeshNode

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function stlWriteMeshNode(
  mesh: Mesh,
  serializedMesh: string,
  options: StlWriteMeshOptions = {}
) : Promise<StlWriteMeshNodeResult>
```

|     Parameter    |   Type   | Description |
| :--------------: | :------: | :---------- |
|      `mesh`      |  *Mesh*  | Input mesh  |
| `serializedMesh` | *string* | Output mesh |

**`StlWriteMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |

**`StlWriteMeshNodeResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |

#### swcReadMeshNode

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function swcReadMeshNode(
  serializedMesh: string,
  options: SwcReadMeshOptions = {}
) : Promise<SwcReadMeshNodeResult>
```

|     Parameter    |   Type   | Description                              |
| :--------------: | :------: | :--------------------------------------- |
| `serializedMesh` | *string* | Input mesh serialized in the file format |

**`SwcReadMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`SwcReadMeshNodeResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### swcWriteMeshNode

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function swcWriteMeshNode(
  mesh: Mesh,
  serializedMesh: string,
  options: SwcWriteMeshOptions = {}
) : Promise<SwcWriteMeshNodeResult>
```

|     Parameter    |   Type   | Description |
| :--------------: | :------: | :---------- |
|      `mesh`      |  *Mesh*  | Input mesh  |
| `serializedMesh` | *string* | Output mesh |

**`SwcWriteMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |

**`SwcWriteMeshNodeResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |

#### vtkPolyDataReadMeshNode

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function vtkPolyDataReadMeshNode(
  serializedMesh: string,
  options: VtkPolyDataReadMeshOptions = {}
) : Promise<VtkPolyDataReadMeshNodeResult>
```

|     Parameter    |   Type   | Description                              |
| :--------------: | :------: | :--------------------------------------- |
| `serializedMesh` | *string* | Input mesh serialized in the file format |

**`VtkPolyDataReadMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`VtkPolyDataReadMeshNodeResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### vtkPolyDataWriteMeshNode

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function vtkPolyDataWriteMeshNode(
  mesh: Mesh,
  serializedMesh: string,
  options: VtkPolyDataWriteMeshOptions = {}
) : Promise<VtkPolyDataWriteMeshNodeResult>
```

|     Parameter    |   Type   | Description |
| :--------------: | :------: | :---------- |
|      `mesh`      |  *Mesh*  | Input mesh  |
| `serializedMesh` | *string* | Output mesh |

**`VtkPolyDataWriteMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |

**`VtkPolyDataWriteMeshNodeResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |

#### wasmReadMeshNode

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function wasmReadMeshNode(
  serializedMesh: string,
  options: WasmReadMeshOptions = {}
) : Promise<WasmReadMeshNodeResult>
```

|     Parameter    |   Type   | Description                              |
| :--------------: | :------: | :--------------------------------------- |
| `serializedMesh` | *string* | Input mesh serialized in the file format |

**`WasmReadMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`WasmReadMeshNodeResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### wasmWriteMeshNode

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function wasmWriteMeshNode(
  mesh: Mesh,
  serializedMesh: string,
  options: WasmWriteMeshOptions = {}
) : Promise<WasmWriteMeshNodeResult>
```

|     Parameter    |   Type   | Description |
| :--------------: | :------: | :---------- |
|      `mesh`      |  *Mesh*  | Input mesh  |
| `serializedMesh` | *string* | Output mesh |

**`WasmWriteMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |

**`WasmWriteMeshNodeResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |

#### wasmZtdReadMeshNode

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function wasmZtdReadMeshNode(
  serializedMesh: string,
  options: WasmZtdReadMeshOptions = {}
) : Promise<WasmZtdReadMeshNodeResult>
```

|     Parameter    |   Type   | Description                              |
| :--------------: | :------: | :--------------------------------------- |
| `serializedMesh` | *string* | Input mesh serialized in the file format |

**`WasmZtdReadMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`WasmZtdReadMeshNodeResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### wasmZtdWriteMeshNode

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function wasmZtdWriteMeshNode(
  mesh: Mesh,
  serializedMesh: string,
  options: WasmZtdWriteMeshOptions = {}
) : Promise<WasmZtdWriteMeshNodeResult>
```

|     Parameter    |   Type   | Description |
| :--------------: | :------: | :---------- |
|      `mesh`      |  *Mesh*  | Input mesh  |
| `serializedMesh` | *string* | Output mesh |

**`WasmZtdWriteMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |

**`WasmZtdWriteMeshNodeResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |
