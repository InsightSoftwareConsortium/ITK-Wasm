# @itk-wasm/compress-stringify

[![npm version](https://badge.fury.io/js/@itk-wasm%2Fcompress-stringify.svg)](https://www.npmjs.com/package/@itk-wasm/compress-stringify)

> Zstandard compression and decompression and base64 encoding and decoding in WebAssembly.

[👨‍💻 **Live API Demo** ✨](https://insightsoftwareconsortium.github.io/itk-wasm/compress-stringify/ts/app/ ':include :type=iframe width=100% height=800px')

[🕮 **Documentation** 📚](https://insightsoftwareconsortium.github.io/itk-wasm/compress-stringify/ts/docs/)

## Installation

```sh
npm install @itk-wasm/compress-stringify
```

## Usage

### Browser interface

Import:

```js
import {
  imageToJson,
  jsonToImage,
  meshToJson,
  jsonToMesh,
  polyDataToJson,
  jsonToPolyData,
  compressStringify,
  parseStringDecompress,
  setPipelinesBaseUrl,
  getPipelinesBaseUrl,
} from "@itk-wasm/compress-stringify"
```

### Functions

#### imageToJson

*Compress and encode an itk-wasm Image into a JSON compatible object.*

```ts
async function imageToJson(
  image: Image,
  options: ImageToJsonOptions = {}
): Promise<ImageToJsonResult>
```

| Parameter |     Type     | Description  |
| :-------: | :----------: | :----------- |
|  `image`  |   *Image*    | Input image |

**`ImageToJsonOptions` interface:**

|      Property      |             Type            | Description                                                                                                                                           |
| :----------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`      |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`ImageToJsonResult` interface:**

| Property |     Type     | Description              |
| :------: | :----------: | :----------------------- |
| `encoded` | *ImageJson* | Output encoded image JSON, binary data is a compressed string |
| `webWorker` |   *Worker*   | WebWorker used for computation. |

#### jsonToImage

*Decode and decompress an itk-wasm Image JSON, binary data compressed and converted to a string.*

```ts
async function jsonToImage(
  encoded: ImageJson,
  options: JsonToImageOptions = {}
): Promise<JsonToImageResult>
```

| Parameter |     Type     | Description  |
| :-------: | :----------: | :----------- |
|  `encoded` |   *ImageJson*  | Input encoded image |

**`JsonToImageOptions` interface:**

|      Property      |             Type            | Description                                                                                                                                           |
| :----------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`      |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`JsonToImageResult` interface:**

| Property |     Type     | Description              |
| :------: | :----------: | :----------------------- |
| `decoded` | *Image*     |   Output decoded image   |
| `webWorker` |   *Worker*   | WebWorker used for computation. |

#### meshToJson

*Compress and encode an itk-wasm Mesh into a JSON compatible object.*

```ts
async function meshToJson(
  mesh: Mesh,
  options: MeshToJsonOptions = {}
): Promise<MeshToJsonResult>
```

| Parameter |     Type     | Description  |
| :-------: | :----------: | :----------- |
|  `mesh`  |   *Mesh*    | Input mesh |

**`MeshToJsonOptions` interface:**

|      Property      |             Type            | Description                                                                                                                                           |
| :----------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`      |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`MeshToJsonResult` interface:**

| Property |     Type     | Description              |
| :------: | :----------: | :----------------------- |
| `encoded` | *MeshJson* | Output encoded mesh JSON, binary data is a compressed string |
| `webWorker` |   *Worker*   | WebWorker used for computation. |

#### jsonToMesh

*Decode and decompress an itk-wasm Mesh JSON, binary data compressed and converted to a string.*

```ts
async function jsonToMesh(
  encoded: MeshJson,
  options: JsonToMeshOptions = {}
): Promise<JsonToMeshResult>
```

| Parameter |     Type     | Description  |
| :-------: | :----------: | :----------- |
|  `encoded` |   *MeshJson*  | Input encoded mesh |

**`JsonToMeshOptions` interface:**

|      Property      |             Type            | Description                                                                                                                                           |
| :----------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`      |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`JsonToMeshResult` interface:**

| Property |     Type     | Description              |
| :------: | :----------: | :----------------------- |
| `decoded` | *Mesh*     |   Output decoded mesh   |
| `webWorker` |   *Worker*   | WebWorker used for computation. |

#### polyDataToJson

*Compress and encode an itk-wasm PolyData into a JSON compatible object.*

```ts
async function polyDataToJson(
  polyData: PolyData,
  options: PolyDataToJsonOptions = {}
): Promise<PolyDataToJsonResult>
```

| Parameter |     Type     | Description  |
| :-------: | :----------: | :----------- |
|  `polyData`  |   *PolyData*    | Input polyData |

**`PolyDataToJsonOptions` interface:**

|      Property      |             Type            | Description                                                                                                                                           |
| :----------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`      |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`PolyDataToJsonResult` interface:**

| Property |     Type     | Description              |
| :------: | :----------: | :----------------------- |
| `encoded` | *PolyDataJson* | Output encoded polyData JSON, binary data is a compressed string |
| `webWorker` |   *Worker*   | WebWorker used for computation. |

#### jsonToPolyData

*Decode and decompress an itk-wasm PolyData JSON compatible object.*

```ts
async function jsonToPolyData(
  encoded: PolyDataJson,
  options: JsonToPolyDataOptions = {}
): Promise<JsonToPolyDataResult>
```

| Parameter |     Type     | Description  |
| :-------: | :----------: | :----------- |
|  `encoded` |   *PolyDataJson*  | Input encoded polyData |

**`JsonToPolyDataOptions` interface:**

|      Property      |             Type            | Description                                                                                                                                           |
| :----------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`      |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`JsonToPolyDataResult` interface:**

| Property |     Type     | Description              |
| :------: | :----------: | :----------------------- |
| `decoded` | *PolyData*     |   Output decoded polyData   |
| `webWorker` |   *Worker*   | WebWorker used for computation. |

#### compressStringify

*Given a binary, compress and optionally base64 encode.*

```ts
async function compressStringify(
  input: Uint8Array,
  options: CompressStringifyOptions = {}
) : Promise<CompressStringifyResult>
```

| Parameter |     Type     | Description  |
| :-------: | :----------: | :----------- |
|  `input`  | *Uint8Array* | Input binary |

**`CompressStringifyOptions` interface:**

|      Property      |             Type            | Description                                                                                                                                           |
| :----------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `stringify`    |          *boolean*          | Stringify the output                                                                                                                                  |
| `compressionLevel` |           *number*          | Compression level, typically 1-9                                                                                                                      |
|   `dataUrlPrefix`  |           *string*          | dataURL prefix                                                                                                                                        |
|     `webWorker`    | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|      `noCopy`      |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`CompressStringifyResult` interface:**

|   Property  |     Type     | Description                     |
| :---------: | :----------: | :------------------------------ |
|   `output`  | *Uint8Array* | Output compressed binary        |
| `webWorker` |   *Worker*   | WebWorker used for computation. |

#### parseStringDecompress

*Given a binary or string produced with compress-stringify, decompress and optionally base64 decode.*

```ts
async function parseStringDecompress(
  input: Uint8Array,
  options: ParseStringDecompressOptions = {}
) : Promise<ParseStringDecompressResult>
```

| Parameter |     Type     | Description      |
| :-------: | :----------: | :--------------- |
|  `input`  | *Uint8Array* | Compressed input |

**`ParseStringDecompressOptions` interface:**

|    Property   |             Type            | Description                                                                                                                                           |
| :-----------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `parseString` |          *boolean*          | Parse the input string before decompression                                                                                                           |
|  `webWorker`  | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|    `noCopy`   |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`ParseStringDecompressResult` interface:**

|   Property  |     Type     | Description                     |
| :---------: | :----------: | :------------------------------ |
|   `output`  | *Uint8Array* | Output decompressed binary      |
| `webWorker` |   *Worker*   | WebWorker used for computation. |

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
  imageToJsonNode,
  jsonToImageNode,
  meshToJsonNode,
  jsonToMeshNode,
  polyDataToJsonNode,
  jsonToPolyDataNode,
  compressStringifyNode,
  parseStringDecompressNode,
} from "@itk-wasm/compress-stringify"
```

#### imageToJsonNode

*Compress and encode an itk-wasm Image into a JSON compatible object.*

```ts
async function imageToJsonNode(image: Image): Promise<ImageToJsonNodeResult>
```

| Parameter |     Type     | Description  |
| :-------: | :----------: | :----------- |
|  `image`  |   *Image*    | Input image |

**`ImageToJsonNodeResult` interface:**

| Property |     Type     | Description              |
| :------: | :----------: | :----------------------- |
| `encoded` | *ImageJson* | Output encoded image JSON, binary data converted to a compressed string |

#### jsonToImageNode

*Decode and decompress an itk-wasm Image JSON compatible object.*

```ts
async function jsonToImageNode(encoded: ImageJson): Promise<JsonToImageNodeResult>
```

| Parameter |     Type     | Description  |
| :-------: | :----------: | :----------- |
|  `encoded` |   *string*  | Input encoded image |

**`JsonToImageNodeResult` interface:**

| Property |     Type     | Description              |
| :------: | :----------: | :----------------------- |
| `decoded` | *Image*     |   Output decoded image   |

#### meshToJsonNode

*Compress and encode an itk-wasm Mesh into a JSON compatible object.*

```ts
async function meshToJsonNode(mesh: Mesh): Promise<MeshToJsonNodeResult>
```

| Parameter |     Type     | Description  |
| :-------: | :----------: | :----------- |
|  `mesh`   |   *Mesh*     | Input mesh |

**`MeshToJsonNodeResult` interface:**

| Property |     Type     | Description              |
| :------: | :----------: | :----------------------- |
| `encoded` | *MeshJson* | Output encoded mesh JSON, binary data compressed and converted to a string |

#### jsonToMeshNode

*Decode and decompress an itk-wasm Mesh JSON compatible object.*

```ts
async function jsonToMeshNode(encoded: MeshJson): Promise<JsonToMeshNodeResult>
```

| Parameter |     Type     | Description  |
| :-------: | :----------: | :----------- |
|  `encoded` |   *MeshJson*  | Input encoded mesh |

**`JsonToMeshNodeResult` interface:**

| Property |     Type     | Description              |
| :------: | :----------: | :----------------------- |
| `decoded` | *Mesh*     |   Output decoded mesh   |

#### polyDataToJsonNode

*Compress and encode an itk-wasm PolyData into a JSON compatible object.*

```ts
async function polyDataToJsonNode(polyData: PolyData): Promise<PolyDataToJsonNodeResult>
```

| Parameter |     Type     | Description  |
| :-------: | :----------: | :----------- |
|  `polyData`   |   *PolyData*     | Input polyData |

**`PolyDataToJsonNodeResult` interface:**

| Property |     Type     | Description              |
| :------: | :----------: | :----------------------- |
| `encoded` | *PolyDataJson* | Output encoded polyData JSON, binary data compressed and converted to a string |

#### jsonToPolyDataNode

*Decode and decompress an itk-wasm PolyData JSON string.*

```ts
async function jsonToPolyDataNode(encoded: PolyDataJson): Promise<JsonToPolyDataNodeResult>
```

| Parameter |     Type     | Description  |
| :-------: | :----------: | :----------- |
|  `encoded` |   *PolyDataJson*  | Input encoded polyData |

**`JsonToPolyDataNodeResult` interface:**

| Property |     Type     | Description              |
| :------: | :----------: | :----------------------- |
| `decoded` | *PolyData*     |   Output decoded polyData   |

#### compressStringifyNode

*Given a binary, compress and optionally base64 encode.*

```ts
async function compressStringifyNode(
  input: Uint8Array,
  options: CompressStringifyNodeOptions = {}
) : Promise<CompressStringifyNodeResult>
```

| Parameter |     Type     | Description  |
| :-------: | :----------: | :----------- |
|  `input`  | *Uint8Array* | Input binary |

**`CompressStringifyNodeOptions` interface:**

|      Property      |    Type   | Description                      |
| :----------------: | :-------: | :------------------------------- |
|     `stringify`    | *boolean* | Stringify the output             |
| `compressionLevel` |  *number* | Compression level, typically 1-9 |
|   `dataUrlPrefix`  |  *string* | dataURL prefix                   |

**`CompressStringifyNodeResult` interface:**

| Property |     Type     | Description              |
| :------: | :----------: | :----------------------- |
| `output` | *Uint8Array* | Output compressed binary |

#### parseStringDecompressNode

*Given a binary or string produced with compress-stringify, decompress and optionally base64 decode.*

```ts
async function parseStringDecompressNode(
  input: Uint8Array,
  options: ParseStringDecompressNodeOptions = {}
) : Promise<ParseStringDecompressNodeResult>
```

| Parameter |     Type     | Description      |
| :-------: | :----------: | :--------------- |
|  `input`  | *Uint8Array* | Compressed input |

**`ParseStringDecompressNodeOptions` interface:**

|    Property   |    Type   | Description                                 |
| :-----------: | :-------: | :------------------------------------------ |
| `parseString` | *boolean* | Parse the input string before decompression |

**`ParseStringDecompressNodeResult` interface:**

| Property |     Type     | Description                |
| :------: | :----------: | :------------------------- |
| `output` | *Uint8Array* | Output decompressed binary |
