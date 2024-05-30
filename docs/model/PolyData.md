
# Class: PolyData


Representation of a polydata, 3D geometric data for rendering that represents a collection of points, lines, polygons, and/or triangle strips.

URI: [wasm:PolyData](https://w3id.org/itk/wasmPolyData)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[BinaryData]<cellData%200..1-++[PolyData&#124;name:string;numberOfPoints:integer;linesBufferSize:integer;polygonsBufferSize:integer;numberOfPointPixels:integer;numberOfCellPixels:integer],[BinaryData]<pointData%200..1-++[PolyData],[BinaryData]<polygons%200..1-++[PolyData],[BinaryData]<lines%200..1-++[PolyData],[BinaryData]<points%200..1-++[PolyData],[InterfaceType]^-[PolyData],[InterfaceType],[BinaryData])](https://yuml.me/diagram/nofunky;dir:TB/class/[BinaryData]<cellData%200..1-++[PolyData&#124;name:string;numberOfPoints:integer;linesBufferSize:integer;polygonsBufferSize:integer;numberOfPointPixels:integer;numberOfCellPixels:integer],[BinaryData]<pointData%200..1-++[PolyData],[BinaryData]<polygons%200..1-++[PolyData],[BinaryData]<lines%200..1-++[PolyData],[BinaryData]<points%200..1-++[PolyData],[InterfaceType]^-[PolyData],[InterfaceType],[BinaryData])

## Parents

 *  is_a: [InterfaceType](InterfaceType.md) - An interface type is a higher-level type that represents the structure of data that can be passed between WebAssembly modules and the host environment.

## Attributes


### Own

 * [➞name](polyData__name.md)  <sub>1..1</sub>
     * Description: Name of the polydata.
     * Range: [String](types/String.md)
 * [➞numberOfPoints](polyData__numberOfPoints.md)  <sub>1..1</sub>
     * Description: Number of points in the polydata.
     * Range: [Integer](types/Integer.md)
 * [➞points](polyData__points.md)  <sub>0..1</sub>
     * Description: Spatial coordinates of the points. Binary data with float32 components.
     * Range: [BinaryData](BinaryData.md)
 * [➞linesBufferSize](polyData__linesBufferSize.md)  <sub>1..1</sub>
     * Description: Size of the lines buffer.
     * Range: [Integer](types/Integer.md)
 * [➞lines](polyData__lines.md)  <sub>0..1</sub>
     * Description: Connectivity of the lines. Binary data with int32 components.
     * Range: [BinaryData](BinaryData.md)
 * [➞polygonsBufferSize](polyData__polygonsBufferSize.md)  <sub>1..1</sub>
     * Description: Size of the polygons buffer.
     * Range: [Integer](types/Integer.md)
 * [➞polygons](polyData__polygons.md)  <sub>0..1</sub>
     * Description: Connectivity of the polygons. Binary data with int32 components.
     * Range: [BinaryData](BinaryData.md)
 * [➞numberOfPointPixels](polyData__numberOfPointPixels.md)  <sub>1..1</sub>
     * Description: Number of point data attributes.
     * Range: [Integer](types/Integer.md)
 * [➞pointData](polyData__pointData.md)  <sub>0..1</sub>
     * Description: Point data attributes.
     * Range: [BinaryData](BinaryData.md)
 * [➞numberOfCellPixels](polyData__numberOfCellPixels.md)  <sub>1..1</sub>
     * Description: Number of cell data attributes.
     * Range: [Integer](types/Integer.md)
 * [➞cellData](polyData__cellData.md)  <sub>0..1</sub>
     * Description: Cell data attributes.
     * Range: [BinaryData](BinaryData.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | wasm:PolyData |

