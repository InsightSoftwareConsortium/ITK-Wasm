# Node.js Input/Output

These Input/Output (IO) functions can be used from within a [Node.js](https://nodejs.org/) application or library on a workstation or server. They will read from and write to directories on the local filesystem.

Similar to the [web browser API](/api/browser_io), most of these functions return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

---

## `readLocalFile`

```ts
readLocalFile(filePath: string): Promise<Image | Mesh>
```

*Read an image or mesh from a file on the local filesystem.*

## `writeLocalFile`

```ts
writeLocalFile(imageOrMesh: Image | Mesh, filePath: string, useCompression: boolean = false):
  Promise<null>
```

*Write an image to a file on the local filesystem with Node.js.*

- *imageOrMesh*:    [`Image`](/api/Image) or [`Mesh`](/api/Mesh) instance to write
- *filePath*:       path to the file on the local filesystem
- *useCompression*: compress the pixel data when possible

---

## `readImageLocalFile`

```ts
readImageLocalFile(filePath: string):
  Promise<Image>
```

*Read an image from a file on the local filesystem.*

## `readImageLocalDICOMFileSeries`

```ts
readImageLocalDICOMFileSeries(filePaths, singleSortedSeries: boolean = false):
  Promise<Image>
```

*Read an image from a series of DICOM files on the local filesystem.*

If the files are known to be from a single, sorted series, the last argument can be set to true for performance.

## `readDICOMTagsLocalFile`

```ts
readDICOMTagsLocalFile(fileName: string, tags: string[] | null = null):
  Promise<Map<string, string>>
```

*Read tags from a DICOM [File](https://developer.mozilla.org/en-US/docs/Web/API/File).*

Tags should be of the form `"GGGG|EEEE"`, where `GGGG` is the group ID in hex and `EEEE` is the element ID in hex. As an example, "0010|0010" is the PatientID.
Hexadecimal strings are treated case-insensitively.

Returns a [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) containing the mapping from tag to tag value.

## `writeImageLocalFile`

```ts
writeImageLocalFile(image: Image, filePath: string, useCompression: boolean):
  null
```

*Write an image to a file on the local filesystem with Node.js.*

- *image*:          [`Image`](/api/Image) instance to write
- *filePath*:       path to the file on the local filesystem
- *useCompression*: compress the pixel data when possible

---

## `readMeshLocalFile`

```ts
readMeshLocalFile(filePath: string):
  Promise<Mesh>
```

*Read a mesh from a file on the local filesystem.*

## `writeMeshLocalFile`

```ts
writeMeshLocalFile(Mesh, filePath: string, { useCompression?: boolean, binaryFileType?: boolean }):
  null
```

*Write a mesh to a file on the local filesystem with Node.js.*

- *mesh*:           [`Mesh`](/api/Mesh) instance to write
- *filePath*:       path to the file on the local filesystem
- *useCompression*: compress the pixel data when possible
- *binaryFileType*: write in a binary as opposed to a ascii format, if possible
