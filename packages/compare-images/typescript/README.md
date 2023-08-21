# @itk-wasm/compare-images

[![npm version](https://badge.fury.io/js/@itk-wasm%2Fcompare-images.svg)](https://www.npmjs.com/package/@itk-wasm/compare-images)

> Compare images with a tolerance for regression testing.

## Installation

```sh
npm install @itk-wasm/compare-images
```

## Usage

### Browser interface

Import:

```js
import {
  compareDoubleImages,
  setPipelinesBaseUrl,
  getPipelinesBaseUrl,
  setPipelineWorkerUrl,
  getPipelineWorkerUrl,
} from "@itk-wasm/compare-images"
```

#### compareDoubleImages

*Compare double pixel type images with a tolerance for regression testing.*

```ts
async function compareDoubleImages(
  webWorker: null | Worker,
  testImage: Image,
  options: CompareDoubleImagesOptions = { baselineImages: [] as Image[], }
) : Promise<CompareDoubleImagesResult>
```

|  Parameter  |   Type  | Description          |
| :---------: | :-----: | :------------------- |
| `testImage` | *Image* | The input test image |

**`CompareDoubleImagesOptions` interface:**

|          Property         |    Type   | Description                                                                                                      |
| :-----------------------: | :-------: | :--------------------------------------------------------------------------------------------------------------- |
|      `baselineImages`     | *Image[]* | Baseline images compare against                                                                                  |
|   `differenceThreshold`   |  *number* | Intensity difference for pixels to be considered different.                                                      |
|     `radiusTolerance`     |  *number* | Radius of the neighborhood around a pixel to search for similar intensity values.                                |
| `numberOfPixelsTolerance` |  *number* | Number of pixels that can be different before the test fails.                                                    |
|   `ignoreBoundaryPixels`  | *boolean* | Ignore boundary pixels. Useful when resampling may have introduced difference pixel values along the image edge. |

**`CompareDoubleImagesResult` interface:**

|         Property         |   Type   | Description                                                                       |
| :----------------------: | :------: | :-------------------------------------------------------------------------------- |
|       **webWorker**      | *Worker* | WebWorker used for computation                                                    |
|         `metrics`        | *Object* | Metrics for the baseline with the fewest number of pixels outside the tolerances. |
|     `differenceImage`    |  *Image* | Absolute difference image                                                         |
| `differenceUchar2dImage` |  *Image* | Unsigned char, 2D difference image for rendering                                  |

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

#### setPipelineWorkerUrl

*Set base URL for the itk-wasm pipeline worker script when vendored.*

```ts
function setPipelineWorkerUrl(
  baseUrl: string | URL
) : void
```

#### getPipelineWorkerUrl

*Get base URL for the itk-wasm pipeline worker script when vendored.*

```ts
function getPipelineWorkerUrl() : string | URL
```

### Node interface

Import:

```js
import {
  compareDoubleImagesNode,
  setPipelinesBaseUrl,
  getPipelinesBaseUrl,
  setPipelineWorkerUrl,
  getPipelineWorkerUrl,
} from "@itk-wasm/compare-images"
```

#### compareDoubleImagesNode

*Compare double pixel type images with a tolerance for regression testing.*

```ts
async function compareDoubleImagesNode(
  testImage: Image,
  options: CompareDoubleImagesOptions = { baselineImages: [] as Image[], }
) : Promise<CompareDoubleImagesNodeResult>
```

|  Parameter  |   Type  | Description          |
| :---------: | :-----: | :------------------- |
| `testImage` | *Image* | The input test image |

**`CompareDoubleImagesNodeOptions` interface:**

|          Property         |    Type   | Description                                                                                                      |
| :-----------------------: | :-------: | :--------------------------------------------------------------------------------------------------------------- |
|      `baselineImages`     | *Image[]* | Baseline images compare against                                                                                  |
|   `differenceThreshold`   |  *number* | Intensity difference for pixels to be considered different.                                                      |
|     `radiusTolerance`     |  *number* | Radius of the neighborhood around a pixel to search for similar intensity values.                                |
| `numberOfPixelsTolerance` |  *number* | Number of pixels that can be different before the test fails.                                                    |
|   `ignoreBoundaryPixels`  | *boolean* | Ignore boundary pixels. Useful when resampling may have introduced difference pixel values along the image edge. |

**`CompareDoubleImagesNodeResult` interface:**

|         Property         |   Type   | Description                                                                       |
| :----------------------: | :------: | :-------------------------------------------------------------------------------- |
|         `metrics`        | *Object* | Metrics for the baseline with the fewest number of pixels outside the tolerances. |
|     `differenceImage`    |  *Image* | Absolute difference image                                                         |
| `differenceUchar2dImage` |  *Image* | Unsigned char, 2D difference image for rendering                                  |
