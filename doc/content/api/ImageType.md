title: ImageType
---

The `itk/ImageType` describes the type of an [Image](./Image.html). It is a
JSON object with the following attributes:

**dimension**: The dimension of the image.
**pixelType**: The [PixelType](https://github.com/InsightSoftwareConsortium/itk-js/blob/master/src/PixelTypes.js). For example, *Scalar*, *Vector*, *CovariantVector*, or *SymmetricSecondRankTensor*.
**componentType**: The type of the components in a pixel. This is one of the [IntTypes](https://github.com/InsightSoftwareConsortium/itk-js/blob/master/src/IntTypes.js) or [FloatTypes](https://github.com/InsightSoftwareConsortium/itk-js/blob/master/src/FloatTypes.js).
**components**: The number of components in a pixel. For a *Scalar* *pixelType*, this will be 1.
