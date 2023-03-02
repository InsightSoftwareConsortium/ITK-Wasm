# @itk-wasm/dicom

[![npm version](https://badge.fury.io/js/@itk-wasm%2Fdicom.svg)](https://www.npmjs.com/package/@itk-wasm/dicom)

Read files and images related to DICOM file format.

## Installation

```sh
npm install @itk-wasm/dicom
```

## Usage

### Browser interface

Import:

```js
import {
  applyPresentationStateToImage,
  readDicomEncapsulatedPdf,
  structuredReportToHtml,
  structuredReportToText,
  setPipelinesBaseUrl,
  getPipelinesBaseUrl,
  setPipelineWorkerUrl,
  getPipelineWorkerUrl,
} from "@itk-wasm/dicom"
```

#### applyPresentationStateToImage

*Apply a presentation state to a given DICOM image and render output as pgm bitmap or dicom file.*

```ts
async function applyPresentationStateToImage(
  webWorker: null | Worker,
  imageIn: Uint8Array,
  options: ApplyPresentationStateToImageOptions = {}
) : Promise<ApplyPresentationStateToImageResult>
```

| Parameter |     Type     | Description      |
| :-------: | :----------: | :--------------- |
| `imageIn` | *Uint8Array* | Input DICOM file |

**`ApplyPresentationStateToImageOptions` interface:**

|          Property         |     Type     | Description                                                      |
| :-----------------------: | :----------: | :--------------------------------------------------------------- |
|  `presentationStateFile`  | *Uint8Array* | filename: string. Process using presentation state file          |
|        `configFile`       |   *string*   | filename: string. Process using settings from configuration file |
|          `frame`          |   *number*   | frame: integer. Process using image frame f (default: 1)         |
| `presentationStateOutput` |   *boolean*  | get presentation state information in text stream (default: ON). |
|       `bitmapOutput`      |   *boolean*  | get resulting image as bitmap output stream (default: ON).       |
|           `pgm`           |   *boolean*  | save image as PGM (default)                                      |
|          `dicom`          |   *boolean*  | save image as DICOM secondary capture                            |

**`ApplyPresentationStateToImageResult` interface:**

|           Property           |   Type   | Description                    |
| :--------------------------: | :------: | :----------------------------- |
|         **webWorker**        | *Worker* | WebWorker used for computation |
| `presentationStateOutStream` | *Object* | Output overlay information     |
|         `outputImage`        |  *Image* | Output image                   |

#### readDicomEncapsulatedPdf

*Extract PDF file from DICOM encapsulated PDF.*

```ts
async function readDicomEncapsulatedPdf(
  webWorker: null | Worker,
  dicomFile: Uint8Array,
  options: ReadDicomEncapsulatedPdfOptions = {}
) : Promise<ReadDicomEncapsulatedPdfResult>
```

|  Parameter  |     Type     | Description      |
| :---------: | :----------: | :--------------- |
| `dicomFile` | *Uint8Array* | Input DICOM file |

**`ReadDicomEncapsulatedPdfOptions` interface:**

|       Property      |    Type   | Description                                    |
| :-----------------: | :-------: | :--------------------------------------------- |
|    `readFileOnly`   | *boolean* | read file format only                          |
|    `readDataset`    | *boolean* | read data set without file meta information    |
|    `readXferAuto`   | *boolean* | use TS recognition (default)                   |
|   `readXferDetect`  | *boolean* | ignore TS specified in the file meta header    |
|   `readXferLittle`  | *boolean* | read with explicit VR little endian TS         |
|    `readXferBig`    | *boolean* | read with explicit VR big endian TS            |
|  `readXferImplicit` | *boolean* | read with implicit VR little endian TS         |
|  `acceptOddLength`  | *boolean* | accept odd length attributes (default)         |
|  `assumeEvenLength` | *boolean* | assume real length is one byte larger          |
|    `enableCp246`    | *boolean* | read undefined len UN as implicit VR (default) |
|    `disableCp246`   | *boolean* | read undefined len UN as explicit VR           |
|      `retainUn`     | *boolean* | retain elements as UN (default)                |
|     `convertUn`     | *boolean* | convert to real VR if known                    |
|  `enableCorrection` | *boolean* | enable automatic data correction (default)     |
| `disableCorrection` | *boolean* | disable automatic data correction              |

**`ReadDicomEncapsulatedPdfResult` interface:**

|      Property     |     Type     | Description                    |
| :---------------: | :----------: | :----------------------------- |
|   **webWorker**   |   *Worker*   | WebWorker used for computation |
| `pdfBinaryOutput` | *Uint8Array* | Output pdf file                |

#### structuredReportToHtml

*Render DICOM SR file and data set to HTML/XHTML*

```ts
async function structuredReportToHtml(
  webWorker: null | Worker,
  dicomFile: Uint8Array,
  options: StructuredReportToHtmlOptions = {}
) : Promise<StructuredReportToHtmlResult>
```

|  Parameter  |     Type     | Description      |
| :---------: | :----------: | :--------------- |
| `dicomFile` | *Uint8Array* | Input DICOM file |

**`StructuredReportToHtmlOptions` interface:**

|        Property       |    Type   | Description                                                                                              |
| :-------------------: | :-------: | :------------------------------------------------------------------------------------------------------- |
|     `readFileOnly`    | *boolean* | read file format only                                                                                    |
|     `readDataset`     | *boolean* | read data set without file meta information                                                              |
|     `readXferAuto`    | *boolean* | use TS recognition (default)                                                                             |
|    `readXferDetect`   | *boolean* | ignore TS specified in the file meta header                                                              |
|    `readXferLittle`   | *boolean* | read with explicit VR little endian TS                                                                   |
|     `readXferBig`     | *boolean* | read with explicit VR big endian TS                                                                      |
|   `readXferImplicit`  | *boolean* | read with implicit VR little endian TS                                                                   |
|  `processingDetails`  | *boolean* | show currently processed content item                                                                    |
| `unknownRelationship` | *boolean* | accept unknown/missing relationship type                                                                 |
|   `invalidItemValue`  | *boolean* | accept invalid content item value
(e.g. violation of VR or VM definition)                                |
|  `ignoreConstraints`  | *boolean* | ignore relationship content constraints                                                                  |
|   `ignoreItemErrors`  | *boolean* | do not abort on content item errors, just warn
(e.g. missing value type specific attributes)             |
|   `skipInvalidItems`  | *boolean* | skip invalid content items (incl. sub-tree)                                                              |
|   `disableVrChecker`  | *boolean* | disable check for VR-conformant string values                                                            |
|    `charsetRequire`   | *boolean* | require declaration of ext. charset (default)                                                            |
|    `charsetAssume`    |  *string* | [c]harset: string, assume charset c if no extended charset declared                                      |
|   `charsetCheckAll`   | *boolean* | check all data elements with string values
(default: only PN, LO, LT, SH, ST, UC and UT)                 |
|    `convertToUtf8`    | *boolean* | convert all element values that are affected
by Specific Character Set (0008,0005) to UTF-8              |
|      `urlPrefix`      |  *string* | URL: string. Append specificed URL prefix to hyperlinks of referenced composite objects in the document. |
|        `html32`       | *boolean* | use only HTML version 3.2 compatible features                                                            |
|        `html40`       | *boolean* | allow all HTML version 4.01 features (default)                                                           |
|       `xhtml11`       | *boolean* | comply with XHTML version 1.1 specification                                                              |
|   `addDocumentType`   | *boolean* | add reference to SGML document type definition                                                           |
|     `cssReference`    |  *string* | URL: string. Add reference to specified CSS to document                                                  |
|       `cssFile`       |  *string* | [f]ilename: string. Embed content of specified CSS into document                                         |
|     `expandInline`    | *boolean* | expand short content items inline (default)                                                              |
|  `neverExpandInline`  | *boolean* | never expand content items inline                                                                        |
|  `alwaysExpandInline` | *boolean* | always expand content items inline                                                                       |
|    `renderFullData`   | *boolean* | render full data of content items                                                                        |
|  `sectionTitleInline` | *boolean* | render section titles inline, not separately                                                             |
|  `documentTypeTitle`  | *boolean* | use document type as document title (default)                                                            |
|   `patientInfoTitle`  | *boolean* | use patient information as document title                                                                |
|   `noDocumentHeader`  | *boolean* | do not render general document information                                                               |
|  `renderInlineCodes`  | *boolean* | render codes in continuous text blocks                                                                   |
|   `conceptNameCodes`  | *boolean* | render code of concept names                                                                             |
|   `numericUnitCodes`  | *boolean* | render code of numeric measurement units                                                                 |
|    `codeValueUnit`    | *boolean* | use code value as measurement unit (default)                                                             |
|   `codeMeaningUnit`   | *boolean* | use code meaning as measurement unit                                                                     |
|    `renderAllCodes`   | *boolean* | render all codes (implies +Ci, +Cn and +Cu)                                                              |
|  `codeDetailsTooltip` | *boolean* | render code details as a tooltip (implies +Cc)                                                           |

**`StructuredReportToHtmlResult` interface:**

|    Property   |   Type   | Description                    |
| :-----------: | :------: | :----------------------------- |
| **webWorker** | *Worker* | WebWorker used for computation |
|  `outputText` | *string* | Output text file               |

#### structuredReportToText

*Read a DICOM structured report file and generate a plain text representation*

```ts
async function structuredReportToText(
  webWorker: null | Worker,
  dicomFile: Uint8Array,
  options: StructuredReportToTextOptions = {}
) : Promise<StructuredReportToTextResult>
```

|  Parameter  |     Type     | Description      |
| :---------: | :----------: | :--------------- |
| `dicomFile` | *Uint8Array* | Input DICOM file |

**`StructuredReportToTextOptions` interface:**

|        Property       |    Type   | Description                       |
| :-------------------: | :-------: | :-------------------------------- |
| `unknownRelationship` | *boolean* | Accept unknown relationship type  |
|   `invalidItemValue`  | *boolean* | Accept invalid content item value |
|  `ignoreConstraints`  | *boolean* | Ignore relationship constraints   |
|   `ignoreItemErrors`  | *boolean* | Ignore content item errors        |
|   `skipInvalidItems`  | *boolean* | Skip invalid content items        |
|   `noDocumentHeader`  | *boolean* | Print no document header          |
|  `numberNestedItems`  | *boolean* | Number nested items               |
|  `shortenLongValues`  | *boolean* | Shorten long item values          |
|   `printInstanceUid`  | *boolean* | Print SOP Instance UID            |
|  `printSopclassShort` | *boolean* | Print short SOP class name        |
|  `printSopclassLong`  | *boolean* | Print SOP class name              |
|   `printSopclassUid`  | *boolean* | Print long SOP class name         |
|    `printAllCodes`    | *boolean* | Print all codes                   |
|  `printInvalidCodes`  | *boolean* | Print invalid codes               |
|   `printTemplateId`   | *boolean* | Print template identification     |
|   `indicateEnhanced`  | *boolean* | Indicate enhanced encoding mode   |
|      `printColor`     | *boolean* | Use ANSI escape codes             |

**`StructuredReportToTextResult` interface:**

|    Property   |   Type   | Description                    |
| :-----------: | :------: | :----------------------------- |
| **webWorker** | *Worker* | WebWorker used for computation |
|  `outputText` | *string* | Output text file               |

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
  applyPresentationStateToImageNode,
  readDicomEncapsulatedPdfNode,
  structuredReportToHtmlNode,
  structuredReportToTextNode,
  setPipelinesBaseUrl,
  getPipelinesBaseUrl,
  setPipelineWorkerUrl,
  getPipelineWorkerUrl,
} from "@itk-wasm/dicom"
```

#### applyPresentationStateToImageNode

*Apply a presentation state to a given DICOM image and render output as pgm bitmap or dicom file.*

```ts
async function applyPresentationStateToImageNode(
  imageIn: Uint8Array,
  options: ApplyPresentationStateToImageOptions = {}
) : Promise<ApplyPresentationStateToImageNodeResult>
```

| Parameter |     Type     | Description      |
| :-------: | :----------: | :--------------- |
| `imageIn` | *Uint8Array* | Input DICOM file |

**`ApplyPresentationStateToImageNodeOptions` interface:**

|          Property         |     Type     | Description                                                      |
| :-----------------------: | :----------: | :--------------------------------------------------------------- |
|  `presentationStateFile`  | *Uint8Array* | filename: string. Process using presentation state file          |
|        `configFile`       |   *string*   | filename: string. Process using settings from configuration file |
|          `frame`          |   *number*   | frame: integer. Process using image frame f (default: 1)         |
| `presentationStateOutput` |   *boolean*  | get presentation state information in text stream (default: ON). |
|       `bitmapOutput`      |   *boolean*  | get resulting image as bitmap output stream (default: ON).       |
|           `pgm`           |   *boolean*  | save image as PGM (default)                                      |
|          `dicom`          |   *boolean*  | save image as DICOM secondary capture                            |

**`ApplyPresentationStateToImageNodeResult` interface:**

|           Property           |   Type   | Description                |
| :--------------------------: | :------: | :------------------------- |
| `presentationStateOutStream` | *Object* | Output overlay information |
|         `outputImage`        |  *Image* | Output image               |

#### readDicomEncapsulatedPdfNode

*Extract PDF file from DICOM encapsulated PDF.*

```ts
async function readDicomEncapsulatedPdfNode(
  dicomFile: Uint8Array,
  options: ReadDicomEncapsulatedPdfOptions = {}
) : Promise<ReadDicomEncapsulatedPdfNodeResult>
```

|  Parameter  |     Type     | Description      |
| :---------: | :----------: | :--------------- |
| `dicomFile` | *Uint8Array* | Input DICOM file |

**`ReadDicomEncapsulatedPdfNodeOptions` interface:**

|       Property      |    Type   | Description                                    |
| :-----------------: | :-------: | :--------------------------------------------- |
|    `readFileOnly`   | *boolean* | read file format only                          |
|    `readDataset`    | *boolean* | read data set without file meta information    |
|    `readXferAuto`   | *boolean* | use TS recognition (default)                   |
|   `readXferDetect`  | *boolean* | ignore TS specified in the file meta header    |
|   `readXferLittle`  | *boolean* | read with explicit VR little endian TS         |
|    `readXferBig`    | *boolean* | read with explicit VR big endian TS            |
|  `readXferImplicit` | *boolean* | read with implicit VR little endian TS         |
|  `acceptOddLength`  | *boolean* | accept odd length attributes (default)         |
|  `assumeEvenLength` | *boolean* | assume real length is one byte larger          |
|    `enableCp246`    | *boolean* | read undefined len UN as implicit VR (default) |
|    `disableCp246`   | *boolean* | read undefined len UN as explicit VR           |
|      `retainUn`     | *boolean* | retain elements as UN (default)                |
|     `convertUn`     | *boolean* | convert to real VR if known                    |
|  `enableCorrection` | *boolean* | enable automatic data correction (default)     |
| `disableCorrection` | *boolean* | disable automatic data correction              |

**`ReadDicomEncapsulatedPdfNodeResult` interface:**

|      Property     |     Type     | Description     |
| :---------------: | :----------: | :-------------- |
| `pdfBinaryOutput` | *Uint8Array* | Output pdf file |

#### structuredReportToHtmlNode

*Render DICOM SR file and data set to HTML/XHTML*

```ts
async function structuredReportToHtmlNode(
  dicomFile: Uint8Array,
  options: StructuredReportToHtmlOptions = {}
) : Promise<StructuredReportToHtmlNodeResult>
```

|  Parameter  |     Type     | Description      |
| :---------: | :----------: | :--------------- |
| `dicomFile` | *Uint8Array* | Input DICOM file |

**`StructuredReportToHtmlNodeOptions` interface:**

|        Property       |    Type   | Description                                                                                              |
| :-------------------: | :-------: | :------------------------------------------------------------------------------------------------------- |
|     `readFileOnly`    | *boolean* | read file format only                                                                                    |
|     `readDataset`     | *boolean* | read data set without file meta information                                                              |
|     `readXferAuto`    | *boolean* | use TS recognition (default)                                                                             |
|    `readXferDetect`   | *boolean* | ignore TS specified in the file meta header                                                              |
|    `readXferLittle`   | *boolean* | read with explicit VR little endian TS                                                                   |
|     `readXferBig`     | *boolean* | read with explicit VR big endian TS                                                                      |
|   `readXferImplicit`  | *boolean* | read with implicit VR little endian TS                                                                   |
|  `processingDetails`  | *boolean* | show currently processed content item                                                                    |
| `unknownRelationship` | *boolean* | accept unknown/missing relationship type                                                                 |
|   `invalidItemValue`  | *boolean* | accept invalid content item value
(e.g. violation of VR or VM definition)                                |
|  `ignoreConstraints`  | *boolean* | ignore relationship content constraints                                                                  |
|   `ignoreItemErrors`  | *boolean* | do not abort on content item errors, just warn
(e.g. missing value type specific attributes)             |
|   `skipInvalidItems`  | *boolean* | skip invalid content items (incl. sub-tree)                                                              |
|   `disableVrChecker`  | *boolean* | disable check for VR-conformant string values                                                            |
|    `charsetRequire`   | *boolean* | require declaration of ext. charset (default)                                                            |
|    `charsetAssume`    |  *string* | [c]harset: string, assume charset c if no extended charset declared                                      |
|   `charsetCheckAll`   | *boolean* | check all data elements with string values
(default: only PN, LO, LT, SH, ST, UC and UT)                 |
|    `convertToUtf8`    | *boolean* | convert all element values that are affected
by Specific Character Set (0008,0005) to UTF-8              |
|      `urlPrefix`      |  *string* | URL: string. Append specificed URL prefix to hyperlinks of referenced composite objects in the document. |
|        `html32`       | *boolean* | use only HTML version 3.2 compatible features                                                            |
|        `html40`       | *boolean* | allow all HTML version 4.01 features (default)                                                           |
|       `xhtml11`       | *boolean* | comply with XHTML version 1.1 specification                                                              |
|   `addDocumentType`   | *boolean* | add reference to SGML document type definition                                                           |
|     `cssReference`    |  *string* | URL: string. Add reference to specified CSS to document                                                  |
|       `cssFile`       |  *string* | [f]ilename: string. Embed content of specified CSS into document                                         |
|     `expandInline`    | *boolean* | expand short content items inline (default)                                                              |
|  `neverExpandInline`  | *boolean* | never expand content items inline                                                                        |
|  `alwaysExpandInline` | *boolean* | always expand content items inline                                                                       |
|    `renderFullData`   | *boolean* | render full data of content items                                                                        |
|  `sectionTitleInline` | *boolean* | render section titles inline, not separately                                                             |
|  `documentTypeTitle`  | *boolean* | use document type as document title (default)                                                            |
|   `patientInfoTitle`  | *boolean* | use patient information as document title                                                                |
|   `noDocumentHeader`  | *boolean* | do not render general document information                                                               |
|  `renderInlineCodes`  | *boolean* | render codes in continuous text blocks                                                                   |
|   `conceptNameCodes`  | *boolean* | render code of concept names                                                                             |
|   `numericUnitCodes`  | *boolean* | render code of numeric measurement units                                                                 |
|    `codeValueUnit`    | *boolean* | use code value as measurement unit (default)                                                             |
|   `codeMeaningUnit`   | *boolean* | use code meaning as measurement unit                                                                     |
|    `renderAllCodes`   | *boolean* | render all codes (implies +Ci, +Cn and +Cu)                                                              |
|  `codeDetailsTooltip` | *boolean* | render code details as a tooltip (implies +Cc)                                                           |

**`StructuredReportToHtmlNodeResult` interface:**

|   Property   |   Type   | Description      |
| :----------: | :------: | :--------------- |
| `outputText` | *string* | Output text file |

#### structuredReportToTextNode

*Read a DICOM structured report file and generate a plain text representation*

```ts
async function structuredReportToTextNode(
  dicomFile: Uint8Array,
  options: StructuredReportToTextOptions = {}
) : Promise<StructuredReportToTextNodeResult>
```

|  Parameter  |     Type     | Description      |
| :---------: | :----------: | :--------------- |
| `dicomFile` | *Uint8Array* | Input DICOM file |

**`StructuredReportToTextNodeOptions` interface:**

|        Property       |    Type   | Description                       |
| :-------------------: | :-------: | :-------------------------------- |
| `unknownRelationship` | *boolean* | Accept unknown relationship type  |
|   `invalidItemValue`  | *boolean* | Accept invalid content item value |
|  `ignoreConstraints`  | *boolean* | Ignore relationship constraints   |
|   `ignoreItemErrors`  | *boolean* | Ignore content item errors        |
|   `skipInvalidItems`  | *boolean* | Skip invalid content items        |
|   `noDocumentHeader`  | *boolean* | Print no document header          |
|  `numberNestedItems`  | *boolean* | Number nested items               |
|  `shortenLongValues`  | *boolean* | Shorten long item values          |
|   `printInstanceUid`  | *boolean* | Print SOP Instance UID            |
|  `printSopclassShort` | *boolean* | Print short SOP class name        |
|  `printSopclassLong`  | *boolean* | Print SOP class name              |
|   `printSopclassUid`  | *boolean* | Print long SOP class name         |
|    `printAllCodes`    | *boolean* | Print all codes                   |
|  `printInvalidCodes`  | *boolean* | Print invalid codes               |
|   `printTemplateId`   | *boolean* | Print template identification     |
|   `indicateEnhanced`  | *boolean* | Indicate enhanced encoding mode   |
|      `printColor`     | *boolean* | Use ANSI escape codes             |

**`StructuredReportToTextNodeResult` interface:**

|   Property   |   Type   | Description      |
| :----------: | :------: | :--------------- |
| `outputText` | *string* | Output text file |
