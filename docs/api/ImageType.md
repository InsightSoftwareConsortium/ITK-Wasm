# ImageType

An `ImageType` describes the type of an [`Image`](/api/Image). It is a
JSON object with the following attributes:

- `dimension`: An integer that describes the dimension for the image, typically 2 or 3.
- `pixelType`: The [`PixelType`](https://github.com/InsightSoftwareConsortium/itk-wasm/blob/main/src/core/PixelTypes.ts). For example, *Scalar*, *Vector*, *CovariantVector*, or *SymmetricSecondRankTensor*.
- `componentType`: The type of the components in a pixel. This is one of the [`IntTypes`](https://github.com/InsightSoftwareConsortium/itk-wasm/blob/main/src/core/IntTypes.ts) or [`FloatTypes`](https://github.com/InsightSoftwareConsortium/itk-wasm/blob/main/src/core/FloatTypes.ts).
- `components`: The number of components in a pixel. For a *Scalar* `pixelType` this will be 1.
