# @itk-wasm/transform

[![npm version](https://badge.fury.io/js/@itk-wasm%2Ftransform.svg)](https://www.npmjs.com/package/@itk-wasm/transform)

> Common operations with and on spatial transformations.

## Installation

```sh
npm install @itk-wasm/transform
```

## Usage

### Browser interface

Import:

```js
import {
  affineOps,
  createAffineTransform,
  createAzimuthElevationToCartesianTransform,
  createBsplineSmoothingOnUpdateDisplacementFieldTransform,
  createBsplineTransform,
  createCompositeTransform,
  createConstantVelocityFieldTransform,
  createDisplacementFieldTransform,
  createEuler2dTransform,
  createEuler3dTransform,
  createGaussianExponentialDiffeomorphicTransform,
  createGaussianSmoothingOnUpdateDisplacementFieldTransform,
  createGaussianSmoothingOnUpdateTimeVaryingVelocityFieldTransform,
  createIdentityTransform,
  createQuaternionRigidTransform,
  createRigid2dTransform,
  createRigid3dPerspectiveTransform,
  createRigid3dTransform,
  createScalableAffineTransform,
  createScaleLogarithmicTransform,
  createScaleSkewVersor3dTransform,
  createScaleTransform,
  createSimilarity2dTransform,
  createSimilarity3dTransform,
  createTimeVaryingVelocityFieldTransform,
  createTranslationTransform,
  createVelocityFieldTransform,
  createVersorRigid3dTransform,
  createVersorTransform,
  setPipelinesBaseUrl,
  getPipelinesBaseUrl,
} from "@itk-wasm/transform"
```

#### affineOps

*Apply operations to an affine transform*

```ts
async function affineOps(
  inputTransform: TransformList,
  operations: JsonCompatible,
  options: AffineOpsOptions = {}
) : Promise<AffineOpsResult>
```

|     Parameter    |       Type       | Description                       |
| :--------------: | :--------------: | :-------------------------------- |
| `inputTransform` |  *TransformList* | The input affine transform        |
|   `operations`   | *JsonCompatible* | JSON array of operations to apply |

**`AffineOpsOptions` interface:**

|   Property  |             Type            | Description                                                                                                                                           |
| :---------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `webWorker` | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|   `noCopy`  |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`AffineOpsResult` interface:**

|      Property     |       Type      | Description                     |
| :---------------: | :-------------: | :------------------------------ |
| `outputTransform` | *TransformList* | The output affine transform     |
|    `webWorker`    |     *Worker*    | WebWorker used for computation. |

#### createAffineTransform

*Create a affine spatial transformation.*

```ts
async function createAffineTransform(
  options: CreateAffineTransformOptions = {}
) : Promise<CreateAffineTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateAffineTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateAffineTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createAzimuthElevationToCartesianTransform

*Create a azimuth-elevation-to-cartesian spatial transformation.*

```ts
async function createAzimuthElevationToCartesianTransform(
  options: CreateAzimuthElevationToCartesianTransformOptions = {}
) : Promise<CreateAzimuthElevationToCartesianTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateAzimuthElevationToCartesianTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateAzimuthElevationToCartesianTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createBsplineSmoothingOnUpdateDisplacementFieldTransform

*Create a bspline-smoothing-on-update-displacement-field spatial transformation.*

```ts
async function createBsplineSmoothingOnUpdateDisplacementFieldTransform(
  options: CreateBsplineSmoothingOnUpdateDisplacementFieldTransformOptions = {}
) : Promise<CreateBsplineSmoothingOnUpdateDisplacementFieldTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateBsplineSmoothingOnUpdateDisplacementFieldTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateBsplineSmoothingOnUpdateDisplacementFieldTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createBsplineTransform

*Create a bspline spatial transformation.*

```ts
async function createBsplineTransform(
  options: CreateBsplineTransformOptions = {}
) : Promise<CreateBsplineTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateBsplineTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateBsplineTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createCompositeTransform

*Create a composite spatial transformation.*

```ts
async function createCompositeTransform(
  options: CreateCompositeTransformOptions = {}
) : Promise<CreateCompositeTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateCompositeTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateCompositeTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createConstantVelocityFieldTransform

*Create a constant-velocity-field spatial transformation.*

```ts
async function createConstantVelocityFieldTransform(
  options: CreateConstantVelocityFieldTransformOptions = {}
) : Promise<CreateConstantVelocityFieldTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateConstantVelocityFieldTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateConstantVelocityFieldTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createDisplacementFieldTransform

*Create a displacement-field spatial transformation.*

```ts
async function createDisplacementFieldTransform(
  options: CreateDisplacementFieldTransformOptions = {}
) : Promise<CreateDisplacementFieldTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateDisplacementFieldTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateDisplacementFieldTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createEuler2dTransform

*Create a euler2d spatial transformation.*

```ts
async function createEuler2dTransform(
  options: CreateEuler2dTransformOptions = {}
) : Promise<CreateEuler2dTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateEuler2dTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateEuler2dTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createEuler3dTransform

*Create a euler3d spatial transformation.*

```ts
async function createEuler3dTransform(
  options: CreateEuler3dTransformOptions = {}
) : Promise<CreateEuler3dTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateEuler3dTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateEuler3dTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createGaussianExponentialDiffeomorphicTransform

*Create a gaussian-exponential-diffeomorphic spatial transformation.*

```ts
async function createGaussianExponentialDiffeomorphicTransform(
  options: CreateGaussianExponentialDiffeomorphicTransformOptions = {}
) : Promise<CreateGaussianExponentialDiffeomorphicTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateGaussianExponentialDiffeomorphicTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateGaussianExponentialDiffeomorphicTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createGaussianSmoothingOnUpdateDisplacementFieldTransform

*Create a gaussian-smoothing-on-update-displacement-field spatial transformation.*

```ts
async function createGaussianSmoothingOnUpdateDisplacementFieldTransform(
  options: CreateGaussianSmoothingOnUpdateDisplacementFieldTransformOptions = {}
) : Promise<CreateGaussianSmoothingOnUpdateDisplacementFieldTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateGaussianSmoothingOnUpdateDisplacementFieldTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateGaussianSmoothingOnUpdateDisplacementFieldTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createGaussianSmoothingOnUpdateTimeVaryingVelocityFieldTransform

*Create a gaussian-smoothing-on-update-time-varying-velocity-field spatial transformation.*

```ts
async function createGaussianSmoothingOnUpdateTimeVaryingVelocityFieldTransform(
  options: CreateGaussianSmoothingOnUpdateTimeVaryingVelocityFieldTransformOptions = {}
) : Promise<CreateGaussianSmoothingOnUpdateTimeVaryingVelocityFieldTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateGaussianSmoothingOnUpdateTimeVaryingVelocityFieldTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateGaussianSmoothingOnUpdateTimeVaryingVelocityFieldTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createIdentityTransform

*Create a identity spatial transformation.*

```ts
async function createIdentityTransform(
  options: CreateIdentityTransformOptions = {}
) : Promise<CreateIdentityTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateIdentityTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateIdentityTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createQuaternionRigidTransform

*Create a quaternion-rigid spatial transformation.*

```ts
async function createQuaternionRigidTransform(
  options: CreateQuaternionRigidTransformOptions = {}
) : Promise<CreateQuaternionRigidTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateQuaternionRigidTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateQuaternionRigidTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createRigid2dTransform

*Create a rigid2d spatial transformation.*

```ts
async function createRigid2dTransform(
  options: CreateRigid2dTransformOptions = {}
) : Promise<CreateRigid2dTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateRigid2dTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateRigid2dTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createRigid3dPerspectiveTransform

*Create a rigid3d-perspective spatial transformation.*

```ts
async function createRigid3dPerspectiveTransform(
  options: CreateRigid3dPerspectiveTransformOptions = {}
) : Promise<CreateRigid3dPerspectiveTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateRigid3dPerspectiveTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateRigid3dPerspectiveTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createRigid3dTransform

*Create a rigid3d spatial transformation.*

```ts
async function createRigid3dTransform(
  options: CreateRigid3dTransformOptions = {}
) : Promise<CreateRigid3dTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateRigid3dTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateRigid3dTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createScalableAffineTransform

*Create a scalable-affine spatial transformation.*

```ts
async function createScalableAffineTransform(
  options: CreateScalableAffineTransformOptions = {}
) : Promise<CreateScalableAffineTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateScalableAffineTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateScalableAffineTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createScaleLogarithmicTransform

*Create a scale-logarithmic spatial transformation.*

```ts
async function createScaleLogarithmicTransform(
  options: CreateScaleLogarithmicTransformOptions = {}
) : Promise<CreateScaleLogarithmicTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateScaleLogarithmicTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateScaleLogarithmicTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createScaleSkewVersor3dTransform

*Create a scale-skew-versor3d spatial transformation.*

```ts
async function createScaleSkewVersor3dTransform(
  options: CreateScaleSkewVersor3dTransformOptions = {}
) : Promise<CreateScaleSkewVersor3dTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateScaleSkewVersor3dTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateScaleSkewVersor3dTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createScaleTransform

*Create a scale spatial transformation.*

```ts
async function createScaleTransform(
  options: CreateScaleTransformOptions = {}
) : Promise<CreateScaleTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateScaleTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateScaleTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createSimilarity2dTransform

*Create a similarity2d spatial transformation.*

```ts
async function createSimilarity2dTransform(
  options: CreateSimilarity2dTransformOptions = {}
) : Promise<CreateSimilarity2dTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateSimilarity2dTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateSimilarity2dTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createSimilarity3dTransform

*Create a similarity3d spatial transformation.*

```ts
async function createSimilarity3dTransform(
  options: CreateSimilarity3dTransformOptions = {}
) : Promise<CreateSimilarity3dTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateSimilarity3dTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateSimilarity3dTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createTimeVaryingVelocityFieldTransform

*Create a time-varying-velocity-field spatial transformation.*

```ts
async function createTimeVaryingVelocityFieldTransform(
  options: CreateTimeVaryingVelocityFieldTransformOptions = {}
) : Promise<CreateTimeVaryingVelocityFieldTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateTimeVaryingVelocityFieldTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateTimeVaryingVelocityFieldTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createTranslationTransform

*Create a translation spatial transformation.*

```ts
async function createTranslationTransform(
  options: CreateTranslationTransformOptions = {}
) : Promise<CreateTranslationTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateTranslationTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateTranslationTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createVelocityFieldTransform

*Create a velocity-field spatial transformation.*

```ts
async function createVelocityFieldTransform(
  options: CreateVelocityFieldTransformOptions = {}
) : Promise<CreateVelocityFieldTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateVelocityFieldTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateVelocityFieldTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createVersorRigid3dTransform

*Create a versor-rigid3d spatial transformation.*

```ts
async function createVersorRigid3dTransform(
  options: CreateVersorRigid3dTransformOptions = {}
) : Promise<CreateVersorRigid3dTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateVersorRigid3dTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `dimension`   |           *number*          | Dimension of the transform (2, 3, or 4)                                                                                                               |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateVersorRigid3dTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

#### createVersorTransform

*Create a versor spatial transformation.*

```ts
async function createVersorTransform(
  options: CreateVersorTransformOptions = {}
) : Promise<CreateVersorTransformResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateVersorTransformOptions` interface:**

|     Property     |             Type            | Description                                                                                                                                           |
| :--------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `parametersType` |           *string*          | Type of the transform parameters (float32 or float64)                                                                                                 |
|    `webWorker`   | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|     `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CreateVersorTransformResult` interface:**

|   Property  |       Type      | Description                     |
| :---------: | :-------------: | :------------------------------ |
| `transform` | *TransformList* | Output transform                |
| `webWorker` |     *Worker*    | WebWorker used for computation. |

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
  affineOpsNode,
  createAffineTransformNode,
  createAzimuthElevationToCartesianTransformNode,
  createBsplineSmoothingOnUpdateDisplacementFieldTransformNode,
  createBsplineTransformNode,
  createCompositeTransformNode,
  createConstantVelocityFieldTransformNode,
  createDisplacementFieldTransformNode,
  createEuler2dTransformNode,
  createEuler3dTransformNode,
  createGaussianExponentialDiffeomorphicTransformNode,
  createGaussianSmoothingOnUpdateDisplacementFieldTransformNode,
  createGaussianSmoothingOnUpdateTimeVaryingVelocityFieldTransformNode,
  createIdentityTransformNode,
  createQuaternionRigidTransformNode,
  createRigid2dTransformNode,
  createRigid3dPerspectiveTransformNode,
  createRigid3dTransformNode,
  createScalableAffineTransformNode,
  createScaleLogarithmicTransformNode,
  createScaleSkewVersor3dTransformNode,
  createScaleTransformNode,
  createSimilarity2dTransformNode,
  createSimilarity3dTransformNode,
  createTimeVaryingVelocityFieldTransformNode,
  createTranslationTransformNode,
  createVelocityFieldTransformNode,
  createVersorRigid3dTransformNode,
  createVersorTransformNode,
} from "@itk-wasm/transform"
```

#### affineOpsNode

*Apply operations to an affine transform*

```ts
async function affineOpsNode(
  inputTransform: TransformList,
  operations: JsonCompatible
) : Promise<AffineOpsNodeResult>
```

|     Parameter    |       Type       | Description                       |
| :--------------: | :--------------: | :-------------------------------- |
| `inputTransform` |  *TransformList* | The input affine transform        |
|   `operations`   | *JsonCompatible* | JSON array of operations to apply |

**`AffineOpsNodeResult` interface:**

|      Property     |       Type      | Description                 |
| :---------------: | :-------------: | :-------------------------- |
| `outputTransform` | *TransformList* | The output affine transform |

#### createAffineTransformNode

*Create a affine spatial transformation.*

```ts
async function createAffineTransformNode(
  options: CreateAffineTransformNodeOptions = {}
) : Promise<CreateAffineTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateAffineTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateAffineTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createAzimuthElevationToCartesianTransformNode

*Create a azimuth-elevation-to-cartesian spatial transformation.*

```ts
async function createAzimuthElevationToCartesianTransformNode(
  options: CreateAzimuthElevationToCartesianTransformNodeOptions = {}
) : Promise<CreateAzimuthElevationToCartesianTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateAzimuthElevationToCartesianTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateAzimuthElevationToCartesianTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createBsplineSmoothingOnUpdateDisplacementFieldTransformNode

*Create a bspline-smoothing-on-update-displacement-field spatial transformation.*

```ts
async function createBsplineSmoothingOnUpdateDisplacementFieldTransformNode(
  options: CreateBsplineSmoothingOnUpdateDisplacementFieldTransformNodeOptions = {}
) : Promise<CreateBsplineSmoothingOnUpdateDisplacementFieldTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateBsplineSmoothingOnUpdateDisplacementFieldTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateBsplineSmoothingOnUpdateDisplacementFieldTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createBsplineTransformNode

*Create a bspline spatial transformation.*

```ts
async function createBsplineTransformNode(
  options: CreateBsplineTransformNodeOptions = {}
) : Promise<CreateBsplineTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateBsplineTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateBsplineTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createCompositeTransformNode

*Create a composite spatial transformation.*

```ts
async function createCompositeTransformNode(
  options: CreateCompositeTransformNodeOptions = {}
) : Promise<CreateCompositeTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateCompositeTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateCompositeTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createConstantVelocityFieldTransformNode

*Create a constant-velocity-field spatial transformation.*

```ts
async function createConstantVelocityFieldTransformNode(
  options: CreateConstantVelocityFieldTransformNodeOptions = {}
) : Promise<CreateConstantVelocityFieldTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateConstantVelocityFieldTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateConstantVelocityFieldTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createDisplacementFieldTransformNode

*Create a displacement-field spatial transformation.*

```ts
async function createDisplacementFieldTransformNode(
  options: CreateDisplacementFieldTransformNodeOptions = {}
) : Promise<CreateDisplacementFieldTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateDisplacementFieldTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateDisplacementFieldTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createEuler2dTransformNode

*Create a euler2d spatial transformation.*

```ts
async function createEuler2dTransformNode(
  options: CreateEuler2dTransformNodeOptions = {}
) : Promise<CreateEuler2dTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateEuler2dTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateEuler2dTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createEuler3dTransformNode

*Create a euler3d spatial transformation.*

```ts
async function createEuler3dTransformNode(
  options: CreateEuler3dTransformNodeOptions = {}
) : Promise<CreateEuler3dTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateEuler3dTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateEuler3dTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createGaussianExponentialDiffeomorphicTransformNode

*Create a gaussian-exponential-diffeomorphic spatial transformation.*

```ts
async function createGaussianExponentialDiffeomorphicTransformNode(
  options: CreateGaussianExponentialDiffeomorphicTransformNodeOptions = {}
) : Promise<CreateGaussianExponentialDiffeomorphicTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateGaussianExponentialDiffeomorphicTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateGaussianExponentialDiffeomorphicTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createGaussianSmoothingOnUpdateDisplacementFieldTransformNode

*Create a gaussian-smoothing-on-update-displacement-field spatial transformation.*

```ts
async function createGaussianSmoothingOnUpdateDisplacementFieldTransformNode(
  options: CreateGaussianSmoothingOnUpdateDisplacementFieldTransformNodeOptions = {}
) : Promise<CreateGaussianSmoothingOnUpdateDisplacementFieldTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateGaussianSmoothingOnUpdateDisplacementFieldTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateGaussianSmoothingOnUpdateDisplacementFieldTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createGaussianSmoothingOnUpdateTimeVaryingVelocityFieldTransformNode

*Create a gaussian-smoothing-on-update-time-varying-velocity-field spatial transformation.*

```ts
async function createGaussianSmoothingOnUpdateTimeVaryingVelocityFieldTransformNode(
  options: CreateGaussianSmoothingOnUpdateTimeVaryingVelocityFieldTransformNodeOptions = {}
) : Promise<CreateGaussianSmoothingOnUpdateTimeVaryingVelocityFieldTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateGaussianSmoothingOnUpdateTimeVaryingVelocityFieldTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateGaussianSmoothingOnUpdateTimeVaryingVelocityFieldTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createIdentityTransformNode

*Create a identity spatial transformation.*

```ts
async function createIdentityTransformNode(
  options: CreateIdentityTransformNodeOptions = {}
) : Promise<CreateIdentityTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateIdentityTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateIdentityTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createQuaternionRigidTransformNode

*Create a quaternion-rigid spatial transformation.*

```ts
async function createQuaternionRigidTransformNode(
  options: CreateQuaternionRigidTransformNodeOptions = {}
) : Promise<CreateQuaternionRigidTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateQuaternionRigidTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateQuaternionRigidTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createRigid2dTransformNode

*Create a rigid2d spatial transformation.*

```ts
async function createRigid2dTransformNode(
  options: CreateRigid2dTransformNodeOptions = {}
) : Promise<CreateRigid2dTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateRigid2dTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateRigid2dTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createRigid3dPerspectiveTransformNode

*Create a rigid3d-perspective spatial transformation.*

```ts
async function createRigid3dPerspectiveTransformNode(
  options: CreateRigid3dPerspectiveTransformNodeOptions = {}
) : Promise<CreateRigid3dPerspectiveTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateRigid3dPerspectiveTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateRigid3dPerspectiveTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createRigid3dTransformNode

*Create a rigid3d spatial transformation.*

```ts
async function createRigid3dTransformNode(
  options: CreateRigid3dTransformNodeOptions = {}
) : Promise<CreateRigid3dTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateRigid3dTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateRigid3dTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createScalableAffineTransformNode

*Create a scalable-affine spatial transformation.*

```ts
async function createScalableAffineTransformNode(
  options: CreateScalableAffineTransformNodeOptions = {}
) : Promise<CreateScalableAffineTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateScalableAffineTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateScalableAffineTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createScaleLogarithmicTransformNode

*Create a scale-logarithmic spatial transformation.*

```ts
async function createScaleLogarithmicTransformNode(
  options: CreateScaleLogarithmicTransformNodeOptions = {}
) : Promise<CreateScaleLogarithmicTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateScaleLogarithmicTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateScaleLogarithmicTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createScaleSkewVersor3dTransformNode

*Create a scale-skew-versor3d spatial transformation.*

```ts
async function createScaleSkewVersor3dTransformNode(
  options: CreateScaleSkewVersor3dTransformNodeOptions = {}
) : Promise<CreateScaleSkewVersor3dTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateScaleSkewVersor3dTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateScaleSkewVersor3dTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createScaleTransformNode

*Create a scale spatial transformation.*

```ts
async function createScaleTransformNode(
  options: CreateScaleTransformNodeOptions = {}
) : Promise<CreateScaleTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateScaleTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateScaleTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createSimilarity2dTransformNode

*Create a similarity2d spatial transformation.*

```ts
async function createSimilarity2dTransformNode(
  options: CreateSimilarity2dTransformNodeOptions = {}
) : Promise<CreateSimilarity2dTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateSimilarity2dTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateSimilarity2dTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createSimilarity3dTransformNode

*Create a similarity3d spatial transformation.*

```ts
async function createSimilarity3dTransformNode(
  options: CreateSimilarity3dTransformNodeOptions = {}
) : Promise<CreateSimilarity3dTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateSimilarity3dTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateSimilarity3dTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createTimeVaryingVelocityFieldTransformNode

*Create a time-varying-velocity-field spatial transformation.*

```ts
async function createTimeVaryingVelocityFieldTransformNode(
  options: CreateTimeVaryingVelocityFieldTransformNodeOptions = {}
) : Promise<CreateTimeVaryingVelocityFieldTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateTimeVaryingVelocityFieldTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateTimeVaryingVelocityFieldTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createTranslationTransformNode

*Create a translation spatial transformation.*

```ts
async function createTranslationTransformNode(
  options: CreateTranslationTransformNodeOptions = {}
) : Promise<CreateTranslationTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateTranslationTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateTranslationTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createVelocityFieldTransformNode

*Create a velocity-field spatial transformation.*

```ts
async function createVelocityFieldTransformNode(
  options: CreateVelocityFieldTransformNodeOptions = {}
) : Promise<CreateVelocityFieldTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateVelocityFieldTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateVelocityFieldTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createVersorRigid3dTransformNode

*Create a versor-rigid3d spatial transformation.*

```ts
async function createVersorRigid3dTransformNode(
  options: CreateVersorRigid3dTransformNodeOptions = {}
) : Promise<CreateVersorRigid3dTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateVersorRigid3dTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
|    `dimension`   | *number* | Dimension of the transform (2, 3, or 4)               |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateVersorRigid3dTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |

#### createVersorTransformNode

*Create a versor spatial transformation.*

```ts
async function createVersorTransformNode(
  options: CreateVersorTransformNodeOptions = {}
) : Promise<CreateVersorTransformNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`CreateVersorTransformNodeOptions` interface:**

|     Property     |   Type   | Description                                           |
| :--------------: | :------: | :---------------------------------------------------- |
| `parametersType` | *string* | Type of the transform parameters (float32 or float64) |

**`CreateVersorTransformNodeResult` interface:**

|   Property  |       Type      | Description      |
| :---------: | :-------------: | :--------------- |
| `transform` | *TransformList* | Output transform |
