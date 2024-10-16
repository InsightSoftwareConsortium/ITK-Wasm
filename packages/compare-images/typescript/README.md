# @itk-wasm/compare-images

[![npm version](https://badge.fury.io/js/@itk-wasm%2Fcompare-images.svg)](https://www.npmjs.com/package/@itk-wasm/compare-images)

> Compare images with a tolerance for regression testing.

[👨‍💻 **Live API Demo** ✨](https://insightsoftwareconsortium.github.io/ITK-Wasm/compare-images/ts/app/ ':include :type=iframe width=100% height=800px')

[🕮 **Documentation** 📚](https://insightsoftwareconsortium.github.io/ITK-Wasm/compare-images/ts/docs/)


## Installation

```sh
npm install @itk-wasm/compare-images
```

## Usage

### Browser interface

Import:

```js
import {
  compareImages,
  setPipelinesBaseUrl,
  getPipelinesBaseUrl,
} from "@itk-wasm/compare-images"
```

#### compareImages

*Compare images with a tolerance for regression testing.*

```ts
async function compareImages(
  testImage: Image,
  options: CompareImagesOptions = { baselineImages: [] as Image[], }
) : Promise<CompareImagesResult>
```

|  Parameter  |   Type  | Description          |
| :---------: | :-----: | :------------------- |
| `testImage` | *Image* | The input test image |

**`CompareImagesOptions` interface:**

|          Property         |             Type            | Description                                                                                                                                           |
| :-----------------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|      `baselineImages`     |          *Image[]*          | Baseline images compare against                                                                                                                       |
|   `differenceThreshold`   |           *number*          | Intensity difference for pixels to be considered different.                                                                                           |
|     `radiusTolerance`     |           *number*          | Radius of the neighborhood around a pixel to search for similar intensity values.                                                                     |
| `numberOfPixelsTolerance` |           *number*          | Number of pixels that can be different before the test fails.                                                                                         |
|   `ignoreBoundaryPixels`  |          *boolean*          | Ignore boundary pixels. Useful when resampling may have introduced difference pixel values along the image edge.                                      |
|        `webWorker`        | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|          `noCopy`         |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CompareImagesResult` interface:**

|         Property         |       Type       | Description                                                                       |
| :----------------------: | :--------------: | :-------------------------------------------------------------------------------- |
|         `metrics`        | *JsonCompatible* | Metrics for the baseline with the fewest number of pixels outside the tolerances. |
|     `differenceImage`    |      *Image*     | Absolute difference image                                                         |
| `differenceUchar2dImage` |      *Image*     | Unsigned char, 2D difference image for rendering                                  |
|        `webWorker`       |     *Worker*     | WebWorker used for computation.                                                   |

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
  compareImagesNode,
} from "@itk-wasm/compare-images"
```

#### compareImagesNode

*Compare images with a tolerance for regression testing.*

```ts
async function compareImagesNode(
  testImage: Image,
  options: CompareImagesOptions = { baselineImages: [] as Image[], }
) : Promise<CompareImagesNodeResult>
```

|  Parameter  |   Type  | Description          |
| :---------: | :-----: | :------------------- |
| `testImage` | *Image* | The input test image |

**`CompareImagesNodeOptions` interface:**

|          Property         |    Type   | Description                                                                                                      |
| :-----------------------: | :-------: | :--------------------------------------------------------------------------------------------------------------- |
|      `baselineImages`     | *Image[]* | Baseline images compare against                                                                                  |
|   `differenceThreshold`   |  *number* | Intensity difference for pixels to be considered different.                                                      |
|     `radiusTolerance`     |  *number* | Radius of the neighborhood around a pixel to search for similar intensity values.                                |
| `numberOfPixelsTolerance` |  *number* | Number of pixels that can be different before the test fails.                                                    |
|   `ignoreBoundaryPixels`  | *boolean* | Ignore boundary pixels. Useful when resampling may have introduced difference pixel values along the image edge. |

**`CompareImagesNodeResult` interface:**

|         Property         |       Type       | Description                                                                       |
| :----------------------: | :--------------: | :-------------------------------------------------------------------------------- |
|         `metrics`        | *JsonCompatible* | Metrics for the baseline with the fewest number of pixels outside the tolerances. |
|     `differenceImage`    |      *Image*     | Absolute difference image                                                         |
| `differenceUchar2dImage` |      *Image*     | Unsigned char, 2D difference image for rendering                                  |


