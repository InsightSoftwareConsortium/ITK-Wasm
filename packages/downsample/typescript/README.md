# @itk-wasm/downsample

[![npm version](https://badge.fury.io/js/@itk-wasm%2Fdownsample.svg)](https://www.npmjs.com/package/@itk-wasm/downsample)

> Pipelines for downsampling images.

[💻 **Live API Demo** ✨](https://insightsoftwareconsortium.github.io/itk-wasm/downsample/ts/docs/
 ':include :type=iframe width=100% height=800px')

[🕮 **Documentation** 📚](https://insightsoftwareconsortium.github.io/itk-wasm/downsample/ts/docs/)

## Installation

```sh
npm install @itk-wasm/downsample
```

## Usage

### Browser interface

Import:

```js
import {
  downsampleBinShrink,
  downsampleLabelImage,
  downsampleSigma,
  downsample,
  gaussianKernelRadius,
  setPipelinesBaseUrl,
  getPipelinesBaseUrl,
} from "@itk-wasm/downsample"
```

#### downsampleBinShrink

*Apply local averaging and subsample the input image.*

```ts
async function downsampleBinShrink(
  input: Image,
  options: DownsampleBinShrinkOptions = { shrinkFactors: [] as number[], }
) : Promise<DownsampleBinShrinkResult>
```

| Parameter |   Type  | Description |
| :-------: | :-----: | :---------- |
|  `input`  | *Image* | Input image |

**`DownsampleBinShrinkOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|  `shrinkFactors`  |          *number[]*         | Shrink factors                                                                                                                                        |
| `informationOnly` |          *boolean*          | Generate output image information only. Do not process pixels.                                                                                        |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`DownsampleBinShrinkResult` interface:**

|    Property   |   Type   | Description                     |
| :-----------: | :------: | :------------------------------ |
| `downsampled` |  *Image* | Output downsampled image        |
|  `webWorker`  | *Worker* | WebWorker used for computation. |

#### downsampleLabelImage

*Apply a smoothing anti-alias filter and subsample the input image.*

```ts
async function downsampleLabelImage(
  input: Image,
  options: DownsampleLabelImageOptions = { shrinkFactors: [] as number[], }
) : Promise<DownsampleLabelImageResult>
```

| Parameter |   Type  | Description |
| :-------: | :-----: | :---------- |
|  `input`  | *Image* | Input image |

**`DownsampleLabelImageOptions` interface:**

|     Property    |             Type            | Description                                                                                                                                           |
| :-------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shrinkFactors` |          *number[]*         | Shrink factors                                                                                                                                        |
|   `cropRadius`  |          *number[]*         | Optional crop radius in pixel units.                                                                                                                  |
|   `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`    |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`DownsampleLabelImageResult` interface:**

|    Property   |   Type   | Description                     |
| :-----------: | :------: | :------------------------------ |
| `downsampled` |  *Image* | Output downsampled image        |
|  `webWorker`  | *Worker* | WebWorker used for computation. |

#### downsampleSigma

*Compute gaussian kernel sigma values in pixel units for downsampling.*

```ts
async function downsampleSigma(
  options: DownsampleSigmaOptions = { shrinkFactors: [] as number[], }
) : Promise<DownsampleSigmaResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`DownsampleSigmaOptions` interface:**

|     Property    |             Type            | Description                                                                                                                                           |
| :-------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shrinkFactors` |          *number[]*         | Shrink factors                                                                                                                                        |
|   `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`    |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`DownsampleSigmaResult` interface:**

|   Property  |       Type       | Description                     |
| :---------: | :--------------: | :------------------------------ |
|   `sigma`   | *JsonCompatible* | Output sigmas in pixel units.   |
| `webWorker` |     *Worker*     | WebWorker used for computation. |

#### downsample

*Apply a smoothing anti-alias filter and subsample the input image.*

```ts
async function downsample(
  input: Image,
  options: DownsampleOptions = { shrinkFactors: [] as number[], }
) : Promise<DownsampleResult>
```

| Parameter |   Type  | Description |
| :-------: | :-----: | :---------- |
|  `input`  | *Image* | Input image |

**`DownsampleOptions` interface:**

|     Property    |             Type            | Description                                                                                                                                           |
| :-------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shrinkFactors` |          *number[]*         | Shrink factors                                                                                                                                        |
|   `cropRadius`  |          *number[]*         | Optional crop radius in pixel units.                                                                                                                  |
|   `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`    |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`DownsampleResult` interface:**

|    Property   |   Type   | Description                     |
| :-----------: | :------: | :------------------------------ |
| `downsampled` |  *Image* | Output downsampled image        |
|  `webWorker`  | *Worker* | WebWorker used for computation. |

#### gaussianKernelRadius

*Radius in pixels required for effective discrete gaussian filtering.*

```ts
async function gaussianKernelRadius(
  options: GaussianKernelRadiusOptions = { size: [] as number[], sigma: [{}, ], }
) : Promise<GaussianKernelRadiusResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`GaussianKernelRadiusOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|      `size`      |          *number[]*         | Size in pixels                                                                                                                                        |
|      `sigma`     |          *number[]*         | Sigma in pixel units                                                                                                                                  |
| `maxKernelWidth` |           *number*          | Maximum kernel width in pixels.                                                                                                                       |
| `maxKernelError` |           *number*          | Maximum kernel error.                                                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`GaussianKernelRadiusResult` interface:**

|   Property  |       Type       | Description                     |
| :---------: | :--------------: | :------------------------------ |
|   `radius`  | *JsonCompatible* | Output kernel radius.           |
| `webWorker` |     *Worker*     | WebWorker used for computation. |

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
  downsampleBinShrinkNode,
  downsampleLabelImageNode,
  downsampleSigmaNode,
  downsampleNode,
  gaussianKernelRadiusNode,
} from "@itk-wasm/downsample"
```

#### downsampleBinShrinkNode

*Apply local averaging and subsample the input image.*

```ts
async function downsampleBinShrinkNode(
  input: Image,
  options: DownsampleBinShrinkNodeOptions = { shrinkFactors: [] as number[], }
) : Promise<DownsampleBinShrinkNodeResult>
```

| Parameter |   Type  | Description |
| :-------: | :-----: | :---------- |
|  `input`  | *Image* | Input image |

**`DownsampleBinShrinkNodeOptions` interface:**

|      Property     |    Type    | Description                                                    |
| :---------------: | :--------: | :------------------------------------------------------------- |
|  `shrinkFactors`  | *number[]* | Shrink factors                                                 |
| `informationOnly` |  *boolean* | Generate output image information only. Do not process pixels. |

**`DownsampleBinShrinkNodeResult` interface:**

|    Property   |   Type  | Description              |
| :-----------: | :-----: | :----------------------- |
| `downsampled` | *Image* | Output downsampled image |

#### downsampleLabelImageNode

*Apply a smoothing anti-alias filter and subsample the input image.*

```ts
async function downsampleLabelImageNode(
  input: Image,
  options: DownsampleLabelImageNodeOptions = { shrinkFactors: [] as number[], }
) : Promise<DownsampleLabelImageNodeResult>
```

| Parameter |   Type  | Description |
| :-------: | :-----: | :---------- |
|  `input`  | *Image* | Input image |

**`DownsampleLabelImageNodeOptions` interface:**

|     Property    |    Type    | Description                          |
| :-------------: | :--------: | :----------------------------------- |
| `shrinkFactors` | *number[]* | Shrink factors                       |
|   `cropRadius`  | *number[]* | Optional crop radius in pixel units. |

**`DownsampleLabelImageNodeResult` interface:**

|    Property   |   Type  | Description              |
| :-----------: | :-----: | :----------------------- |
| `downsampled` | *Image* | Output downsampled image |

#### downsampleSigmaNode

*Compute gaussian kernel sigma values in pixel units for downsampling.*

```ts
async function downsampleSigmaNode(
  options: DownsampleSigmaNodeOptions = { shrinkFactors: [] as number[], }
) : Promise<DownsampleSigmaNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`DownsampleSigmaNodeOptions` interface:**

|     Property    |    Type    | Description    |
| :-------------: | :--------: | :------------- |
| `shrinkFactors` | *number[]* | Shrink factors |

**`DownsampleSigmaNodeResult` interface:**

| Property |       Type       | Description                   |
| :------: | :--------------: | :---------------------------- |
|  `sigma` | *JsonCompatible* | Output sigmas in pixel units. |

#### downsampleNode

*Apply a smoothing anti-alias filter and subsample the input image.*

```ts
async function downsampleNode(
  input: Image,
  options: DownsampleNodeOptions = { shrinkFactors: [] as number[], }
) : Promise<DownsampleNodeResult>
```

| Parameter |   Type  | Description |
| :-------: | :-----: | :---------- |
|  `input`  | *Image* | Input image |

**`DownsampleNodeOptions` interface:**

|     Property    |    Type    | Description                          |
| :-------------: | :--------: | :----------------------------------- |
| `shrinkFactors` | *number[]* | Shrink factors                       |
|   `cropRadius`  | *number[]* | Optional crop radius in pixel units. |

**`DownsampleNodeResult` interface:**

|    Property   |   Type  | Description              |
| :-----------: | :-----: | :----------------------- |
| `downsampled` | *Image* | Output downsampled image |

#### gaussianKernelRadiusNode

*Radius in pixels required for effective discrete gaussian filtering.*

```ts
async function gaussianKernelRadiusNode(
  options: GaussianKernelRadiusNodeOptions = { size: [] as number[], sigma: [{}, ], }
) : Promise<GaussianKernelRadiusNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`GaussianKernelRadiusNodeOptions` interface:**

|     Property     |    Type    | Description                     |
| :--------------: | :--------: | :------------------------------ |
|      `size`      | *number[]* | Size in pixels                  |
|      `sigma`     | *number[]* | Sigma in pixel units            |
| `maxKernelWidth` |  *number*  | Maximum kernel width in pixels. |
| `maxKernelError` |  *number*  | Maximum kernel error.           |

**`GaussianKernelRadiusNodeResult` interface:**

| Property |       Type       | Description           |
| :------: | :--------------: | :-------------------- |
| `radius` | *JsonCompatible* | Output kernel radius. |
