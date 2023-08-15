# PolyData

A `PolyData` is represents renderable geometry.

A PolyData is a JavaScript object with the following properties:

- `name`: An optional name string that describes this polydata.

- `numberOfPoints`: Number of points.
- `points`: `Float32Array` of x,y,z point locations.

- `verticesBufferSize`: Integer size of the vertices buffer.
- `vertices`: `null | Uint32Array` vertices identifiers in the format *[1 pointIndex1 1 pointIndex2 1 pointIndex3 ... ]*.

- `linesBufferSize`: Integer size of the lines buffer.
- `lines`: `null | Uint32Array`  lines in the format *[nPointsLine1 pointIndex1 pointIndex2 nPointsLine2 pointIndex1 pointIndex2 ... ]*.

- `polygonsBufferSize`: Integer size of the polygons buffer.
- `polygons`: `null | Uint32Array` polygons in the format *[nPointsPolygon1 pointIndex1 pointIndex2 nPointsPolygon2 pointIndex1 pointIndex2 ... ]*.

- `triangleStripsBufferSize`: Integer size of the triangle strips buffer.
- `triangleStrips`: `null | Uint32Array` triangle strips in the format *[nPointsTriangleStrip1 pointIndex1 pointIndex2 nPointsTriangleStrip2 pointIndex1 pointIndex2 ... ]*.

- `numberOfPointPixels`: Integer number of point pixels.
- `pointData`: `null | TypedArray` data associated with points.

- `numberOfCellPixels`: Integer number of cell pixels.
- `cellData`: `null | TypedArray` data associated with cells.