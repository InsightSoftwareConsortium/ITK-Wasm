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
  compressStringify,
  parseStringDecompress,
  setPipelinesBaseUrl,
  getPipelinesBaseUrl,
} from "@itk-wasm/compress-stringify"
```

### Functions

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
  compressStringifyNode,
  parseStringDecompressNode,
} from "@itk-wasm/compress-stringify"
```

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
