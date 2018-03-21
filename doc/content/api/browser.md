title: Web Browser Input/Output
---

These Input/Output (IO) functions can be used from within a web browser's JavaScript runtime. *itk.js* is best tested in Chrome, but it is used and designed to work on Chrome, Firefox, Microsoft Edge, Safari, and other browsers, including mobile browsers. In general, older browsers will function, but users on newer browsers will experience improved performance.

The *itk.js* IO functions convert native brower objects, [File](https://developer.mozilla.org/en-US/docs/Web/API/File)'s, [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)'s, and [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)'s to / from JavaScript objects with [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)'s for binary data.

## readImageFile(file) -> [itk/Image](./Image.html)

Read an image from a [File](https://developer.mozilla.org/en-US/docs/Web/API/File).
