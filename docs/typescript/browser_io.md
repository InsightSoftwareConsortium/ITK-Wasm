# Web Browser Input/Output

These Input/Output (IO) functions can be used from within a web browser's JavaScript runtime. *itk-wasm* is best tested in Chrome, but it is used and designed to work on Chrome, Firefox, Microsoft Edge, Safari, and other browsers, including mobile browsers. In general, older browsers will function, but users on newer browsers will experience improved performance.

The *itk-wasm* IO functions convert native brower objects, [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)'s, [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)'s, and [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)'s to / from JavaScript objects with [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)'s for binary data.

Most of these functions return a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

These functions return the [`WebWorker`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) used for computation. They also optionally accept a web worker from a previous execution as their first argument -- pass the worker generated from execution or `null` if one is not available. Re-using workers can greatly improve performance.

---

## `readFile`

```ts
readFile(webWorker: Worker | null, file: File):
 Promise<{ webWorker: Worker, image: Image, mesh: Mesh }>
```

*Read an image or mesh or poly data from a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File).*


## `readBlob`

```ts
readBlob(webWorker: Worker | null, blob: Blob, fileName: string,
    mimeType?: string):
  Promise<{ webWorker: Worker, image?: Image, mesh?: Mesh }>
```

*Read an image or mesh or poly data from a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob). `fileName` is a string with the file name. `mimeType` is an optional mime-type string.*

## `readArrayBuffer`

```ts
readArrayBuffer(webWorker: Worker | null, arrayBuffer: ArrayBuffer, fileName: string,
    mimeType?: string):
  Promise<{ webWorker: Worker, image?: Image | mesh?: Mesh }>
```

*Read an image or mesh from an [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). `fileName` is a string with the file name. `mimeType` is an optional mime-type string.*

## `writeArrayBuffer`

```ts
writeArrayBuffer(webWorker: Worker | null, imageOrMesh: Image | Mesh, fileName: string,
     mimeType: string = '', useCompression: boolean = false):
  Promise<{ webWorker: Worker, arrayBuffer: ArrayBuffer }>
```

*Write an image or mesh to a an [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).*

- *imageOrMesh*:    [`Image`](/api/Image) or [`Mesh`](/api/Mesh) instance to write
- *fileName*:       name that would be used for the resulting file
- *mimeType*:       optional mime-type for the resulting file
- *useCompression*: compress the pixel data when possible

---

## `readImageFile`

```ts
readImageFile(webWorker: Worker | null, file: File):
  Promise<{ webWorker: Worker, image: Image }>
```

*Read an image from a [File](https://developer.mozilla.org/en-US/docs/Web/API/File).*

## `readImageBlob`

```ts
readImageBlob(webWorker: Worker | null, blob: Blob, fileName: string,
    options: { componentType?: IntTypes | FloatTypes, pixelType?: PixelTypes, mimeType?: string }):
  Promise<{ webWorker: Worker, image: Image }>
```

*Read an image from a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob). `fileName` is a string with the file name. `mimeType` is an optional mime-type string.*

## `readImageArrayBuffer`

```ts
readImageArrayBuffer(webWorker: Worker | null, arrayBuffer: ArrayBuffer, fileName: string,
    options: { componentType?: IntTypes | FloatTypes, pixelType?: PixelTypes, mimeType?: string }):
  Promise<{ webWorker: Worker, image: Image }>
```

*Read an image from an [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). `fileName` is a string with the file name. `mimeType` is an optional mime-type string.*

## `readImageHTTP`

```ts
readImageHTTP(url: string):
  Promise<image: Image>
```

*Read a server-side generated image created with [`itk::WasmImageIO`](https://github.com/InsightSoftwareConsortium/itk-wasm/blob/main/include/itkWasmImageIO.h). The `url` should point to a directory ending with `.iwi`. Inside the directory, an `index.json` file should be served, along with the pixel and direction buffer file at `${url}/data/data.raw` and `${url}/data/direction.raw`, respectively.*

## `readImageFileSeries`

```ts
readImageFileSeries(fileList: File[] | FileList,
    options: { zSpacing?: number = 1.0, zOrigin?: number = 0.0, sortedSeries?: boolean = false, }):
  Promise<{ image: Image, webWorkerPool: WorkerPool }>
```

*Read an image from a series of [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)'s or [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)'s stored in an [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) or [`FileList`](https://developer.mozilla.org/en-US/docs/Web/API/FileList).*

`zSpacing` and `zOrigin` arguments enable specification of the spacing and origin in the third dimension.

By default, files are sorted by name, lexicographically. To sort by a different method, sort the files first, then set `sortedSeries` to `true`.

The used `webWorkerPool` is returned to enable resource cleanup by calling `.terminateWorkers()`.

## `readImageDICOMFileSeries`

```ts
readImageDICOMFileSeries(fileList: File[] | FileList,
    options: { componentType?: IntTypes | FloatTypes, pixelType?: PixelTypes, singleSortedSeries?: boolean = false }):
  Promise<{ image: Image, webWorkerPool: WorkerPool }>
```

*Read an image from a series of DICOM [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)'s or [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)'s stored in an [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) or [`FileList`](https://developer.mozilla.org/en-US/docs/Web/API/FileList).*

If the files are known to be from a single, sorted series, the last argument can be set to true for performance.

The used `webWorkerPool` is returned to enable resource cleanup by calling `.terminateWorkers()`.

## `readImageDICOMArrayBufferSeries`

```ts
readImageDICOMArrayBufferSeries(arrayBuffers: ArrayBuffer[],
    options: { componentType?: IntTypes | FloatTypes, pixelType?: PixelTypes, singleSortedSeries?: boolean = false }):
  Promise<{ image: Image, webWorkerPool: WorkerPool }>
```

*Read an image from a series of DICOM [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)[`ArrayBuffer`]s stored in an [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).*

If the files are known to be from a single, sorted series, the last argument can be set to true for performance.

The used `webWorkerPool` is returned to enable resource cleanup by calling `.terminateWorkers()`.

## `readDICOMTags`

```ts
readDICOMTags(webWorker: Worker | null, file: File, tags: string[] | null = null):
  Promise<{ tags: Map<string, string>, webWorker: Worker }>
```

*Read tags from a DICOM [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File).*

Tags should be of the form `"GGGG|EEEE"`, where `GGGG` is the group ID in hex and `EEEE` is the element ID in hex. As an example, "0010|0010" is the PatientID.
Hexadecimal strings are treated case-insensitively.
A web worker object can be optionally provided to re-use a previously created web worker.
Otherwise, leave this null.

Returns:
- *tags*: a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) containing the mapping from tag to tag value.
- *webWorker*: a webworker that can be re-used.

## `readDICOMTagsArrayBuffer`

```ts
readDICOMTagsArrayBuffer(webWorker: Worker | null, arrayBuffer: ArrayBuffer,
    tags: string[] | null = null):
  Promise<{ tags: Map<string, string>, webWorker: Worker }>
```

*Read tags from a DICOM [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).*

Tags should be of the form `"GGGG|EEEE"`, where `GGGG` is the group ID in hex and `EEEE` is the element ID in hex. As an example, "0010|0010" is the PatientID.
Hexadecimal strings are treated case-insensitively.
A web worker object can be optionally provided to re-use a previously created web worker.
Otherwise, leave this null.

Returns:

- *tags*: a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) containing the mapping from tag to tag value.
- *webWorker*: a webworker that can be re-used.

## `writeImageArrayBuffer`

```ts
writeImageArrayBuffer(webWorker: Worker | null, image: Image, fileName: string,
    options: { mimeType?: string, useCompression?: boolean = false }):
  Promise<{ webWorker: Worker, arrayBuffer: ArrayBuffer }>
```

*Write an image to a an [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).*

*image*:          [`Image`](/api/Image) instance to write
*fileName*:       name that would be used for the resulting file
*mimeType*:       optional mime-type for the resulting file
*useCompression*: compress the pixel data when possible

---

## `readMeshFile`

```ts
readMeshFile(webWorker: Worker | null, file: File):
  Promise<{ webWorker: Worker, mesh: Mesh }>
```

*Read a mesh from a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File).*

## `readMeshBlob`

```ts
readMeshBlob(webWorker: Worker | null, blob: Blob, fileName: string,
    mimeType?: string):
  Promise<{ webWorker: Worker, mesh: Mesh }>
```

*Read an mesh from a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob). `fileName` is a string with the file name. `mimeType` is an optional mime-type string.*

## `readMeshArrayBuffer`

```ts
readMeshArrayBuffer(webWorker: Worker | null, arrayBuffer: ArrayBuffer, fileName: string, mimeType?: string):
  Promise<{ webWorker: Worker, mesh: Mesh }>
```

*Read an mesh from an [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). `fileName` is a string with the file name. `mimeType` is an optional mime-type string.*


## `writeMeshArrayBuffer`

```ts
writeMeshArrayBuffer(webWorker: Worker | null, mesh: Mesh, fileName: string,
    mimeType?f: string, options?: { useCompression?: boolean, binaryFileType?: boolean }):
  Promise<{ webWorker: Worker, arrayBuffer: ArrayBuffer }>
```

*Write an mesh to a an [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).*

- *mesh*:           [`Mesh`](/api/Mesh) instance to write
- *fileName*:       name that would be used for the resulting file
- *mimeType*:       optional mime-type for the resulting file
- *useCompression*: compress the pixel data when possible
- *binaryFileType*: write in a binary as opposed to a ascii format, if possible