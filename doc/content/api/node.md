title: Node.js Input/Output
---

These Input/Output (IO) functions can be used from within a [Node.js](https://nodejs.org/) application or library on a workstation or server. They will read from and write to directories on the local filesystem.

## readImageLocalFile(filePath) -> [itk/Image](./Image.html)

Read an image from a file on the local filesystem.

## readImageLocalDICOMFileSeries(directory) -> [itk/Image](./Image.html)

Read an image from a series of DICOM files on the local filesystem.

It is assumed that all the files are located in the same directory.

## writeImageLocalFile(useCompression, image, filePath) -> null

Write an image to a file on the local filesystem in Node.js.

*useCompression*: compress the pixel data when possible
*image*:          [itk/Image](./Image.html) instance to write
*filePath*:       path to the file on the local filesystem
