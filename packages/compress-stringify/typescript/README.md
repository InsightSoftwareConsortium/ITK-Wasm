# itk-compress-stringify

[![npm version](https://badge.fury.io/js/itk-compress-stringify.svg)](https://www.npmjs.com/package/itk-compress-stringify)

Zstandard compression and decompression and base64 encoding and decoding in WebAssembly.

## Installation

```sh
npm install itk-compress-stringify
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
} from "itk-compress-stringify"
```

### Functions

#### compressStringify

*Given a binary, compress and optionally base64 encode.*

```ts
async function compressStringify(
  webWorker: null | Worker,
  input: Uint8Array,
  options: CompressStringifyOptions = {}
) : Promise<CompressStringifyResult>
```

| Parameter |     Type     | Description  |
| :-------: | :----------: | :----------- |
|  `input`  | *Uint8Array* | Input binary |

**`CompressStringifyOptions` interface:**

|      Property      |    Type   | Description                      |
| :----------------: | :-------: | :------------------------------- |
|     `stringify`    | *boolean* | Stringify the output             |
| `compressionLevel` |  *number* | Compression level, typically 1-9 |
|   `dataUrlPrefix`  |  *string* | dataURL prefix                   |

**`CompressStringifyResult` interface:**

|    Property   |     Type     | Description                    |
| :-----------: | :----------: | :----------------------------- |
| **webWorker** |   *Worker*   | WebWorker used for computation |
|    `output`   | *Uint8Array* | Output compressed binary       |

#### parseStringDecompress

*Given a binary or string produced with compressStringify, decompress and optionally base64 decode.*

```ts
async function parseStringDecompress(
  webWorker: null | Worker,
  input: Uint8Array,
  options: ParseStringDecompressOptions = {}
) : Promise<ParseStringDecompressResult>
```

| Parameter |     Type     | Description      |
| :-------: | :----------: | :--------------- |
|  `input`  | *Uint8Array* | Compressed input |

**`ParseStringDecompressOptions` interface:**

|    Property   |    Type   | Description                                 |
| :-----------: | :-------: | :------------------------------------------ |
| `parseString` | *boolean* | Parse the input string before decompression |

**`ParseStringDecompressResult` interface:**

|    Property   |     Type     | Description                    |
| :-----------: | :----------: | :----------------------------- |
| **webWorker** |   *Worker*   | WebWorker used for computation |
|    `output`   | *Uint8Array* | Output decompressed binary     |

### Node interface

Import:

```js
import {
  compressStringifyNode,
  parseStringDecompressNode,
} from "itk-compress-stringify"
```

#### compressStringifyNode

*Given a binary, compress and optionally base64 encode.*

```ts
async function compressStringifyNode(
  input: Uint8Array,
  options: CompressStringifyOptions = {}
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

*Given a binary or string produced with CompressedStringify, decompress and optionally base64 decode.*

```ts
async function parseStringDecompressNode(
  input: Uint8Array,
  options: ParseStringDecompressOptions = {}
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