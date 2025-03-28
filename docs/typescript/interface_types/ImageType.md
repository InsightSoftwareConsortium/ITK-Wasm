# ImageType

An `ImageType` describes the type of an [`Image`](./Image). It is a
JSON object with the following attributes:

- `dimension`: An integer that describes the dimension for the image, typically 2 or 3.
- `pixelType`: The [`PixelType`]. For example, *Scalar*, *Vector*, *CovariantVector*, or *SymmetricSecondRankTensor*.
- `componentType`: The type of the components in a pixel. This is one of the [`IntTypes`] or [`FloatTypes`].
- `components`: The number of components in a pixel. For a *Scalar* `pixelType` this will be 1.

[`PixelType`]: https://github.com/InsightSoftwareConsortium/ITK-Wasm/blob/main/packages/core/typescript/itk-wasm/src/interface-types/pixel-types.ts
[`IntTypes`]: https://github.com/InsightSoftwareConsortium/ITK-Wasm/blob/main/packages/core/typescript/itk-wasm/src/interface-types/int-types.ts
[`FloatTypes`]: https://github.com/InsightSoftwareConsortium/ITK-Wasm/blob/main/packages/core/typescript/itk-wasm/src/interface-types/float-types.ts