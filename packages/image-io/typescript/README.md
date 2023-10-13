# @itk-wasm/image-io

[![npm version](https://badge.fury.io/js/@itk-wasm%2Fimage-io.svg)](https://www.npmjs.com/package/@itk-wasm/image-io)

> Input and output for scientific and medical image file formats.

## Installation

```sh
npm install @itk-wasm/image-io
```

## Usage

### Browser interface

Import:

```js
import {
  readImage
  writeImage
  setPipelinesBaseUrl,
  getPipelinesBaseUrl,
} from "@itk-wasm/image-io"
```

#### readImage

*Read an image file format and convert it to an itk-wasm Image.*

```ts
async function readImage(
  webWorker: null | Worker,
  serializedImage: File | BinaryFile,
  options: ReadImageOptions = {}
) : Promise<ReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `webWorker` | *null or Worker* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. |
| `serializedImage` | *File or BinaryFile* | Input image serialized in the file format. |

**`ReadImageOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |
| `componentType` | *typeof IntTypes or typeof FloatTypes* | Component type, from itk-wasm IntTypes, FloatTypes, for the output pixel components. Defaults to the input component type. |
| `pixelType` | *typeof PixelTypes* | Pixel type, from itk-wasm PixelTypes, for the output pixels. Defaults to the input pixel type. |

**`ReadImageResult` interface:**

|    Property   |       Type       | Description                                                               |
| :-----------: | :--------------: | :------------------------------------------------------------------------ |
| `webWorker` |     *Worker*     | WebWorker used for computation                                            |
|    `image`    |      *Image*     | Output image                                                              |

#### writeImage

*Write an itk-wasm Image converted to an image file format*

```ts
async function writeImage(
  webWorker: null | Worker,
  image: Image,
  serializedImage: string,
  options: WriteImageOptions = {}
) : Promise<WriteImageResult>
```

|     Parameter     |   Type   | Description                                 |
| :---------------: | :------: | :------------------------------------------ |
| `webWorker` | *null or Worker* | WebWorker to use for computation. Set to null to create a new worker. Or, pass an existing worker. |
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

**`WriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|   `webWorker`   |     *Worker*     | WebWorker used for computation                                               |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |



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

Additional per-format functions are available, but they are usually not used directly. Example interface for the *BioRad* format:

#### bioRadReadImage

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function bioRadReadImage(
  webWorker: null | Worker,
  serializedImage: File | BinaryFile,
  options: BioRadReadImageOptions = {}
) : Promise<BioRadReadImageResult>
```

|     Parameter     |         Type        | Description                               |
| :---------------: | :-----------------: | :---------------------------------------- |
| `serializedImage` | *File or BinaryFile* | Input image serialized in the file format |

**`BioRadReadImageOptions` interface:**

|      Property     |    Type   | Description                                         |
| :---------------: | :-------: | :-------------------------------------------------- |
| `informationOnly` | *boolean* | Only read image metadata -- do not read pixel data. |

**`BioRadReadImageResult` interface:**

|    Property   |       Type       | Description                                                               |
| :-----------: | :--------------: | :------------------------------------------------------------------------ |
| `webWorker` |     *Worker*     | WebWorker used for computation                                            |
|  `couldRead`  | *JsonCompatible* | Whether the input could be read. If false, the output image is not valid. |
|    `image`    |      *Image*     | Output image                                                              |

#### bioRadWriteImage

*Write an itk-wasm file format converted to an image file format*

```ts
async function bioRadWriteImage(
  webWorker: null | Worker,
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

|      Property     |    Type   | Description                                           |
| :---------------: | :-------: | :---------------------------------------------------- |
| `informationOnly` | *boolean* | Only write image metadata -- do not write pixel data. |
|  `useCompression` | *boolean* | Use compression in the written file                   |

**`BioRadWriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
|   `webWorker`   |     *Worker*     | WebWorker used for computation                                               |
|    `couldWrite`   | *JsonCompatible* | Whether the input could be written. If false, the output image is not valid. |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |


### Node interface

Import:

```js
import {
  readImageNode,
  writeImageNode,
} from "@itk-wasm/image-io"
```

#### readImageNode

*Read an image file format and convert it to an itk-wasm Image.*

```ts
async function readImageNode(
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

**`ReadImageResult` interface:**

|    Property   |       Type       | Description                                                               |
| :-----------: | :--------------: | :------------------------------------------------------------------------ |
|    `image`    |      *Image*     | Output image                                                              |

#### writeImageNode

*Write an itk-wasm Image converted to an image file format*

```ts
async function writeImageNode(
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

**`WriteImageResult` interface:**

|      Property     |       Type       | Description                                                                  |
| :---------------: | :--------------: | :--------------------------------------------------------------------------- |
| `serializedImage` |   *BinaryFile*   | Output image serialized in the file format.                                  |




Additional per-format functions are available, but they are usually not used directly. Example interface for the *BioRad* format:

#### bioRadReadImageNode

*Read an image file format and convert it to the itk-wasm file format*

```ts
async function bioRadReadImageNode(
  serializedImage: string,
  options: BioRadReadImageOptions = {}
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
  options: BioRadWriteImageOptions = {}
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
