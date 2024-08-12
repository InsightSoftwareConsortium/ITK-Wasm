# @itk-wasm/image-io

[![npm version](https://badge.fury.io/js/@itk-wasm%2Fimage-io.svg)](https://www.npmjs.com/package/@itk-wasm/image-io)

> Input and output for scientific and medical image file formats.

[💻 **Live API Demo** ✨](https://insightsoftwareconsortium.github.io/ITK-Wasm/image-io/ts/app/
 ':include :type=iframe width=100% height=800px')

[🕮 **Documentation** 📚](https://insightsoftwareconsortium.github.io/ITK-Wasm/image-io/ts/docs/)

## Installation

```sh
npm install @itk-wasm/image-io
```

## Usage

### Browser interface

Import:

```js
import {
  readImage,
  writeImage,
  bioRadReadImage,
  bioRadWriteImage,
  bmpReadImage,
  bmpWriteImage,
  fdfReadImage,
  fdfWriteImage,
  gdcmReadImage,
  gdcmWriteImage,
  geAdwReadImage,
  geAdwWriteImage,
  ge4ReadImage,
  ge4WriteImage,
  ge5ReadImage,
  ge5WriteImage,
  giplReadImage,
  giplWriteImage,
  hdf5ReadImage,
  hdf5WriteImage,
  jpegReadImage,
  jpegWriteImage,
  lsmReadImage,
  lsmWriteImage,
  metaReadImage,
  metaWriteImage,
  mghReadImage,
  mghWriteImage,
  mincReadImage,
  mincWriteImage,
  mrcReadImage,
  mrcWriteImage,
  niftiReadImage,
  niftiWriteImage,
  nrrdReadImage,
  nrrdWriteImage,
  pngReadImage,
  pngWriteImage,
  scancoReadImage,
  scancoWriteImage,
  tiffReadImage,
  tiffWriteImage,
  vtkReadImage,
  vtkWriteImage,
  wasmReadImage,
  wasmWriteImage,
  wasmZstdReadImage,
  wasmZstdWriteImage,
  setPipelinesBaseUrl,
  getPipelinesBaseUrl,
} from "@itk-wasm/image-io"
```

#### readImage


*Read an image file format and convert it to an itk-wasm Image.*

```ts
async function readImage(
  serializedImage: File | BinaryFile,
  options: ReadImageOptions = {}
) : Promise<ReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File or BinaryFile* | Input image serialized in the file format. |

**`ReadImageOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |
| `componentType` | *typeof IntTypes or typeof FloatTypes* | Component type, from itk-wasm IntTypes, FloatTypes, for the output pixel components. Defaults to the input component type. |
| `pixelType` | *typeof PixelTypes* | Pixel type, from itk-wasm PixelTypes, for the output pixels. Defaults to the input pixel type. |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`ReadImageResult` interface:**

|    Property   |       Type       | Description                                                               |
| :-----------: | :--------------: | :------------------------------------------------------------------------ |
| `webWorker` |     *Worker*     | WebWorker used for computation                                            |
|    `image`    |      *Image*     | Output image                                                              |

#### writeImage

*Write an itk-wasm Image converted to an image file format*

```ts
async function writeImage(
  image: Image,
  serializedImage: string,
  options: WriteImageOptions = {}
) : Promise<WriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`WriteImageOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |
| `mimeType` | *string* | Mime type of the output image file. |
| `componentType` | *typeof IntTypes or typeof FloatTypes* | Component type, from itk-wasm IntTypes, FloatTypes, for the output pixel components. Defaults to the input component type. |
| `pixelType` | *typeof PixelTypes* | Pixel type, from itk-wasm PixelTypes, for the output pixels. Defaults to the input pixel type. |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`WriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|   `webWorker`   |     *Worker*     | WebWorker used for computation                                               |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### bioRadReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function bioRadReadImage(
  serializedImage: File | BinaryFile,
  options: BioRadReadImageOptions = {}
) : Promise<BioRadReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`BioRadReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`BioRadReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### bioRadWriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function bioRadWriteImage(
  image: Image,
  serializedImage: string,
  options: BioRadWriteImageOptions = {}
) : Promise<BioRadWriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`BioRadWriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`BioRadWriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### bmpReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function bmpReadImage(
  serializedImage: File | BinaryFile,
  options: BmpReadImageOptions = {}
) : Promise<BmpReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`BmpReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`BmpReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### bmpWriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function bmpWriteImage(
  image: Image,
  serializedImage: string,
  options: BmpWriteImageOptions = {}
) : Promise<BmpWriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`BmpWriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`BmpWriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### fdfReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function fdfReadImage(
  serializedImage: File | BinaryFile,
  options: FdfReadImageOptions = {}
) : Promise<FdfReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`FdfReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`FdfReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### fdfWriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function fdfWriteImage(
  image: Image,
  serializedImage: string,
  options: FdfWriteImageOptions = {}
) : Promise<FdfWriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`FdfWriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`FdfWriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### gdcmReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function gdcmReadImage(
  serializedImage: File | BinaryFile,
  options: GdcmReadImageOptions = {}
) : Promise<GdcmReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`GdcmReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`GdcmReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### gdcmWriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function gdcmWriteImage(
  image: Image,
  serializedImage: string,
  options: GdcmWriteImageOptions = {}
) : Promise<GdcmWriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`GdcmWriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`GdcmWriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### geAdwReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function geAdwReadImage(
  serializedImage: File | BinaryFile,
  options: GeAdwReadImageOptions = {}
) : Promise<GeAdwReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`GeAdwReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`GeAdwReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### geAdwWriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function geAdwWriteImage(
  image: Image,
  serializedImage: string,
  options: GeAdwWriteImageOptions = {}
) : Promise<GeAdwWriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`GeAdwWriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`GeAdwWriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### ge4ReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function ge4ReadImage(
  serializedImage: File | BinaryFile,
  options: Ge4ReadImageOptions = {}
) : Promise<Ge4ReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`Ge4ReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`Ge4ReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### ge4WriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function ge4WriteImage(
  image: Image,
  serializedImage: string,
  options: Ge4WriteImageOptions = {}
) : Promise<Ge4WriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`Ge4WriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`Ge4WriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### ge5ReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function ge5ReadImage(
  serializedImage: File | BinaryFile,
  options: Ge5ReadImageOptions = {}
) : Promise<Ge5ReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`Ge5ReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`Ge5ReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### ge5WriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function ge5WriteImage(
  image: Image,
  serializedImage: string,
  options: Ge5WriteImageOptions = {}
) : Promise<Ge5WriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`Ge5WriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`Ge5WriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### giplReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function giplReadImage(
  serializedImage: File | BinaryFile,
  options: GiplReadImageOptions = {}
) : Promise<GiplReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`GiplReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`GiplReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### giplWriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function giplWriteImage(
  image: Image,
  serializedImage: string,
  options: GiplWriteImageOptions = {}
) : Promise<GiplWriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`GiplWriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`GiplWriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### hdf5ReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function hdf5ReadImage(
  serializedImage: File | BinaryFile,
  options: Hdf5ReadImageOptions = {}
) : Promise<Hdf5ReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`Hdf5ReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`Hdf5ReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### hdf5WriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function hdf5WriteImage(
  image: Image,
  serializedImage: string,
  options: Hdf5WriteImageOptions = {}
) : Promise<Hdf5WriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`Hdf5WriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`Hdf5WriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### jpegReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function jpegReadImage(
  serializedImage: File | BinaryFile,
  options: JpegReadImageOptions = {}
) : Promise<JpegReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`JpegReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`JpegReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### jpegWriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function jpegWriteImage(
  image: Image,
  serializedImage: string,
  options: JpegWriteImageOptions = {}
) : Promise<JpegWriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`JpegWriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`JpegWriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### lsmReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function lsmReadImage(
  serializedImage: File | BinaryFile,
  options: LsmReadImageOptions = {}
) : Promise<LsmReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`LsmReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`LsmReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### lsmWriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function lsmWriteImage(
  image: Image,
  serializedImage: string,
  options: LsmWriteImageOptions = {}
) : Promise<LsmWriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`LsmWriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`LsmWriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### metaReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function metaReadImage(
  serializedImage: File | BinaryFile,
  options: MetaReadImageOptions = {}
) : Promise<MetaReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`MetaReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`MetaReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### metaWriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function metaWriteImage(
  image: Image,
  serializedImage: string,
  options: MetaWriteImageOptions = {}
) : Promise<MetaWriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`MetaWriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`MetaWriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### mghReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function mghReadImage(
  serializedImage: File | BinaryFile,
  options: MghReadImageOptions = {}
) : Promise<MghReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`MghReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`MghReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### mghWriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function mghWriteImage(
  image: Image,
  serializedImage: string,
  options: MghWriteImageOptions = {}
) : Promise<MghWriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`MghWriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`MghWriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### mincReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function mincReadImage(
  serializedImage: File | BinaryFile,
  options: MincReadImageOptions = {}
) : Promise<MincReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`MincReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`MincReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### mincWriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function mincWriteImage(
  image: Image,
  serializedImage: string,
  options: MincWriteImageOptions = {}
) : Promise<MincWriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`MincWriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`MincWriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### mrcReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function mrcReadImage(
  serializedImage: File | BinaryFile,
  options: MrcReadImageOptions = {}
) : Promise<MrcReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`MrcReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`MrcReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### mrcWriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function mrcWriteImage(
  image: Image,
  serializedImage: string,
  options: MrcWriteImageOptions = {}
) : Promise<MrcWriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`MrcWriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`MrcWriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### niftiReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function niftiReadImage(
  serializedImage: File | BinaryFile,
  options: NiftiReadImageOptions = {}
) : Promise<NiftiReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`NiftiReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`NiftiReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### niftiWriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function niftiWriteImage(
  image: Image,
  serializedImage: string,
  options: NiftiWriteImageOptions = {}
) : Promise<NiftiWriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`NiftiWriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`NiftiWriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### nrrdReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function nrrdReadImage(
  serializedImage: File | BinaryFile,
  options: NrrdReadImageOptions = {}
) : Promise<NrrdReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`NrrdReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`NrrdReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### nrrdWriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function nrrdWriteImage(
  image: Image,
  serializedImage: string,
  options: NrrdWriteImageOptions = {}
) : Promise<NrrdWriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`NrrdWriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`NrrdWriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### pngReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function pngReadImage(
  serializedImage: File | BinaryFile,
  options: PngReadImageOptions = {}
) : Promise<PngReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`PngReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`PngReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### pngWriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function pngWriteImage(
  image: Image,
  serializedImage: string,
  options: PngWriteImageOptions = {}
) : Promise<PngWriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`PngWriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`PngWriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### scancoReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function scancoReadImage(
  serializedImage: File | BinaryFile,
  options: ScancoReadImageOptions = {}
) : Promise<ScancoReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`ScancoReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`ScancoReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### scancoWriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function scancoWriteImage(
  image: Image,
  serializedImage: string,
  options: ScancoWriteImageOptions = {}
) : Promise<ScancoWriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`ScancoWriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`ScancoWriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### tiffReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function tiffReadImage(
  serializedImage: File | BinaryFile,
  options: TiffReadImageOptions = {}
) : Promise<TiffReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`TiffReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`TiffReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### tiffWriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function tiffWriteImage(
  image: Image,
  serializedImage: string,
  options: TiffWriteImageOptions = {}
) : Promise<TiffWriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`TiffWriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`TiffWriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### vtkReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function vtkReadImage(
  serializedImage: File | BinaryFile,
  options: VtkReadImageOptions = {}
) : Promise<VtkReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`VtkReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`VtkReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### vtkWriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function vtkWriteImage(
  image: Image,
  serializedImage: string,
  options: VtkWriteImageOptions = {}
) : Promise<VtkWriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`VtkWriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`VtkWriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### wasmReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function wasmReadImage(
  serializedImage: File | BinaryFile,
  options: WasmReadImageOptions = {}
) : Promise<WasmReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`WasmReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`WasmReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### wasmWriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function wasmWriteImage(
  image: Image,
  serializedImage: string,
  options: WasmWriteImageOptions = {}
) : Promise<WasmWriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`WasmWriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`WasmWriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

#### wasmZstdReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function wasmZstdReadImage(
  serializedImage: File | BinaryFile,
  options: WasmZstdReadImageOptions = {}
) : Promise<WasmZstdReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File | BinaryFile* | Input image serialized in the file format |

**`WasmZstdReadImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only read image metadata -- do not read pixel data.                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`WasmZstdReadImageResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                           |

#### wasmZstdWriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function wasmZstdWriteImage(
  image: Image,
  serializedImage: string,
  options: WasmZstdWriteImageOptions = {}
) : Promise<WasmZstdWriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`WasmZstdWriteImageOptions` interface:**

|      Property     |             Type            | Description                                                                                                                                           |
| :---------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `informationOnly` |          *boolean*          | Only write image metadata -- do not write pixel data.                                                                                                 |
|  `useCompression` |          *boolean*          | Use compression in the written file                                                                                                                   |
|    `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`     |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`WasmZstdWriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
|    `webWorker`    |     *Worker*     | WebWorker used for computation.                                              |

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
  readImageNode,
  writeImageNode,
  bioRadReadImageNode,
  bioRadWriteImageNode,
  bmpReadImageNode,
  bmpWriteImageNode,
  fdfReadImageNode,
  fdfWriteImageNode,
  gdcmReadImageNode,
  gdcmWriteImageNode,
  geAdwReadImageNode,
  geAdwWriteImageNode,
  ge4ReadImageNode,
  ge4WriteImageNode,
  ge5ReadImageNode,
  ge5WriteImageNode,
  giplReadImageNode,
  giplWriteImageNode,
  hdf5ReadImageNode,
  hdf5WriteImageNode,
  jpegReadImageNode,
  jpegWriteImageNode,
  lsmReadImageNode,
  lsmWriteImageNode,
  metaReadImageNode,
  metaWriteImageNode,
  mghReadImageNode,
  mghWriteImageNode,
  mincReadImageNode,
  mincWriteImageNode,
  mrcReadImageNode,
  mrcWriteImageNode,
  niftiReadImageNode,
  niftiWriteImageNode,
  nrrdReadImageNode,
  nrrdWriteImageNode,
  pngReadImageNode,
  pngWriteImageNode,
  scancoReadImageNode,
  scancoWriteImageNode,
  tiffReadImageNode,
  tiffWriteImageNode,
  vtkReadImageNode,
  vtkWriteImageNode,
  wasmReadImageNode,
  wasmWriteImageNode,
  wasmZstdReadImageNode,
  wasmZstdWriteImageNode,
} from "@itk-wasm/image-io"
```

#### readImageNode


*Read an image file format and convert it to an itk-wasm Image.*

```ts
async function readImageNode(
  serializedImage: string,
  options: ReadImageOptions = {}
) : Promise<Image>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` |       *string*      | Input image serialized in the file format. |

**`ReadImageOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |
| `componentType` | *typeof IntTypes or typeof FloatTypes* | Component type, from itk-wasm IntTypes, FloatTypes, for the output pixel components. Defaults to the input component type. |
| `pixelType` | *typeof PixelTypes* | Pixel type, from itk-wasm PixelTypes, for the output pixels. Defaults to the input pixel type. |

#### writeImageNode

*Write an itk-wasm Image converted to an image file format*

```ts
async function writeImageNode(
  image: Image,
  serializedImage: string,
  options: WriteImageOptions = {}
) : void
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |


#### bioRadReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function bioRadReadImageNode(
  serializedImage: string,
  options: BioRadReadImageNodeOptions = {}
) : Promise<BioRadReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`BioRadReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`BioRadReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### bioRadWriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function bioRadWriteImageNode(
  image: Image,
  serializedImage: string,
  options: BioRadWriteImageNodeOptions = {}
) : Promise<BioRadWriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`BioRadWriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`BioRadWriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### bmpReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function bmpReadImageNode(
  serializedImage: string,
  options: BmpReadImageNodeOptions = {}
) : Promise<BmpReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`BmpReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`BmpReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### bmpWriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function bmpWriteImageNode(
  image: Image,
  serializedImage: string,
  options: BmpWriteImageNodeOptions = {}
) : Promise<BmpWriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`BmpWriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`BmpWriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### fdfReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function fdfReadImageNode(
  serializedImage: string,
  options: FdfReadImageNodeOptions = {}
) : Promise<FdfReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`FdfReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`FdfReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### fdfWriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function fdfWriteImageNode(
  image: Image,
  serializedImage: string,
  options: FdfWriteImageNodeOptions = {}
) : Promise<FdfWriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`FdfWriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`FdfWriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### gdcmReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function gdcmReadImageNode(
  serializedImage: string,
  options: GdcmReadImageNodeOptions = {}
) : Promise<GdcmReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`GdcmReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`GdcmReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### gdcmWriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function gdcmWriteImageNode(
  image: Image,
  serializedImage: string,
  options: GdcmWriteImageNodeOptions = {}
) : Promise<GdcmWriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`GdcmWriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`GdcmWriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### geAdwReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function geAdwReadImageNode(
  serializedImage: string,
  options: GeAdwReadImageNodeOptions = {}
) : Promise<GeAdwReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`GeAdwReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`GeAdwReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### geAdwWriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function geAdwWriteImageNode(
  image: Image,
  serializedImage: string,
  options: GeAdwWriteImageNodeOptions = {}
) : Promise<GeAdwWriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`GeAdwWriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`GeAdwWriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### ge4ReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function ge4ReadImageNode(
  serializedImage: string,
  options: Ge4ReadImageNodeOptions = {}
) : Promise<Ge4ReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`Ge4ReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`Ge4ReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### ge4WriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function ge4WriteImageNode(
  image: Image,
  serializedImage: string,
  options: Ge4WriteImageNodeOptions = {}
) : Promise<Ge4WriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`Ge4WriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`Ge4WriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### ge5ReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function ge5ReadImageNode(
  serializedImage: string,
  options: Ge5ReadImageNodeOptions = {}
) : Promise<Ge5ReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`Ge5ReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`Ge5ReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### ge5WriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function ge5WriteImageNode(
  image: Image,
  serializedImage: string,
  options: Ge5WriteImageNodeOptions = {}
) : Promise<Ge5WriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`Ge5WriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`Ge5WriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### giplReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function giplReadImageNode(
  serializedImage: string,
  options: GiplReadImageNodeOptions = {}
) : Promise<GiplReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`GiplReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`GiplReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### giplWriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function giplWriteImageNode(
  image: Image,
  serializedImage: string,
  options: GiplWriteImageNodeOptions = {}
) : Promise<GiplWriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`GiplWriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`GiplWriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### hdf5ReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function hdf5ReadImageNode(
  serializedImage: string,
  options: Hdf5ReadImageNodeOptions = {}
) : Promise<Hdf5ReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`Hdf5ReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`Hdf5ReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### hdf5WriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function hdf5WriteImageNode(
  image: Image,
  serializedImage: string,
  options: Hdf5WriteImageNodeOptions = {}
) : Promise<Hdf5WriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`Hdf5WriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`Hdf5WriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### jpegReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function jpegReadImageNode(
  serializedImage: string,
  options: JpegReadImageNodeOptions = {}
) : Promise<JpegReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`JpegReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`JpegReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### jpegWriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function jpegWriteImageNode(
  image: Image,
  serializedImage: string,
  options: JpegWriteImageNodeOptions = {}
) : Promise<JpegWriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`JpegWriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`JpegWriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### lsmReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function lsmReadImageNode(
  serializedImage: string,
  options: LsmReadImageNodeOptions = {}
) : Promise<LsmReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`LsmReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`LsmReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### lsmWriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function lsmWriteImageNode(
  image: Image,
  serializedImage: string,
  options: LsmWriteImageNodeOptions = {}
) : Promise<LsmWriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`LsmWriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`LsmWriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### metaReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function metaReadImageNode(
  serializedImage: string,
  options: MetaReadImageNodeOptions = {}
) : Promise<MetaReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`MetaReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`MetaReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### metaWriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function metaWriteImageNode(
  image: Image,
  serializedImage: string,
  options: MetaWriteImageNodeOptions = {}
) : Promise<MetaWriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`MetaWriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`MetaWriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### mghReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function mghReadImageNode(
  serializedImage: string,
  options: MghReadImageNodeOptions = {}
) : Promise<MghReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`MghReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`MghReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### mghWriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function mghWriteImageNode(
  image: Image,
  serializedImage: string,
  options: MghWriteImageNodeOptions = {}
) : Promise<MghWriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`MghWriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`MghWriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### mincReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function mincReadImageNode(
  serializedImage: string,
  options: MincReadImageNodeOptions = {}
) : Promise<MincReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`MincReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`MincReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### mincWriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function mincWriteImageNode(
  image: Image,
  serializedImage: string,
  options: MincWriteImageNodeOptions = {}
) : Promise<MincWriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`MincWriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`MincWriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### mrcReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function mrcReadImageNode(
  serializedImage: string,
  options: MrcReadImageNodeOptions = {}
) : Promise<MrcReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`MrcReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`MrcReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### mrcWriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function mrcWriteImageNode(
  image: Image,
  serializedImage: string,
  options: MrcWriteImageNodeOptions = {}
) : Promise<MrcWriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`MrcWriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`MrcWriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### niftiReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function niftiReadImageNode(
  serializedImage: string,
  options: NiftiReadImageNodeOptions = {}
) : Promise<NiftiReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`NiftiReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`NiftiReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### niftiWriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function niftiWriteImageNode(
  image: Image,
  serializedImage: string,
  options: NiftiWriteImageNodeOptions = {}
) : Promise<NiftiWriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`NiftiWriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`NiftiWriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### nrrdReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function nrrdReadImageNode(
  serializedImage: string,
  options: NrrdReadImageNodeOptions = {}
) : Promise<NrrdReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`NrrdReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`NrrdReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### nrrdWriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function nrrdWriteImageNode(
  image: Image,
  serializedImage: string,
  options: NrrdWriteImageNodeOptions = {}
) : Promise<NrrdWriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`NrrdWriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`NrrdWriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### pngReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function pngReadImageNode(
  serializedImage: string,
  options: PngReadImageNodeOptions = {}
) : Promise<PngReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`PngReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`PngReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### pngWriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function pngWriteImageNode(
  image: Image,
  serializedImage: string,
  options: PngWriteImageNodeOptions = {}
) : Promise<PngWriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`PngWriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`PngWriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### scancoReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function scancoReadImageNode(
  serializedImage: string,
  options: ScancoReadImageNodeOptions = {}
) : Promise<ScancoReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`ScancoReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`ScancoReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### scancoWriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function scancoWriteImageNode(
  image: Image,
  serializedImage: string,
  options: ScancoWriteImageNodeOptions = {}
) : Promise<ScancoWriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`ScancoWriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`ScancoWriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### tiffReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function tiffReadImageNode(
  serializedImage: string,
  options: TiffReadImageNodeOptions = {}
) : Promise<TiffReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`TiffReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`TiffReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### tiffWriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function tiffWriteImageNode(
  image: Image,
  serializedImage: string,
  options: TiffWriteImageNodeOptions = {}
) : Promise<TiffWriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`TiffWriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`TiffWriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### vtkReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function vtkReadImageNode(
  serializedImage: string,
  options: VtkReadImageNodeOptions = {}
) : Promise<VtkReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`VtkReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`VtkReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### vtkWriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function vtkWriteImageNode(
  image: Image,
  serializedImage: string,
  options: VtkWriteImageNodeOptions = {}
) : Promise<VtkWriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`VtkWriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`VtkWriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### wasmReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function wasmReadImageNode(
  serializedImage: string,
  options: WasmReadImageNodeOptions = {}
) : Promise<WasmReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`WasmReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`WasmReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### wasmWriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function wasmWriteImageNode(
  image: Image,
  serializedImage: string,
  options: WasmWriteImageNodeOptions = {}
) : Promise<WasmWriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`WasmWriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`WasmWriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |

#### wasmZstdReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function wasmZstdReadImageNode(
  serializedImage: string,
  options: WasmZstdReadImageNodeOptions = {}
) : Promise<WasmZstdReadImageNodeResult>
```

|     Parameter     |   Type   | Description                               |
| :---------------: | :------: | :---------------------------------------- |
| `serializedImage` | *string* | Input image serialized in the file format |

**`WasmZstdReadImageNodeOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`WasmZstdReadImageNodeResult` interface:**

|   Property  |       Type       | Description                                                               |
| :---------: | :--------------: | :------------------------------------------------------------------------ |
| `couldRead` | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|   `image`   |      *Image*     | Output image                                                              |

#### wasmZstdWriteImageNode

*Write an itk-wasm file format converted to an image file format*

```ts
async function wasmZstdWriteImageNode(
  image: Image,
  serializedImage: string,
  options: WasmZstdWriteImageNodeOptions = {}
) : Promise<WasmZstdWriteImageNodeResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
|      `image`      |  *Image* | Input image                                 |
| `serializedImage` | *string* | Output image serialized in the file format. |

**`WasmZstdWriteImageNodeOptions` interface:**

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`WasmZstdWriteImageNodeResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |
