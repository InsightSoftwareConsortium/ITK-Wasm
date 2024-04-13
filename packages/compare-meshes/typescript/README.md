# @itk-wasm/compare-meshes

[![npm version](https://badge.fury.io/js/@itk-wasm%2Fcompare-meshes.svg)](https://www.npmjs.com/package/@itk-wasm/compare-meshes)

> Compare meshes and polydata for regression testing.

## Installation

```sh
npm install @itk-wasm/compare-meshes
```

## Usage

### Browser interface

Import:

```js
import {
  compareMeshes,
  setPipelinesBaseUrl,
  getPipelinesBaseUrl,
} from "@itk-wasm/compare-meshes"
```

#### compareMeshes

*Compare meshes with a tolerance for regression testing.*

```ts
async function compareMeshes(
  testMesh: Mesh,
  options: CompareMeshesOptions = { baselineMeshes: [] as Mesh[], }
) : Promise<CompareMeshesResult>
```

|  Parameter |  Type  | Description         |
| :--------: | :----: | :------------------ |
| `testMesh` | *Mesh* | The input test mesh |

**`CompareMeshesOptions` interface:**

|              Property              |             Type            | Description                                                                                                                                           |
| :--------------------------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|          `baselineMeshes`          |           *Mesh[]*          | Baseline images to compare against                                                                                                                    |
|     `pointsDifferenceThreshold`    |           *number*          | Difference for point components to be considered different.                                                                                           |
| `numberOfDifferentPointsTolerance` |           *number*          | Number of points whose points exceed the difference threshold that can be different before the test fails.                                            |
|   `pointDataDifferenceThreshold`   |           *number*          | Difference for point data components to be considered different.                                                                                      |
|    `numberOfPointDataTolerance`    |           *number*          | Number of point data that can exceed the difference threshold before the test fails.                                                                  |
|    `cellDataDifferenceThreshold`   |           *number*          | Difference for cell data components to be considered different.                                                                                       |
|     `numberOfCellDataTolerance`    |           *number*          | Number of cell data that can exceed the difference threshold before the test fails.                                                                   |
|             `webWorker`            | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|              `noCopy`              |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CompareMeshesResult` interface:**

|          Property         |       Type       | Description                                                                                 |
| :-----------------------: | :--------------: | :------------------------------------------------------------------------------------------ |
|         `metrics`         | *JsonCompatible* | Metrics for the closest baseline.                                                           |
|   `pointsDifferenceMesh`  |      *Mesh*      | Mesh with the differences between the points of the test mesh and the closest baseline.     |
| `pointDataDifferenceMesh` |      *Mesh*      | Mesh with the differences between the point data of the test mesh and the closest baseline. |
|  `cellDataDifferenceMesh` |      *Mesh*      | Mesh with the differences between the cell data of the test mesh and the closest baseline.  |
|        `webWorker`        |     *Worker*     | WebWorker used for computation.                                                             |

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
  compareMeshesNode,
} from "@itk-wasm/compare-meshes"
```

#### compareMeshesNode

*Compare meshes with a tolerance for regression testing.*

```ts
async function compareMeshesNode(
  testMesh: Mesh,
  options: CompareMeshesNodeOptions = { baselineMeshes: [] as Mesh[], }
) : Promise<CompareMeshesNodeResult>
```

|  Parameter |  Type  | Description         |
| :--------: | :----: | :------------------ |
| `testMesh` | *Mesh* | The input test mesh |

**`CompareMeshesNodeOptions` interface:**

|              Property              |   Type   | Description                                                                                                |
| :--------------------------------: | :------: | :--------------------------------------------------------------------------------------------------------- |
|          `baselineMeshes`          | *Mesh[]* | Baseline images to compare against                                                                         |
|     `pointsDifferenceThreshold`    | *number* | Difference for point components to be considered different.                                                |
| `numberOfDifferentPointsTolerance` | *number* | Number of points whose points exceed the difference threshold that can be different before the test fails. |
|   `pointDataDifferenceThreshold`   | *number* | Difference for point data components to be considered different.                                           |
|    `numberOfPointDataTolerance`    | *number* | Number of point data that can exceed the difference threshold before the test fails.                       |
|    `cellDataDifferenceThreshold`   | *number* | Difference for cell data components to be considered different.                                            |
|     `numberOfCellDataTolerance`    | *number* | Number of cell data that can exceed the difference threshold before the test fails.                        |

**`CompareMeshesNodeResult` interface:**

|          Property         |       Type       | Description                                                                                 |
| :-----------------------: | :--------------: | :------------------------------------------------------------------------------------------ |
|         `metrics`         | *JsonCompatible* | Metrics for the closest baseline.                                                           |
|   `pointsDifferenceMesh`  |      *Mesh*      | Mesh with the differences between the points of the test mesh and the closest baseline.     |
| `pointDataDifferenceMesh` |      *Mesh*      | Mesh with the differences between the point data of the test mesh and the closest baseline. |
|  `cellDataDifferenceMesh` |      *Mesh*      | Mesh with the differences between the cell data of the test mesh and the closest baseline.  |
