# MeshType

A `MeshType` describes the type of an [`Mesh`](/api/Mesh). It is a JSON object with the following attributes:

- `dimension`: The spatial dimension of the mesh.
- `pointComponentType`: The type of the components used to represent a point. This is one of the [`FloatTypes`](https://github.com/InsightSoftwareConsortium/itk-wasm/blob/main/src/FloatTypes.js).
- `pointPixelComponentType`: The type of the components used to represent the data at a point. This is one of the [`IntTypes`](https://github.com/InsightSoftwareConsortium/itk-wasm/blob/main/src/IntTypes.js) or [`FloatTypes`](https://github.com/InsightSoftwareConsortium/itk-wasm/blob/main/src/core/FloatTypes.ts).
- `pointPixelType`: The [`PixelType`](https://github.com/InsightSoftwareConsortium/itk-wasm/blob/main/src/core/PixelTypes.ts) for data associated with a point. For example, *Scalar*, *Vector*, *CovariantVector*, or *SymmetricSecondRankTensor*.
- `pointPixelComponents`: The number of components in a point pixel. For a *Scalar* *pixelType*, this will be 1.
- `cellComponentType`: The type of the components used to represent a cell. This is one of the [`IntTypes`](https://github.com/InsightSoftwareConsortium/itk-wasm/blob/main/src/core/IntTypes.ts).
- `cellPixelComponentType`: The type of the components used to represent the data at a cell. This is one of the [`IntTypes`](https://github.com/InsightSoftwareConsortium/itk-wasm/blob/main/src/IntTypes.js) or [`FloatTypes`](https://github.com/InsightSoftwareConsortium/itk-wasm/blob/main/src/core/FloatTypes.ts).
- `cellPixelType`: The [`PixelType`](https://github.com/InsightSoftwareConsortium/itk-wasm/blob/main/src/core/PixelTypes.ts) for data associated with a cell. For example, *Scalar*, *Vector*, *CovariantVector*, or *SymmetricSecondRankTensor*.
- `cellPixelComponents`: The number of components in a cell pixel. For a *Scalar* `pixelType`, this will be 1.
