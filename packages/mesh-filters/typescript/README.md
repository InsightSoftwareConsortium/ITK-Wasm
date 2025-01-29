# @itk-wasm/mesh-filters

[![npm version](https://badge.fury.io/js/@itk-wasm%2Fmesh-filters.svg)](https://www.npmjs.com/package/@itk-wasm/mesh-filters)

> Mesh filters to repair, remesh, subdivide, decimate, smooth, triangulate, etc.

## Installation

```sh
npm install @itk-wasm/mesh-filters
```

## Usage

### Browser interface

Import:

```js
import {
  geogramConversion,
  keepLargestComponent,
  repair,
  sliceMesh,
  smoothRemesh,
  setPipelinesBaseUrl,
  getPipelinesBaseUrl,
} from "@itk-wasm/mesh-filters"
```

#### geogramConversion

*A test for reading and writing with geogram, itk::QuadEdgeMesh meshes*

```ts
async function geogramConversion(
  inputMesh: Mesh,
  options: GeogramConversionOptions = {}
) : Promise<GeogramConversionResult>
```

|  Parameter  |  Type  | Description    |
| :---------: | :----: | :------------- |
| `inputMesh` | *Mesh* | The input mesh |

**`GeogramConversionOptions` interface:**

|   Property  |             Type            | Description                                                                                                                                           |
| :---------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `webWorker` | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|   `noCopy`  |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`GeogramConversionResult` interface:**

|   Property   |   Type   | Description                     |
| :----------: | :------: | :------------------------------ |
| `outputMesh` |  *Mesh*  | The output mesh                 |
|  `webWorker` | *Worker* | WebWorker used for computation. |

#### keepLargestComponent

*Keep only the largest component in the mesh.*

```ts
async function keepLargestComponent(
  inputMesh: Mesh,
  options: KeepLargestComponentOptions = {}
) : Promise<KeepLargestComponentResult>
```

|  Parameter  |  Type  | Description     |
| :---------: | :----: | :-------------- |
| `inputMesh` | *Mesh* | The input mesh. |

**`KeepLargestComponentOptions` interface:**

|   Property  |             Type            | Description                                                                                                                                           |
| :---------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `webWorker` | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|   `noCopy`  |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`KeepLargestComponentResult` interface:**

|   Property   |   Type   | Description                                      |
| :----------: | :------: | :----------------------------------------------- |
| `outputMesh` |  *Mesh*  | The output mesh with only the largest component. |
|  `webWorker` | *Worker* | WebWorker used for computation.                  |

#### repair

*Repair a mesh so it is 2-manifold and optionally watertight.*

```ts
async function repair(
  inputMesh: Mesh,
  options: RepairOptions = {}
) : Promise<RepairResult>
```

|  Parameter  |  Type  | Description    |
| :---------: | :----: | :------------- |
| `inputMesh` | *Mesh* | The input mesh |

**`RepairOptions` interface:**

|            Property           |             Type            | Description                                                                                                                                           |
| :---------------------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|        `mergeTolerance`       |           *number*          | Point merging tolerance as a percent of the bounding box diagonal.                                                                                    |
|     `minimumComponentArea`    |           *number*          | Minimum component area as a percent of the total area. Components smaller than this are removed.                                                      |
|       `maximumHoleArea`       |           *number*          | Maximum area of a hole as a percent of the total area. Holes smaller than this are filled.                                                            |
|       `maximumHoleEdges`      |           *number*          | Maximum number of edges in a hole. Holes with fewer edges than this are filled.                                                                       |
|    `maximumDegree3Distance`   |           *number*          | Maximum distance as a percent of the bounding box diagonal. Vertices with degree 3 that are closer than this are merged.                              |
| `removeIntersectingTriangles` |          *boolean*          | Remove intersecting triangles.                                                                                                                        |
|          `webWorker`          | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|            `noCopy`           |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`RepairResult` interface:**

|   Property   |   Type   | Description                     |
| :----------: | :------: | :------------------------------ |
| `outputMesh` |  *Mesh*  | The output repaired mesh.       |
|  `webWorker` | *Worker* | WebWorker used for computation. |

#### sliceMesh

*Slice a mesh along planes into polylines.*

```ts
async function sliceMesh(
  inputMesh: Mesh,
  planes: JsonCompatible,
  options: SliceMeshOptions = {}
) : Promise<SliceMeshResult>
```

|  Parameter  |       Type       | Description                                                                                                        |
| :---------: | :--------------: | :----------------------------------------------------------------------------------------------------------------- |
| `inputMesh` |      *Mesh*      | The input triangle mesh.                                                                                           |
|   `planes`  | *JsonCompatible* | An array of plane locations to slice the mesh. Each plane is defined by an array of 'origin' and 'spacing' values. |

**`SliceMeshOptions` interface:**

|   Property  |             Type            | Description                                                                                                                                           |
| :---------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `webWorker` | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|   `noCopy`  |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`SliceMeshResult` interface:**

|   Property  |   Type   | Description                                                                                                                      |
| :---------: | :------: | :------------------------------------------------------------------------------------------------------------------------------- |
| `polylines` |  *Mesh*  | The output mesh comprised of polylines. Cell data indicates whether part of a closed line. Point data indicates the slice index. |
| `webWorker` | *Worker* | WebWorker used for computation.                                                                                                  |

#### smoothRemesh

*Smooth and remesh a mesh to improve quality.*

```ts
async function smoothRemesh(
  inputMesh: Mesh,
  options: SmoothRemeshOptions = {}
) : Promise<SmoothRemeshResult>
```

|  Parameter  |  Type  | Description    |
| :---------: | :----: | :------------- |
| `inputMesh` | *Mesh* | The input mesh |

**`SmoothRemeshOptions` interface:**

|          Property         |             Type            | Description                                                                                                                                           |
| :-----------------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|       `numberPoints`      |           *number*          | Number of points as a percent of the bounding box diagonal. Output may have slightly more points.                                                     |
| `triangleShapeAdaptation` |           *number*          | Triangle shape adaptation factor. Use 0.0 to disable.                                                                                                 |
|  `triangleSizeAdaptation` |           *number*          | Triangle size adaptation factor. Use 0.0 to disable.                                                                                                  |
|     `normalIterations`    |           *number*          | Number of normal smoothing iterations.                                                                                                                |
|     `lloydIterations`     |           *number*          | Number of Lloyd relaxation iterations.                                                                                                                |
|     `newtonIterations`    |           *number*          | Number of Newton iterations.                                                                                                                          |
|         `newtonM`         |           *number*          | Number of Newton evaluations per step for Hessian approximation.                                                                                      |
|        `lfsSamples`       |           *number*          | Number of samples for size adaptation if triangle size adaptation is not 0.0.                                                                         |
|        `webWorker`        | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|          `noCopy`         |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`SmoothRemeshResult` interface:**

|   Property   |   Type   | Description                     |
| :----------: | :------: | :------------------------------ |
| `outputMesh` |  *Mesh*  | The output repaired mesh.       |
|  `webWorker` | *Worker* | WebWorker used for computation. |

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
  geogramConversionNode,
  keepLargestComponentNode,
  repairNode,
  sliceMeshNode,
  smoothRemeshNode,
} from "@itk-wasm/mesh-filters"
```

#### geogramConversionNode

*A test for reading and writing with geogram, itk::QuadEdgeMesh meshes*

```ts
async function geogramConversionNode(
  inputMesh: Mesh
) : Promise<GeogramConversionNodeResult>
```

|  Parameter  |  Type  | Description    |
| :---------: | :----: | :------------- |
| `inputMesh` | *Mesh* | The input mesh |

**`GeogramConversionNodeResult` interface:**

|   Property   |  Type  | Description     |
| :----------: | :----: | :-------------- |
| `outputMesh` | *Mesh* | The output mesh |

#### keepLargestComponentNode

*Keep only the largest component in the mesh.*

```ts
async function keepLargestComponentNode(
  inputMesh: Mesh
) : Promise<KeepLargestComponentNodeResult>
```

|  Parameter  |  Type  | Description     |
| :---------: | :----: | :-------------- |
| `inputMesh` | *Mesh* | The input mesh. |

**`KeepLargestComponentNodeResult` interface:**

|   Property   |  Type  | Description                                      |
| :----------: | :----: | :----------------------------------------------- |
| `outputMesh` | *Mesh* | The output mesh with only the largest component. |

#### repairNode

*Repair a mesh so it is 2-manifold and optionally watertight.*

```ts
async function repairNode(
  inputMesh: Mesh,
  options: RepairNodeOptions = {}
) : Promise<RepairNodeResult>
```

|  Parameter  |  Type  | Description    |
| :---------: | :----: | :------------- |
| `inputMesh` | *Mesh* | The input mesh |

**`RepairNodeOptions` interface:**

|            Property           |    Type   | Description                                                                                                              |
| :---------------------------: | :-------: | :----------------------------------------------------------------------------------------------------------------------- |
|        `mergeTolerance`       |  *number* | Point merging tolerance as a percent of the bounding box diagonal.                                                       |
|     `minimumComponentArea`    |  *number* | Minimum component area as a percent of the total area. Components smaller than this are removed.                         |
|       `maximumHoleArea`       |  *number* | Maximum area of a hole as a percent of the total area. Holes smaller than this are filled.                               |
|       `maximumHoleEdges`      |  *number* | Maximum number of edges in a hole. Holes with fewer edges than this are filled.                                          |
|    `maximumDegree3Distance`   |  *number* | Maximum distance as a percent of the bounding box diagonal. Vertices with degree 3 that are closer than this are merged. |
| `removeIntersectingTriangles` | *boolean* | Remove intersecting triangles.                                                                                           |

**`RepairNodeResult` interface:**

|   Property   |  Type  | Description               |
| :----------: | :----: | :------------------------ |
| `outputMesh` | *Mesh* | The output repaired mesh. |

#### sliceMeshNode

*Slice a mesh along planes into polylines.*

```ts
async function sliceMeshNode(
  inputMesh: Mesh,
  planes: JsonCompatible
) : Promise<SliceMeshNodeResult>
```

|  Parameter  |       Type       | Description                                                                                                        |
| :---------: | :--------------: | :----------------------------------------------------------------------------------------------------------------- |
| `inputMesh` |      *Mesh*      | The input triangle mesh.                                                                                           |
|   `planes`  | *JsonCompatible* | An array of plane locations to slice the mesh. Each plane is defined by an array of 'origin' and 'spacing' values. |

**`SliceMeshNodeResult` interface:**

|   Property  |  Type  | Description                                                                                                                      |
| :---------: | :----: | :------------------------------------------------------------------------------------------------------------------------------- |
| `polylines` | *Mesh* | The output mesh comprised of polylines. Cell data indicates whether part of a closed line. Point data indicates the slice index. |

#### smoothRemeshNode

*Smooth and remesh a mesh to improve quality.*

```ts
async function smoothRemeshNode(
  inputMesh: Mesh,
  options: SmoothRemeshNodeOptions = {}
) : Promise<SmoothRemeshNodeResult>
```

|  Parameter  |  Type  | Description    |
| :---------: | :----: | :------------- |
| `inputMesh` | *Mesh* | The input mesh |

**`SmoothRemeshNodeOptions` interface:**

|          Property         |   Type   | Description                                                                                       |
| :-----------------------: | :------: | :------------------------------------------------------------------------------------------------ |
|       `numberPoints`      | *number* | Number of points as a percent of the bounding box diagonal. Output may have slightly more points. |
| `triangleShapeAdaptation` | *number* | Triangle shape adaptation factor. Use 0.0 to disable.                                             |
|  `triangleSizeAdaptation` | *number* | Triangle size adaptation factor. Use 0.0 to disable.                                              |
|     `normalIterations`    | *number* | Number of normal smoothing iterations.                                                            |
|     `lloydIterations`     | *number* | Number of Lloyd relaxation iterations.                                                            |
|     `newtonIterations`    | *number* | Number of Newton iterations.                                                                      |
|         `newtonM`         | *number* | Number of Newton evaluations per step for Hessian approximation.                                  |
|        `lfsSamples`       | *number* | Number of samples for size adaptation if triangle size adaptation is not 0.0.                     |

**`SmoothRemeshNodeResult` interface:**

|   Property   |  Type  | Description               |
| :----------: | :----: | :------------------------ |
| `outputMesh` | *Mesh* | The output repaired mesh. |
