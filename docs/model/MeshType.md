
# Class: MeshType


Representation of a mesh type. Here "Pixel" refers to the data attributes associated with the mesh.

URI: [wasm:MeshType](https://w3id.org/itk/wasmMeshType)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[Mesh]++-%20meshType%201..1>[MeshType&#124;dimension:integer;pointComponentType:FloatTypes;pointPixelComponentType:string;pointPixelType:PixelTypes;pointPixelComponents:integer;cellComponentType:IntTypes;cellPixelComponentType:string;cellPixelType:PixelTypes;cellPixelComponents:integer],[Mesh])](https://yuml.me/diagram/nofunky;dir:TB/class/[Mesh]++-%20meshType%201..1>[MeshType&#124;dimension:integer;pointComponentType:FloatTypes;pointPixelComponentType:string;pointPixelType:PixelTypes;pointPixelComponents:integer;cellComponentType:IntTypes;cellPixelComponentType:string;cellPixelType:PixelTypes;cellPixelComponents:integer],[Mesh])

## Referenced by Class

 *  **None** *[➞meshType](mesh__meshType.md)*  <sub>1..1</sub>  **[MeshType](MeshType.md)**

## Attributes


### Own

 * [dimension](dimension.md)  <sub>1..1</sub>
     * Description: Number of spatial dimensions.
     * Range: [Integer](types/Integer.md)
 * [pointComponentType](pointComponentType.md)  <sub>1..1</sub>
     * Description: Type of binary data components in a point. Typically float32.
     * Range: [FloatTypes](FloatTypes.md)
 * [pointPixelComponentType](pointPixelComponentType.md)  <sub>1..1</sub>
     * Description: Type of binary data components associated with a point data attribute.
     * Range: [String](types/String.md)
 * [pointPixelType](pointPixelType.md)  <sub>1..1</sub>
     * Description: Type of the point data attribute.
     * Range: [PixelTypes](PixelTypes.md)
 * [pointPixelComponents](pointPixelComponents.md)  <sub>1..1</sub>
     * Description: Number of components in a point data attribute.
     * Range: [Integer](types/Integer.md)
 * [cellComponentType](cellComponentType.md)  <sub>1..1</sub>
     * Description: Type of binary data components used to represent a cell. Typically int32.
     * Range: [IntTypes](IntTypes.md)
 * [cellPixelComponentType](cellPixelComponentType.md)  <sub>1..1</sub>
     * Description: Type of binary data components associated with a cell data attribute.
     * Range: [String](types/String.md)
 * [cellPixelType](cellPixelType.md)  <sub>1..1</sub>
     * Description: Type of the cell data attribute.
     * Range: [PixelTypes](PixelTypes.md)
 * [cellPixelComponents](cellPixelComponents.md)  <sub>1..1</sub>
     * Description: Number of components in a cell data attribute.
     * Range: [Integer](types/Integer.md)
 * [cellPixelComponentType](cellPixelComponentType.md)  <sub>1..1</sub>
     * Description: Type of binary data components associated with a cell data attribute.
     * Range: [String](types/String.md)
 * [cellPixelType](cellPixelType.md)  <sub>1..1</sub>
     * Description: Type of the cell data attribute.
     * Range: [PixelTypes](PixelTypes.md)
 * [cellPixelComponents](cellPixelComponents.md)  <sub>1..1</sub>
     * Description: Number of components in a cell data attribute.
     * Range: [Integer](types/Integer.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | wasm:MeshType |

