title: Node.js Input/Output
---

These Input/Output (IO) functions can be used from within a [Node.js](https://nodejs.org/) application or library on a workstation or server. They will read from and write to directories on the local filesystem.

Similar to the [web browser API](./browser_io.html), most of these functions return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

---

## readLocalFile(filePath: string): Promise<[Image](./Image.html) | [Mesh](./Mesh.html) | [PolyData](https://insightsoftwareconsortium.github.io/itk-wasm/docs/polydata_formats.html)>

Read an image or mesh or polyData from a file on the local filesystem.

## writeLocalFile(useCompression: boolean, imageOrMesh: [Image](./Image.html) | [Mesh](./Mesh.html), filePath: string): Promise<null>

Write an image to a file on the local filesystem with Node.js.

*useCompression*: compress the pixel data when possible
*imageOrMesh*:    [Image](./Image.html) or [Mesh](./Mesh.html) instance to write
*filePath*:       path to the file on the local filesystem

---

## readImageLocalFile(filePath: string): Promise<[Image](./Image.html)>

Read an image from a file on the local filesystem.

## readImageLocalDICOMFileSeries(filePaths, singleSortedSeries=false): Promise<[Image](./Image.html)>

Read an image from a series of DICOM files on the local filesystem.

If the files are known to be from a single, sorted series, the last argument can be set to true for performance.

## readDICOMTagsLocalFile(fileName: string, tags: string[] | null = null): Promise<Map<string, string>>

Read tags from a DICOM [File](https://developer.mozilla.org/en-US/docs/Web/API/File).

Tags should be of the form `"GGGG|EEEE"`, where `GGGG` is the group ID in hex and `EEEE` is the element ID in hex. As an example, "0010|0010" is the PatientID.
Hexadecimal strings are treated case-insensitively.

Returns a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) containing the mapping from tag to tag value.

## writeImageLocalFile(useCompression: boolean, image: [Image](./Image.html), filePath: string): null

Write an image to a file on the local filesystem with Node.js.

*useCompression*: compress the pixel data when possible
*image*:          [Image](./Image.html) instance to write
*filePath*:       path to the file on the local filesystem

---

## readMeshLocalFile(filePath: string): Promise<[Mesh](./Mesh.html)>

Read a mesh from a file on the local filesystem.

## writeMeshLocalFile({ useCompression?: boolean, binaryFileType?: boolean }, [Mesh](./Mesh.html), filePath: string): null

Write a mesh to a file on the local filesystem with Node.js.

*useCompression*: compress the pixel data when possible
*binaryFileType*: write in an binary as opposed to a ascii format, if possible
*mesh*:           [Mesh](./Mesh.html) instance to write
*filePath*:       path to the file on the local filesystem

---

## readPolyDataLocalFile(filePath: string): [vtk.js PolyData](https://kitware.github.io/vtk-js/docs/structures_PolyData.html)

Read a vtk.js PolyData from a file on the local filesystem.
