# @itk-wasm/dicom

[![npm version](https://badge.fury.io/js/@itk-wasm%2Fdicom.svg)](https://www.npmjs.com/package/@itk-wasm/dicom)

> Read files and images related to DICOM file format.

[💻 **Live API Demo** ✨](https://insightsoftwareconsortium.github.io/ITK-Wasm/dicom/ts/app/
 ':include :type=iframe width=100% height=800px')

[🕮 **Documentation** 📚](https://insightsoftwareconsortium.github.io/ITK-Wasm/dicom/ts/docs/)

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
  readDicomTags,
  readImageDicomFileSeries,
  setPipelinesBaseUrl,
  getPipelinesBaseUrl,
} from "@itk-wasm/dicom"
```

#### applyPresentationStateToImage

*Apply a presentation state to a given DICOM image and render output as bitmap, or dicom file.*

```ts
async function applyPresentationStateToImage(
  imageIn: File | BinaryFile,
  presentationStateFile: File | BinaryFile,
  options: ApplyPresentationStateToImageOptions = {}
) : Promise<ApplyPresentationStateToImageResult>
```

|        Parameter        |         Type        | Description                           |
| :---------------------: | :-----------------: | :------------------------------------ |
|        `imageIn`        | *File | BinaryFile* | Input DICOM file                      |
| `presentationStateFile` | *File | BinaryFile* | Process using presentation state file |

**`ApplyPresentationStateToImageOptions` interface:**

|           Property          |             Type            | Description                                                                                                                                           |
| :-------------------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|        `colorOutput`        |          *boolean*          | output image as RGB (default: false)                                                                                                                  |
|         `configFile`        |           *string*          | filename: string. Process using settings from configuration file                                                                                      |
|           `frame`           |           *number*          | frame: integer. Process using image frame f (default: 1)                                                                                              |
| `noPresentationStateOutput` |          *boolean*          | Do not get presentation state information in text stream.                                                                                             |
|       `noBitmapOutput`      |          *boolean*          | Do not get resulting image as bitmap output stream.                                                                                                   |
|         `webWorker`         | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|           `noCopy`          |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`ApplyPresentationStateToImageResult` interface:**

|           Property           |       Type       | Description                     |
| :--------------------------: | :--------------: | :------------------------------ |
| `presentationStateOutStream` | *JsonCompatible* | Output overlay information      |
|         `outputImage`        |      *Image*     | Output image                    |
|          `webWorker`         |     *Worker*     | WebWorker used for computation. |

#### readDicomEncapsulatedPdf

*Extract PDF file from DICOM encapsulated PDF.*

```ts
async function readDicomEncapsulatedPdf(
  dicomFile: File | BinaryFile,
  options: ReadDicomEncapsulatedPdfOptions = {}
) : Promise<ReadDicomEncapsulatedPdfResult>
```

|  Parameter  |         Type        | Description      |
| :---------: | :-----------------: | :--------------- |
| `dicomFile` | *File | BinaryFile* | Input DICOM file |

**`ReadDicomEncapsulatedPdfOptions` interface:**

|       Property      |             Type            | Description                                                                                                                                           |
| :-----------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `readFileOnly`   |          *boolean*          | read file format only                                                                                                                                 |
|    `readDataset`    |          *boolean*          | read data set without file meta information                                                                                                           |
|    `readXferAuto`   |          *boolean*          | use TS recognition (default)                                                                                                                          |
|   `readXferDetect`  |          *boolean*          | ignore TS specified in the file meta header                                                                                                           |
|   `readXferLittle`  |          *boolean*          | read with explicit VR little endian TS                                                                                                                |
|    `readXferBig`    |          *boolean*          | read with explicit VR big endian TS                                                                                                                   |
|  `readXferImplicit` |          *boolean*          | read with implicit VR little endian TS                                                                                                                |
|  `acceptOddLength`  |          *boolean*          | accept odd length attributes (default)                                                                                                                |
|  `assumeEvenLength` |          *boolean*          | assume real length is one byte larger                                                                                                                 |
|    `enableCp246`    |          *boolean*          | read undefined len UN as implicit VR (default)                                                                                                        |
|    `disableCp246`   |          *boolean*          | read undefined len UN as explicit VR                                                                                                                  |
|      `retainUn`     |          *boolean*          | retain elements as UN (default)                                                                                                                       |
|     `convertUn`     |          *boolean*          | convert to real VR if known                                                                                                                           |
|  `enableCorrection` |          *boolean*          | enable automatic data correction (default)                                                                                                            |
| `disableCorrection` |          *boolean*          | disable automatic data correction                                                                                                                     |
|     `webWorker`     | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|       `noCopy`      |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`ReadDicomEncapsulatedPdfResult` interface:**

|      Property     |     Type     | Description                     |
| :---------------: | :----------: | :------------------------------ |
| `pdfBinaryOutput` | *Uint8Array* | Output pdf file                 |
|    `webWorker`    |   *Worker*   | WebWorker used for computation. |

#### structuredReportToHtml

*Render DICOM SR file and data set to HTML/XHTML*

```ts
async function structuredReportToHtml(
  dicomFile: File | BinaryFile,
  options: StructuredReportToHtmlOptions = {}
) : Promise<StructuredReportToHtmlResult>
```

|  Parameter  |         Type        | Description      |
| :---------: | :-----------------: | :--------------- |
| `dicomFile` | *File | BinaryFile* | Input DICOM file |

**`StructuredReportToHtmlOptions` interface:**

|        Property       |             Type            | Description                                                                                                                                           |
| :-------------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `readFileOnly`    |          *boolean*          | read file format only                                                                                                                                 |
|     `readDataset`     |          *boolean*          | read data set without file meta information                                                                                                           |
|     `readXferAuto`    |          *boolean*          | use TS recognition (default)                                                                                                                          |
|    `readXferDetect`   |          *boolean*          | ignore TS specified in the file meta header                                                                                                           |
|    `readXferLittle`   |          *boolean*          | read with explicit VR little endian TS                                                                                                                |
|     `readXferBig`     |          *boolean*          | read with explicit VR big endian TS                                                                                                                   |
|   `readXferImplicit`  |          *boolean*          | read with implicit VR little endian TS                                                                                                                |
|  `processingDetails`  |          *boolean*          | show currently processed content item                                                                                                                 |
| `unknownRelationship` |          *boolean*          | accept unknown/missing relationship type                                                                                                              |
|   `invalidItemValue`  |          *boolean*          | accept invalid content item value
(e.g. violation of VR or VM definition)                                                                             |
|  `ignoreConstraints`  |          *boolean*          | ignore relationship content constraints                                                                                                               |
|   `ignoreItemErrors`  |          *boolean*          | do not abort on content item errors, just warn
(e.g. missing value type specific attributes)                                                          |
|   `skipInvalidItems`  |          *boolean*          | skip invalid content items (incl. sub-tree)                                                                                                           |
|   `disableVrChecker`  |          *boolean*          | disable check for VR-conformant string values                                                                                                         |
|    `charsetRequire`   |          *boolean*          | require declaration of ext. charset (default)                                                                                                         |
|    `charsetAssume`    |           *string*          | [c]harset: string, assume charset c if no extended charset declared                                                                                   |
|   `charsetCheckAll`   |          *boolean*          | check all data elements with string values
(default: only PN, LO, LT, SH, ST, UC and UT)                                                              |
|    `convertToUtf8`    |          *boolean*          | convert all element values that are affected
by Specific Character Set (0008,0005) to UTF-8                                                           |
|      `urlPrefix`      |           *string*          | URL: string. Append specificed URL prefix to hyperlinks of referenced composite objects in the document.                                              |
|        `html32`       |          *boolean*          | use only HTML version 3.2 compatible features                                                                                                         |
|        `html40`       |          *boolean*          | allow all HTML version 4.01 features (default)                                                                                                        |
|       `xhtml11`       |          *boolean*          | comply with XHTML version 1.1 specification                                                                                                           |
|   `addDocumentType`   |          *boolean*          | add reference to SGML document type definition                                                                                                        |
|     `cssReference`    |           *string*          | URL: string. Add reference to specified CSS to document                                                                                               |
|       `cssFile`       |  *string | File | TextFile* | [f]ilename: string. Embed content of specified CSS into document                                                                                      |
|     `expandInline`    |          *boolean*          | expand short content items inline (default)                                                                                                           |
|  `neverExpandInline`  |          *boolean*          | never expand content items inline                                                                                                                     |
|  `alwaysExpandInline` |          *boolean*          | always expand content items inline                                                                                                                    |
|    `renderFullData`   |          *boolean*          | render full data of content items                                                                                                                     |
|  `sectionTitleInline` |          *boolean*          | render section titles inline, not separately                                                                                                          |
|  `documentTypeTitle`  |          *boolean*          | use document type as document title (default)                                                                                                         |
|   `patientInfoTitle`  |          *boolean*          | use patient information as document title                                                                                                             |
|   `noDocumentHeader`  |          *boolean*          | do not render general document information                                                                                                            |
|  `renderInlineCodes`  |          *boolean*          | render codes in continuous text blocks                                                                                                                |
|   `conceptNameCodes`  |          *boolean*          | render code of concept names                                                                                                                          |
|   `numericUnitCodes`  |          *boolean*          | render code of numeric measurement units                                                                                                              |
|    `codeValueUnit`    |          *boolean*          | use code value as measurement unit (default)                                                                                                          |
|   `codeMeaningUnit`   |          *boolean*          | use code meaning as measurement unit                                                                                                                  |
|    `renderAllCodes`   |          *boolean*          | render all codes (implies +Ci, +Cn and +Cu)                                                                                                           |
|  `codeDetailsTooltip` |          *boolean*          | render code details as a tooltip (implies +Cc)                                                                                                        |
|      `webWorker`      | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|        `noCopy`       |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`StructuredReportToHtmlResult` interface:**

|   Property   |   Type   | Description                     |
| :----------: | :------: | :------------------------------ |
| `outputText` | *string* | Output text file                |
|  `webWorker` | *Worker* | WebWorker used for computation. |

#### structuredReportToText

*Read a DICOM structured report file and generate a plain text representation*

```ts
async function structuredReportToText(
  dicomFile: File | BinaryFile,
  options: StructuredReportToTextOptions = {}
) : Promise<StructuredReportToTextResult>
```

|  Parameter  |         Type        | Description      |
| :---------: | :-----------------: | :--------------- |
| `dicomFile` | *File | BinaryFile* | Input DICOM file |

**`StructuredReportToTextOptions` interface:**

|        Property       |             Type            | Description                                                                                                                                           |
| :-------------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `unknownRelationship` |          *boolean*          | Accept unknown relationship type                                                                                                                      |
|   `invalidItemValue`  |          *boolean*          | Accept invalid content item value                                                                                                                     |
|  `ignoreConstraints`  |          *boolean*          | Ignore relationship constraints                                                                                                                       |
|   `ignoreItemErrors`  |          *boolean*          | Ignore content item errors                                                                                                                            |
|   `skipInvalidItems`  |          *boolean*          | Skip invalid content items                                                                                                                            |
|   `noDocumentHeader`  |          *boolean*          | Print no document header                                                                                                                              |
|  `numberNestedItems`  |          *boolean*          | Number nested items                                                                                                                                   |
|  `shortenLongValues`  |          *boolean*          | Shorten long item values                                                                                                                              |
|   `printInstanceUid`  |          *boolean*          | Print SOP Instance UID                                                                                                                                |
|  `printSopclassShort` |          *boolean*          | Print short SOP class name                                                                                                                            |
|  `printSopclassLong`  |          *boolean*          | Print SOP class name                                                                                                                                  |
|   `printSopclassUid`  |          *boolean*          | Print long SOP class name                                                                                                                             |
|    `printAllCodes`    |          *boolean*          | Print all codes                                                                                                                                       |
|  `printInvalidCodes`  |          *boolean*          | Print invalid codes                                                                                                                                   |
|   `printTemplateId`   |          *boolean*          | Print template identification                                                                                                                         |
|   `indicateEnhanced`  |          *boolean*          | Indicate enhanced encoding mode                                                                                                                       |
|      `printColor`     |          *boolean*          | Use ANSI escape codes                                                                                                                                 |
|      `webWorker`      | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|        `noCopy`       |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`StructuredReportToTextResult` interface:**

|   Property   |   Type   | Description                     |
| :----------: | :------: | :------------------------------ |
| `outputText` | *string* | Output text file                |
|  `webWorker` | *Worker* | WebWorker used for computation. |

#### readDicomTags

*Read the tags from a DICOM file*

```ts
async function readDicomTags(
  dicomFile: File | BinaryFile,
  options: ReadDicomTagsOptions = {}
) : Promise<ReadDicomTagsResult>
```

|  Parameter  |         Type        | Description       |
| :---------: | :-----------------: | :---------------- |
| `dicomFile` | *File | BinaryFile* | Input DICOM file. |

**`ReadDicomTagsOptions` interface:**

|   Property   |             Type            | Description                                                                                                                                           |
| :----------: | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tagsToRead` |       *JsonCompatible*      | A JSON object with a "tags" array of the tags to read. If not provided, all tags are read. Example tag: "0008|103e".                                  |
|  `webWorker` | *null or Worker or boolean* | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|   `noCopy`   |          *boolean*          | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`ReadDicomTagsResult` interface:**

|   Property  |       Type       | Description                                                                                                |
| :---------: | :--------------: | :--------------------------------------------------------------------------------------------------------- |
|    `tags`   | *JsonCompatible* | Output tags in the file. JSON object an array of [tag, value] arrays. Values are encoded as UTF-8 strings. |
| `webWorker` |     *Worker*     | WebWorker used for computation.                                                                            |

#### readImageDicomFileSeries

*Read a DICOM image series and return the associated image volume*

```ts
async function readImageDicomFileSeries(
  options: ReadImageDicomFileSeriesOptions = { inputImages: [] as BinaryFile[] | File[] | string[], }
) : Promise<ReadImageDicomFileSeriesResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`ReadImageDicomFileSeriesOptions` interface:**

|       Property       |                Type                | Description                                                                                                                                           |
| :------------------: | :--------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `inputImages`    | *string[] | File[] | BinaryFile[]* | File names in the series                                                                                                                              |
| `singleSortedSeries` |              *boolean*             | The input files are a single sorted series                                                                                                            |
|      `webWorker`     |     *null or Worker or boolean*    | WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. |
|       `noCopy`       |              *boolean*             | When SharedArrayBuffer's are not available, do not copy inputs.                                                                                       |

**`ReadImageDicomFileSeriesResult` interface:**

|      Property     |       Type       | Description                     |
| :---------------: | :--------------: | :------------------------------ |
|   `outputImage`   |      *Image*     | Output image volume             |
| `sortedFilenames` | *JsonCompatible* | Output sorted filenames         |
|    `webWorker`    |     *Worker*     | WebWorker used for computation. |

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
  applyPresentationStateToImageNode,
  readDicomEncapsulatedPdfNode,
  structuredReportToHtmlNode,
  structuredReportToTextNode,
  readDicomTagsNode,
  readImageDicomFileSeriesNode,
} from "@itk-wasm/dicom"
```

#### applyPresentationStateToImageNode

*Apply a presentation state to a given DICOM image and render output as bitmap, or dicom file.*

```ts
async function applyPresentationStateToImageNode(
  imageIn: string,
  presentationStateFile: string,
  options: ApplyPresentationStateToImageNodeOptions = {}
) : Promise<ApplyPresentationStateToImageNodeResult>
```

|        Parameter        |   Type   | Description                           |
| :---------------------: | :------: | :------------------------------------ |
|        `imageIn`        | *string* | Input DICOM file                      |
| `presentationStateFile` | *string* | Process using presentation state file |

**`ApplyPresentationStateToImageNodeOptions` interface:**

|           Property          |    Type   | Description                                                      |
| :-------------------------: | :-------: | :--------------------------------------------------------------- |
|        `colorOutput`        | *boolean* | output image as RGB (default: false)                             |
|         `configFile`        |  *string* | filename: string. Process using settings from configuration file |
|           `frame`           |  *number* | frame: integer. Process using image frame f (default: 1)         |
| `noPresentationStateOutput` | *boolean* | Do not get presentation state information in text stream.        |
|       `noBitmapOutput`      | *boolean* | Do not get resulting image as bitmap output stream.              |

**`ApplyPresentationStateToImageNodeResult` interface:**

|           Property           |       Type       | Description                |
| :--------------------------: | :--------------: | :------------------------- |
| `presentationStateOutStream` | *JsonCompatible* | Output overlay information |
|         `outputImage`        |      *Image*     | Output image               |

#### readDicomEncapsulatedPdfNode

*Extract PDF file from DICOM encapsulated PDF.*

```ts
async function readDicomEncapsulatedPdfNode(
  dicomFile: string,
  options: ReadDicomEncapsulatedPdfNodeOptions = {}
) : Promise<ReadDicomEncapsulatedPdfNodeResult>
```

|  Parameter  |   Type   | Description      |
| :---------: | :------: | :--------------- |
| `dicomFile` | *string* | Input DICOM file |

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
  dicomFile: string,
  options: StructuredReportToHtmlNodeOptions = {}
) : Promise<StructuredReportToHtmlNodeResult>
```

|  Parameter  |   Type   | Description      |
| :---------: | :------: | :--------------- |
| `dicomFile` | *string* | Input DICOM file |

**`StructuredReportToHtmlNodeOptions` interface:**

|        Property       |            Type            | Description                                                                                              |
| :-------------------: | :------------------------: | :------------------------------------------------------------------------------------------------------- |
|     `readFileOnly`    |          *boolean*         | read file format only                                                                                    |
|     `readDataset`     |          *boolean*         | read data set without file meta information                                                              |
|     `readXferAuto`    |          *boolean*         | use TS recognition (default)                                                                             |
|    `readXferDetect`   |          *boolean*         | ignore TS specified in the file meta header                                                              |
|    `readXferLittle`   |          *boolean*         | read with explicit VR little endian TS                                                                   |
|     `readXferBig`     |          *boolean*         | read with explicit VR big endian TS                                                                      |
|   `readXferImplicit`  |          *boolean*         | read with implicit VR little endian TS                                                                   |
|  `processingDetails`  |          *boolean*         | show currently processed content item                                                                    |
| `unknownRelationship` |          *boolean*         | accept unknown/missing relationship type                                                                 |
|   `invalidItemValue`  |          *boolean*         | accept invalid content item value
(e.g. violation of VR or VM definition)                                |
|  `ignoreConstraints`  |          *boolean*         | ignore relationship content constraints                                                                  |
|   `ignoreItemErrors`  |          *boolean*         | do not abort on content item errors, just warn
(e.g. missing value type specific attributes)             |
|   `skipInvalidItems`  |          *boolean*         | skip invalid content items (incl. sub-tree)                                                              |
|   `disableVrChecker`  |          *boolean*         | disable check for VR-conformant string values                                                            |
|    `charsetRequire`   |          *boolean*         | require declaration of ext. charset (default)                                                            |
|    `charsetAssume`    |          *string*          | [c]harset: string, assume charset c if no extended charset declared                                      |
|   `charsetCheckAll`   |          *boolean*         | check all data elements with string values
(default: only PN, LO, LT, SH, ST, UC and UT)                 |
|    `convertToUtf8`    |          *boolean*         | convert all element values that are affected
by Specific Character Set (0008,0005) to UTF-8              |
|      `urlPrefix`      |          *string*          | URL: string. Append specificed URL prefix to hyperlinks of referenced composite objects in the document. |
|        `html32`       |          *boolean*         | use only HTML version 3.2 compatible features                                                            |
|        `html40`       |          *boolean*         | allow all HTML version 4.01 features (default)                                                           |
|       `xhtml11`       |          *boolean*         | comply with XHTML version 1.1 specification                                                              |
|   `addDocumentType`   |          *boolean*         | add reference to SGML document type definition                                                           |
|     `cssReference`    |          *string*          | URL: string. Add reference to specified CSS to document                                                  |
|       `cssFile`       | *string | File | TextFile* | [f]ilename: string. Embed content of specified CSS into document                                         |
|     `expandInline`    |          *boolean*         | expand short content items inline (default)                                                              |
|  `neverExpandInline`  |          *boolean*         | never expand content items inline                                                                        |
|  `alwaysExpandInline` |          *boolean*         | always expand content items inline                                                                       |
|    `renderFullData`   |          *boolean*         | render full data of content items                                                                        |
|  `sectionTitleInline` |          *boolean*         | render section titles inline, not separately                                                             |
|  `documentTypeTitle`  |          *boolean*         | use document type as document title (default)                                                            |
|   `patientInfoTitle`  |          *boolean*         | use patient information as document title                                                                |
|   `noDocumentHeader`  |          *boolean*         | do not render general document information                                                               |
|  `renderInlineCodes`  |          *boolean*         | render codes in continuous text blocks                                                                   |
|   `conceptNameCodes`  |          *boolean*         | render code of concept names                                                                             |
|   `numericUnitCodes`  |          *boolean*         | render code of numeric measurement units                                                                 |
|    `codeValueUnit`    |          *boolean*         | use code value as measurement unit (default)                                                             |
|   `codeMeaningUnit`   |          *boolean*         | use code meaning as measurement unit                                                                     |
|    `renderAllCodes`   |          *boolean*         | render all codes (implies +Ci, +Cn and +Cu)                                                              |
|  `codeDetailsTooltip` |          *boolean*         | render code details as a tooltip (implies +Cc)                                                           |

**`StructuredReportToHtmlNodeResult` interface:**

|   Property   |   Type   | Description      |
| :----------: | :------: | :--------------- |
| `outputText` | *string* | Output text file |

#### structuredReportToTextNode

*Read a DICOM structured report file and generate a plain text representation*

```ts
async function structuredReportToTextNode(
  dicomFile: string,
  options: StructuredReportToTextNodeOptions = {}
) : Promise<StructuredReportToTextNodeResult>
```

|  Parameter  |   Type   | Description      |
| :---------: | :------: | :--------------- |
| `dicomFile` | *string* | Input DICOM file |

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

#### readDicomTagsNode

*Read the tags from a DICOM file*

```ts
async function readDicomTagsNode(
  dicomFile: string,
  options: ReadDicomTagsNodeOptions = {}
) : Promise<ReadDicomTagsNodeResult>
```

|  Parameter  |   Type   | Description       |
| :---------: | :------: | :---------------- |
| `dicomFile` | *string* | Input DICOM file. |

**`ReadDicomTagsNodeOptions` interface:**

|   Property   |       Type       | Description                                                                                                          |
| :----------: | :--------------: | :------------------------------------------------------------------------------------------------------------------- |
| `tagsToRead` | *JsonCompatible* | A JSON object with a "tags" array of the tags to read. If not provided, all tags are read. Example tag: "0008|103e". |

**`ReadDicomTagsNodeResult` interface:**

| Property |       Type       | Description                                                                                                |
| :------: | :--------------: | :--------------------------------------------------------------------------------------------------------- |
|  `tags`  | *JsonCompatible* | Output tags in the file. JSON object an array of [tag, value] arrays. Values are encoded as UTF-8 strings. |

#### readImageDicomFileSeriesNode

*Read a DICOM image series and return the associated image volume*

```ts
async function readImageDicomFileSeriesNode(
  options: ReadImageDicomFileSeriesNodeOptions = { inputImages: [] as string[], }
) : Promise<ReadImageDicomFileSeriesNodeResult>
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |

**`ReadImageDicomFileSeriesNodeOptions` interface:**

|       Property       |                Type                | Description                                |
| :------------------: | :--------------------------------: | :----------------------------------------- |
|     `inputImages`    | *string[] | File[] | BinaryFile[]* | File names in the series                   |
| `singleSortedSeries` |              *boolean*             | The input files are a single sorted series |

**`ReadImageDicomFileSeriesNodeResult` interface:**

|      Property     |       Type       | Description             |
| :---------------: | :--------------: | :---------------------- |
|   `outputImage`   |      *Image*     | Output image volume     |
| `sortedFilenames` | *JsonCompatible* | Output sorted filenames |
