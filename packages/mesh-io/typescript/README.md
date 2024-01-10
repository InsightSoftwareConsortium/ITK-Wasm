# @itk-wasm/mesh-io

[![npm version](https://badge.fury.io/js/@itk-wasm%2Fmesh-io.svg)](https://www.npmjs.com/package/@itk-wasm/mesh-io)

> Input and output for mesh file formats.

## Installation

```sh
npm install @itk-wasm/mesh-io
```

## Usage

### Browser interface

Import:

```js
import {
  readMesh,
  writeMesh,
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
  wasmZstdReadMesh,
  wasmZstdWriteMesh,
  setPipelinesBaseUrl,
  getPipelinesBaseUrl,
} from "@itk-wasm/mesh-io"
```

#### readMesh

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function readMesh(
  serializedMesh: File | BinaryFile,
  options: ReadMeshOptions = {}
) : Promise<ReadMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `serializedMesh` |     *File | BinaryFile*     | Input mesh serialized in the file format                                                                                                                     |

**`ReadMeshOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.  

**`ReadMeshResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                          |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### writeMesh

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function writeMesh(
  mesh: Mesh,
  serializedMesh: string,
  options: WriteMeshOptions = {}
) : Promise<WriteMeshResult>
```

|     Parameter    |             Type            | Description                                                                                                                                                  |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|      `mesh`      |            *Mesh*           | Input mesh                                                                                                                                                   |
| `serializedMesh` |           *string*          | Output mesh                                                                                                                                                  |

**`WriteMeshOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.  

**`WriteMeshResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|    `webWorker`   |     *Worker*     | WebWorker used for computation.                                             |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |

#### byuReadMesh

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function byuReadMesh(
  serializedMesh: File | BinaryFile,
  options: ByuReadMeshOptions = {}
) : Promise<ByuReadMeshResult>
```

|     Parameter    |         Type        | Description                              |
| :--------------: | :-----------------: | :--------------------------------------- |
| `serializedMesh` | *File | BinaryFile* | Input mesh serialized in the file format |

**`ByuReadMeshOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`ByuReadMeshResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                          |

#### byuWriteMesh

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function byuWriteMesh(
  mesh: Mesh,
  serializedMesh: string,
  options: ByuWriteMeshOptions = {}
) : Promise<ByuWriteMeshResult>
```

|     Parameter    |   Type   | Description |
| :--------------: | :------: | :---------- |
|      `mesh`      |  *Mesh*  | Input mesh  |
| `serializedMesh` | *string* | Output mesh |

**`ByuWriteMeshOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file, if supported                                                                                                     |
|  `binaryFileType` |          *boolean*          | Use a binary file type in the written file, if supported                                                                                              |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`ByuWriteMeshResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |
|    `webWorker`   |     *Worker*     | WebWorker used for computation.                                             |

#### freeSurferAsciiReadMesh

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function freeSurferAsciiReadMesh(
  serializedMesh: File | BinaryFile,
  options: FreeSurferAsciiReadMeshOptions = {}
) : Promise<FreeSurferAsciiReadMeshResult>
```

|     Parameter    |         Type        | Description                              |
| :--------------: | :-----------------: | :--------------------------------------- |
| `serializedMesh` | *File | BinaryFile* | Input mesh serialized in the file format |

**`FreeSurferAsciiReadMeshOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`FreeSurferAsciiReadMeshResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                          |

#### freeSurferAsciiWriteMesh

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function freeSurferAsciiWriteMesh(
  mesh: Mesh,
  serializedMesh: string,
  options: FreeSurferAsciiWriteMeshOptions = {}
) : Promise<FreeSurferAsciiWriteMeshResult>
```

|     Parameter    |   Type   | Description |
| :--------------: | :------: | :---------- |
|      `mesh`      |  *Mesh*  | Input mesh  |
| `serializedMesh` | *string* | Output mesh |

**`FreeSurferAsciiWriteMeshOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file, if supported                                                                                                     |
|  `binaryFileType` |          *boolean*          | Use a binary file type in the written file, if supported                                                                                              |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`FreeSurferAsciiWriteMeshResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |
|    `webWorker`   |     *Worker*     | WebWorker used for computation.                                             |

#### freeSurferBinaryReadMesh

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function freeSurferBinaryReadMesh(
  serializedMesh: File | BinaryFile,
  options: FreeSurferBinaryReadMeshOptions = {}
) : Promise<FreeSurferBinaryReadMeshResult>
```

|     Parameter    |         Type        | Description                              |
| :--------------: | :-----------------: | :--------------------------------------- |
| `serializedMesh` | *File | BinaryFile* | Input mesh serialized in the file format |

**`FreeSurferBinaryReadMeshOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`FreeSurferBinaryReadMeshResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                          |

#### freeSurferBinaryWriteMesh

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function freeSurferBinaryWriteMesh(
  mesh: Mesh,
  serializedMesh: string,
  options: FreeSurferBinaryWriteMeshOptions = {}
) : Promise<FreeSurferBinaryWriteMeshResult>
```

|     Parameter    |   Type   | Description |
| :--------------: | :------: | :---------- |
|      `mesh`      |  *Mesh*  | Input mesh  |
| `serializedMesh` | *string* | Output mesh |

**`FreeSurferBinaryWriteMeshOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file, if supported                                                                                                     |
|  `binaryFileType` |          *boolean*          | Use a binary file type in the written file, if supported                                                                                              |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`FreeSurferBinaryWriteMeshResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |
|    `webWorker`   |     *Worker*     | WebWorker used for computation.                                             |

#### objReadMesh

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function objReadMesh(
  serializedMesh: File | BinaryFile,
  options: ObjReadMeshOptions = {}
) : Promise<ObjReadMeshResult>
```

|     Parameter    |         Type        | Description                              |
| :--------------: | :-----------------: | :--------------------------------------- |
| `serializedMesh` | *File | BinaryFile* | Input mesh serialized in the file format |

**`ObjReadMeshOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`ObjReadMeshResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                          |

#### objWriteMesh

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function objWriteMesh(
  mesh: Mesh,
  serializedMesh: string,
  options: ObjWriteMeshOptions = {}
) : Promise<ObjWriteMeshResult>
```

|     Parameter    |   Type   | Description |
| :--------------: | :------: | :---------- |
|      `mesh`      |  *Mesh*  | Input mesh  |
| `serializedMesh` | *string* | Output mesh |

**`ObjWriteMeshOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file, if supported                                                                                                     |
|  `binaryFileType` |          *boolean*          | Use a binary file type in the written file, if supported                                                                                              |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`ObjWriteMeshResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |
|    `webWorker`   |     *Worker*     | WebWorker used for computation.                                             |

#### offReadMesh

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function offReadMesh(
  serializedMesh: File | BinaryFile,
  options: OffReadMeshOptions = {}
) : Promise<OffReadMeshResult>
```

|     Parameter    |         Type        | Description                              |
| :--------------: | :-----------------: | :--------------------------------------- |
| `serializedMesh` | *File | BinaryFile* | Input mesh serialized in the file format |

**`OffReadMeshOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`OffReadMeshResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                          |

#### offWriteMesh

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function offWriteMesh(
  mesh: Mesh,
  serializedMesh: string,
  options: OffWriteMeshOptions = {}
) : Promise<OffWriteMeshResult>
```

|     Parameter    |   Type   | Description |
| :--------------: | :------: | :---------- |
|      `mesh`      |  *Mesh*  | Input mesh  |
| `serializedMesh` | *string* | Output mesh |

**`OffWriteMeshOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file, if supported                                                                                                     |
|  `binaryFileType` |          *boolean*          | Use a binary file type in the written file, if supported                                                                                              |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`OffWriteMeshResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |
|    `webWorker`   |     *Worker*     | WebWorker used for computation.                                             |

#### stlReadMesh

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function stlReadMesh(
  serializedMesh: File | BinaryFile,
  options: StlReadMeshOptions = {}
) : Promise<StlReadMeshResult>
```

|     Parameter    |         Type        | Description                              |
| :--------------: | :-----------------: | :--------------------------------------- |
| `serializedMesh` | *File | BinaryFile* | Input mesh serialized in the file format |

**`StlReadMeshOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`StlReadMeshResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                          |

#### stlWriteMesh

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function stlWriteMesh(
  mesh: Mesh,
  serializedMesh: string,
  options: StlWriteMeshOptions = {}
) : Promise<StlWriteMeshResult>
```

|     Parameter    |   Type   | Description |
| :--------------: | :------: | :---------- |
|      `mesh`      |  *Mesh*  | Input mesh  |
| `serializedMesh` | *string* | Output mesh |

**`StlWriteMeshOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file, if supported                                                                                                     |
|  `binaryFileType` |          *boolean*          | Use a binary file type in the written file, if supported                                                                                              |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`StlWriteMeshResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |
|    `webWorker`   |     *Worker*     | WebWorker used for computation.                                             |

#### swcReadMesh

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function swcReadMesh(
  serializedMesh: File | BinaryFile,
  options: SwcReadMeshOptions = {}
) : Promise<SwcReadMeshResult>
```

|     Parameter    |         Type        | Description                              |
| :--------------: | :-----------------: | :--------------------------------------- |
| `serializedMesh` | *File | BinaryFile* | Input mesh serialized in the file format |

**`SwcReadMeshOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`SwcReadMeshResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                          |

#### swcWriteMesh

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function swcWriteMesh(
  mesh: Mesh,
  serializedMesh: string,
  options: SwcWriteMeshOptions = {}
) : Promise<SwcWriteMeshResult>
```

|     Parameter    |   Type   | Description |
| :--------------: | :------: | :---------- |
|      `mesh`      |  *Mesh*  | Input mesh  |
| `serializedMesh` | *string* | Output mesh |

**`SwcWriteMeshOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file, if supported                                                                                                     |
|  `binaryFileType` |          *boolean*          | Use a binary file type in the written file, if supported                                                                                              |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`SwcWriteMeshResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |
|    `webWorker`   |     *Worker*     | WebWorker used for computation.                                             |

#### vtkPolyDataReadMesh

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function vtkPolyDataReadMesh(
  serializedMesh: File | BinaryFile,
  options: VtkPolyDataReadMeshOptions = {}
) : Promise<VtkPolyDataReadMeshResult>
```

|     Parameter    |         Type        | Description                              |
| :--------------: | :-----------------: | :--------------------------------------- |
| `serializedMesh` | *File | BinaryFile* | Input mesh serialized in the file format |

**`VtkPolyDataReadMeshOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`VtkPolyDataReadMeshResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                          |

#### vtkPolyDataWriteMesh

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function vtkPolyDataWriteMesh(
  mesh: Mesh,
  serializedMesh: string,
  options: VtkPolyDataWriteMeshOptions = {}
) : Promise<VtkPolyDataWriteMeshResult>
```

|     Parameter    |   Type   | Description |
| :--------------: | :------: | :---------- |
|      `mesh`      |  *Mesh*  | Input mesh  |
| `serializedMesh` | *string* | Output mesh |

**`VtkPolyDataWriteMeshOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file, if supported                                                                                                     |
|  `binaryFileType` |          *boolean*          | Use a binary file type in the written file, if supported                                                                                              |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`VtkPolyDataWriteMeshResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |
|    `webWorker`   |     *Worker*     | WebWorker used for computation.                                             |

#### wasmReadMesh

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function wasmReadMesh(
  serializedMesh: File | BinaryFile,
  options: WasmReadMeshOptions = {}
) : Promise<WasmReadMeshResult>
```

|     Parameter    |         Type        | Description                              |
| :--------------: | :-----------------: | :--------------------------------------- |
| `serializedMesh` | *File | BinaryFile* | Input mesh serialized in the file format |

**`WasmReadMeshOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`WasmReadMeshResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                          |

#### wasmWriteMesh

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function wasmWriteMesh(
  mesh: Mesh,
  serializedMesh: string,
  options: WasmWriteMeshOptions = {}
) : Promise<WasmWriteMeshResult>
```

|     Parameter    |   Type   | Description |
| :--------------: | :------: | :---------- |
|      `mesh`      |  *Mesh*  | Input mesh  |
| `serializedMesh` | *string* | Output mesh |

**`WasmWriteMeshOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file, if supported                                                                                                     |
|  `binaryFileType` |          *boolean*          | Use a binary file type in the written file, if supported                                                                                              |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`WasmWriteMeshResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |
|    `webWorker`   |     *Worker*     | WebWorker used for computation.                                             |

#### wasmZstdReadMesh

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function wasmZstdReadMesh(
  serializedMesh: File | BinaryFile,
  options: WasmZstdReadMeshOptions = {}
) : Promise<WasmZstdReadMeshResult>
```

|     Parameter    |         Type        | Description                              |
| :--------------: | :-----------------: | :--------------------------------------- |
| `serializedMesh` | *File | BinaryFile* | Input mesh serialized in the file format |

**`WasmZstdReadMeshOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`WasmZstdReadMeshResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                          |

#### wasmZstdWriteMesh

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function wasmZstdWriteMesh(
  mesh: Mesh,
  serializedMesh: string,
  options: WasmZstdWriteMeshOptions = {}
) : Promise<WasmZstdWriteMeshResult>
```

|     Parameter    |   Type   | Description |
| :--------------: | :------: | :---------- |
|      `mesh`      |  *Mesh*  | Input mesh  |
| `serializedMesh` | *string* | Output mesh |

**`WasmZstdWriteMeshOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file, if supported                                                                                                     |
|  `binaryFileType` |          *boolean*          | Use a binary file type in the written file, if supported                                                                                              |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`WasmZstdWriteMeshResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |
|    `webWorker`   |     *Worker*     | WebWorker used for computation.                                             |

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
  wasmZstdReadMeshNode,
  wasmZstdWriteMeshNode,
} from "@itk-wasm/mesh-io"
```

#### byuReadMeshNode

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function byuReadMeshNode(
  serializedMesh: string,
  options: ByuReadMeshNodeOptions = {}
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
  options: ByuWriteMeshNodeOptions = {}
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
  options: FreeSurferAsciiReadMeshNodeOptions = {}
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
  options: FreeSurferAsciiWriteMeshNodeOptions = {}
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
  options: FreeSurferBinaryReadMeshNodeOptions = {}
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
  options: FreeSurferBinaryWriteMeshNodeOptions = {}
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
  options: ObjReadMeshNodeOptions = {}
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
  options: ObjWriteMeshNodeOptions = {}
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
  options: OffReadMeshNodeOptions = {}
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
  options: OffWriteMeshNodeOptions = {}
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
  options: StlReadMeshNodeOptions = {}
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
  options: StlWriteMeshNodeOptions = {}
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
  options: SwcReadMeshNodeOptions = {}
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
  options: SwcWriteMeshNodeOptions = {}
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
  options: VtkPolyDataReadMeshNodeOptions = {}
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
  options: VtkPolyDataWriteMeshNodeOptions = {}
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
  options: WasmReadMeshNodeOptions = {}
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
  options: WasmWriteMeshNodeOptions = {}
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

#### wasmZstdReadMeshNode

*Read a mesh file format and convert it to the itk-wasm file format*

```ts
async function wasmZstdReadMeshNode(
  serializedMesh: string,
  options: WasmZstdReadMeshNodeOptions = {}
) : Promise<WasmZstdReadMeshNodeResult>
```

|     Parameter    |   Type   | Description                              |
| :--------------: | :------: | :--------------------------------------- |
| `serializedMesh` | *string* | Input mesh serialized in the file format |

**`WasmZstdReadMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`WasmZstdReadMeshNodeResult` interface:**

|   Property  |       Type       | Description                                                              |
| :---------: | :--------------: | :----------------------------------------------------------------------- |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output mesh is not valid. |
|    `mesh`   |      *Mesh*      | Output mesh                                                              |

#### wasmZstdWriteMeshNode

*Write an itk-wasm file format converted to an mesh file format*

```ts
async function wasmZstdWriteMeshNode(
  mesh: Mesh,
  serializedMesh: string,
  options: WasmZstdWriteMeshNodeOptions = {}
) : Promise<WasmZstdWriteMeshNodeResult>
```

|     Parameter    |   Type   | Description |
| :--------------: | :------: | :---------- |
|      `mesh`      |  *Mesh*  | Input mesh  |
| `serializedMesh` | *string* | Output mesh |

**`WasmZstdWriteMeshNodeOptions` interface:**

|      Property     |    Type   | Description                                              |
| :---------------: | :-------: | :------------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data.    |
|  `useCompression` | *boolean* | Use compression in the written file, if supported        |
|  `binaryFileType` | *boolean* | Use a binary file type in the written file, if supported |

**`WasmZstdWriteMeshNodeResult` interface:**

|     Property     |       Type       | Description                                                                 |
| :--------------: | :--------------: | :-------------------------------------------------------------------------- |
|   `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output mesh is not valid. |
| `serializedMesh` |   *BinaryFile*   | Output mesh                                                                 |
