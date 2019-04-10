title: Node.js Input/Output
---

These Input/Output (IO) functions can be used from within a [Node.js](https://nodejs.org/) application or library on a workstation or server. They will read from and write to directories on the local filesystem.

Similar to the [web browser API](./browser_io.html), most of these functions return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

---

## readLocalFile(filePath) -> [itk/Image](./Image.html) or [itk/Mesh](./Mesh.html)

Read an image or mesh from a file on the local filesystem.

## readLocalFileSync(filePath) -> [itk/Image](./Image.html) or [itk/Mesh](./Mesh.html)

Similar to `readLocalFile`, but returns the image or mesh directly instead of a promise.

## writeLocalFile(useCompression, imageOrMesh, filePath) -> null

Write an image to a file on the local filesystem with Node.js.

*useCompression*: compress the pixel data when possible
*imageOrMesh*:    [itk/Image](./Image.html) or [itk/Mesh](./Mesh.html) instance to write
*filePath*:       path to the file on the local filesystem

## writeFileSync(useCompression, image, filePath) -> null

Similar to `writeImageLocalFile`, but synchronous.

---

## readImageLocalFile(filePath) -> [itk/Image](./Image.html)

Read an image from a file on the local filesystem.

## readImageLocalFileSync(filePath) -> [itk/Image](./Image.html)

Similar to `readImageLocalFile`, but returns the image directly instead of a promise.

## readImageLocalDICOMFileSeries(directory) -> [itk/Image](./Image.html)

Read an image from a series of DICOM files on the local filesystem.

It is assumed that all the files are located in the same directory.

## readImageLocalDICOMFileSeriesSync(directory) -> [itk/Image](./Image.html)

Similar to `readImageLocalDICOMFileSeries`, but returns the image directly instead of a promise.

## writeImageLocalFile(useCompression, image, filePath) -> null

Write an image to a file on the local filesystem with Node.js.

*useCompression*: compress the pixel data when possible
*image*:          [itk/Image](./Image.html) instance to write
*filePath*:       path to the file on the local filesystem

## writeImageLocalFileSync(useCompression, image, filePath) -> null

Similar to `writeImageLocalFile`, but synchronous.

---

## readMeshLocalFile(filePath) -> [itk/Mesh](./Mesh.html)

Read a mesh from a file on the local filesystem.

## readMeshLocalFileSync(filePath) -> [itk/Mesh](./Mesh.html)

Similar to `readMeshLocalFile`, but returns the mesh directly instead of a promise.

## writeMeshLocalFile({ useCompression, binaryFileType }, image, filePath) -> null

Write a mesh to a file on the local filesystem with Node.js.

*useCompression*: compress the pixel data when possible
*binaryFileType*: write in an binary as opposed to a ascii format, if possible
*mesh*:           [itk/Mesh](./Mesh.html) instance to write
*filePath*:       path to the file on the local filesystem

## writeMeshLocalFileSync({ useCompression, binaryFileType }, image, filePath) -> null

Similar to `writeMeshLocalFile`, but synchronous.
