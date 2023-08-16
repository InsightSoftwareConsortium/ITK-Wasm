# Mesh

An `Mesh` is the N-dimensional data structure to represent points sets and meshes for *itk-wasm*. It is intended to be used for data transfer and exchange as opposed to processing.

A Mesh is a JavaScript object with the following properties:

- `meshType`: The [`MeshType`](/api/MeshType) for this mesh.
- `name`: An optional name string that describes this mesh.
- `numberOfPoints`: The number of points in the mesh.
- `points`: A [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) containing the point locations.
- `numberOfPointPixels`: The number of points pixels in the mesh.
- `pointData`: A [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) containing the point pixel data.
- `numberOfCells`: The number of cells in the mesh.
- `cells`: A [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) containing the cells.
- `numberOfCellPixels`: The number of cells pixels in the mesh.
- `cellData`: A [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) containing the cell pixel data.
- `cellBufferSize`: The size of the cell buffer in `unsigned int`'s.

For more information, see [the description](https://itk.org/ITKSoftwareGuide/html/Book1/ITKSoftwareGuide-Book1ch4.html#x38-640004.3) of an `itk::Mesh` in the ITK Software Guide.
