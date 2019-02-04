title: MeshType
---

The `itk/MeshType` describes the type of an [Mesh](./Mesh.html). It is a JSON object with the following attributes:

**dimension**: The spatial dimension of the mesh.
**pointComponentType**: The type of the components used to represent a point. This is one of the [FloatTypes](https://github.com/InsightSoftwareConsortium/itk-js/blob/master/src/FloatTypes.js).
**pointPixelComponentType**: The type of the components used to represent the data at a point. This is one of the [IntTypes](https://github.com/InsightSoftwareConsortium/itk-js/blob/master/src/IntTypes.js) or [FloatTypes](https://github.com/InsightSoftwareConsortium/itk-js/blob/master/src/FloatTypes.js).
**pointPixelType**: The [PixelType](https://github.com/InsightSoftwareConsortium/itk-js/blob/master/src/PixelTypes.js) for data associated with a point. For example, *Scalar*, *Vector*, *CovariantVector*, or *SymmetricSecondRankTensor*.
**pointPixelComponents**: The number of components in a point pixel. For a *Scalar* *pixelType*, this will be 1.
**cellComponentType**: The type of the components used to represent a cell. This is one of the [IntTypes](https://github.com/InsightSoftwareConsortium/itk-js/blob/master/src/IntTypes.js).
**cellPixelComponentType**: The type of the components used to represent the data at a cell. This is one of the [IntTypes](https://github.com/InsightSoftwareConsortium/itk-js/blob/master/src/IntTypes.js) or [FloatTypes](https://github.com/InsightSoftwareConsortium/itk-js/blob/master/src/FloatTypes.js).
**cellPixelType**: The [PixelType](https://github.com/InsightSoftwareConsortium/itk-js/blob/master/src/PixelTypes.js) for data associated with a cell. For example, *Scalar*, *Vector*, *CovariantVector*, or *SymmetricSecondRankTensor*.
**cellPixelComponents**: The number of components in a cell pixel. For a *Scalar* *pixelType*, this will be 1.
