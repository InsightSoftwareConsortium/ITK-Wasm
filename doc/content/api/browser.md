title: Web Browser Input/Output
---

These Input/Output (IO) functions can be used from within a web browser's JavaScript runtime. *itk.js* is best tested in Chrome, but it is used and designed to work on Chrome, Firefox, Microsoft Edge, Safari, and other browsers, including mobile browsers. In general, older browsers will function, but users on newer browsers will experience improved performance.

The *itk.js* IO functions convert native brower objects, [File](https://developer.mozilla.org/en-US/docs/Web/API/File)'s, [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)'s, and [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)'s to / from JavaScript objects with [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)'s for binary data.

Most of these functions return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).


## readImageFile(file) -> [itk/Image](./Image.html)

Read an image from a [File](https://developer.mozilla.org/en-US/docs/Web/API/File).

## readImageBlob(blob, fileName, mimeType) -> [itk/Image](./Image.html)

Read an image from a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob). `fileName` is a string with the file name. `mimeType` is an optional mime-type string.

## readImageArrayBuffer(arrayBuffer, fileName, mimeType) -> [itk/Image](./Image.html)

Read an image from an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). `fileName` is a string with the file name. `mimeType` is an optional mime-type string.

## readImageDICOMFileSeries(fileList) -> [itk/Image](./Image.html)

Read an image from a series of DICOM [File](https://developer.mozilla.org/en-US/docs/Web/API/File)'s stored in an [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) or [FileList](https://developer.mozilla.org/en-US/docs/Web/API/FileList).

## writeImageArrayBuffer(useCompression, image, fileName, mimeType) -> null

Write an image to a an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).

*useCompression*: compress the pixel data when possible
*image*:          [itk/Image](./Image.html) instance to write
*fileName*:       name that would be used for the resulting file
*mimeType*:       optional mime-type for the resulting file
