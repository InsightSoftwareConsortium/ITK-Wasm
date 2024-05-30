
# Class: Mesh


Representation of an N-dimensional mesh.

URI: [wasm:Mesh](https://w3id.org/itk/wasmMesh)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[MeshType],[BinaryData]<cellData%200..1-++[Mesh&#124;name:string;numberOfPoints:integer;numberOfPointPixels:integer;numberOfCells:integer;cellBufferSize:integer;numberOfCellPixels:integer],[BinaryData]<cells%200..1-++[Mesh],[BinaryData]<pointData%200..1-++[Mesh],[BinaryData]<points%200..1-++[Mesh],[MeshType]<meshType%201..1-++[Mesh],[InterfaceType]^-[Mesh],[InterfaceType],[BinaryData])](https://yuml.me/diagram/nofunky;dir:TB/class/[MeshType],[BinaryData]<cellData%200..1-++[Mesh&#124;name:string;numberOfPoints:integer;numberOfPointPixels:integer;numberOfCells:integer;cellBufferSize:integer;numberOfCellPixels:integer],[BinaryData]<cells%200..1-++[Mesh],[BinaryData]<pointData%200..1-++[Mesh],[BinaryData]<points%200..1-++[Mesh],[MeshType]<meshType%201..1-++[Mesh],[InterfaceType]^-[Mesh],[InterfaceType],[BinaryData])

## Parents

 *  is_a: [InterfaceType](InterfaceType.md) - An interface type is a higher-level type that represents the structure of data that can be passed between WebAssembly modules and the host environment.

## Attributes


### Own

 * [➞meshType](mesh__meshType.md)  <sub>1..1</sub>
     * Description: The type of the mesh.
     * Range: [MeshType](MeshType.md)
 * [➞name](mesh__name.md)  <sub>1..1</sub>
     * Description: Name of the mesh.
     * Range: [String](types/String.md)
 * [➞numberOfPoints](mesh__numberOfPoints.md)  <sub>1..1</sub>
     * Description: Number of points in the mesh.
     * Range: [Integer](types/Integer.md)
 * [➞points](mesh__points.md)  <sub>0..1</sub>
     * Description: Spatial coordinates of the points.
     * Range: [BinaryData](BinaryData.md)
 * [➞numberOfPointPixels](mesh__numberOfPointPixels.md)  <sub>1..1</sub>
     * Description: Number of point data attributes.
     * Range: [Integer](types/Integer.md)
 * [➞pointData](mesh__pointData.md)  <sub>0..1</sub>
     * Description: Point data attributes.
     * Range: [BinaryData](BinaryData.md)
 * [➞numberOfCells](mesh__numberOfCells.md)  <sub>1..1</sub>
     * Description: Number of cells in the mesh.
     * Range: [Integer](types/Integer.md)
 * [➞cells](mesh__cells.md)  <sub>0..1</sub>
     * Description: Connectivity of the cells.
     * Range: [BinaryData](BinaryData.md)
 * [➞cellBufferSize](mesh__cellBufferSize.md)  <sub>1..1</sub>
     * Description: Size of the cell buffer.
     * Range: [Integer](types/Integer.md)
 * [➞numberOfCellPixels](mesh__numberOfCellPixels.md)  <sub>1..1</sub>
     * Description: Number of cell data attributes.
     * Range: [Integer](types/Integer.md)
 * [➞cellData](mesh__cellData.md)  <sub>0..1</sub>
     * Description: Cell data attributes.
     * Range: [BinaryData](BinaryData.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | wasm:Mesh |

