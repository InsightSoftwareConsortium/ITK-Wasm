# MeshType

A [`MeshType`] describes the type of an [`Mesh`](/api/Mesh). It is a JSON object with the following attributes:

- `dimension`: The spatial dimension of the mesh.
- `pointComponentType`: The type of the components used to represent a point. This is one of the [`FloatTypes`].
- `pointPixelComponentType`: The type of the components used to represent the data at a point. This is one of the [`IntTypes`] or [`FloatTypes`].
- `pointPixelType`: The [`PixelType`] for data associated with a point. For example, *Scalar*, *Vector*, *CovariantVector*, or *SymmetricSecondRankTensor*.
- `pointPixelComponents`: The number of components in a point pixel. For a *Scalar* *pixelType*, this will be 1.
- `cellComponentType`: The type of the components used to represent a cell. This is one of the [`IntTypes`].
- `cellPixelComponentType`: The type of the components used to represent the data at a cell. This is one of the [`IntTypes`] or [`FloatTypes`].
- `cellPixelType`: The [`PixelType`] for data associated with a cell. For example, *Scalar*, *Vector*, *CovariantVector*, or *SymmetricSecondRankTensor*.
- `cellPixelComponents`: The number of components in a cell pixel. For a *Scalar* `pixelType`, this will be 1.

[`PixelType`]: https://github.com/InsightSoftwareConsortium/ITK-Wasm/blob/main/packages/core/typescript/itk-wasm/src/interface-types/pixel-types.ts
[`IntTypes`]: https://github.com/InsightSoftwareConsortium/ITK-Wasm/blob/main/packages/core/typescript/itk-wasm/src/interface-types/int-types.ts
[`FloatTypes`]: https://github.com/InsightSoftwareConsortium/ITK-Wasm/blob/main/packages/core/typescript/itk-wasm/src/interface-types/float-types.ts

[`MeshType`]: ../../model/MeshType.md
