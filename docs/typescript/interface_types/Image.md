# Image

An `Image` is the N-dimensional image data structure for *itk-wasm*.

`Image` is a JavaScript object with the following properties:

- `imageType`: The [ImageType](/api/ImageType) for this image.
- `name`: An optional name string that describes this image.
- `origin` An Array with length `imageType.dimension` that describes the location of the center of the lower left pixel in physical units.
- `spacing`: An Array with length `dimension` that describes the spacing between pixel in physical units.
- `direction`: A `dimension` by `dimension` length `Float64Array` in column-major order, that describes the orientation of the image at its `origin`  The orientation of each axis are the orthonormal columns.
- `size`: An Array with length `dimension` that contains the number of pixels along dimension.
- `data`: A [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) containing the pixel buffer data.
- `metadata`: A [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of string keys to values that could be strings, string arrays, numbers, number arrays, or arrays of number arrays providing additional metadata for the image.

For more information, see [the description](https://itk.org/ITKSoftwareGuide/html/Book1/ITKSoftwareGuide-Book1ch4.html#x38-490004.1) of an `itk::Image` in the ITK Software Guide.

Note that the `origin`, `spacing`, `direction`, and `size` are indexed with an `x`, `y`, `z` convention ordering. This is the reverse indexing convention relative to other libraries such as [TensorFlow.js](https://www.tensorflow.org/js). To generate a TensorFlow tensor from an `Image`, `image`:

```
const tensor = tf.tensor(image.data, image.size.reverse())
```

To visualize an `Image` with [vtk.js](https://kitware.github.io/vtk-js) use `convertItkToVtkImage` from [`vtk.js/Sources/Common/DataModel/ITKHelper`](https://kitware.github.io/vtk-js/api/Common_DataModel_ITKHelper.html).
