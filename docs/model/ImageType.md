
# Class: ImageType


Representation of an N-dimensional scientific image type.

URI: [wasm:ImageType](https://w3id.org/itk/wasmImageType)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[Image]++-%20imageType%201..1>[ImageType&#124;dimension:integer;componentType:string;pixelType:PixelTypes;components:integer],[Image])](https://yuml.me/diagram/nofunky;dir:TB/class/[Image]++-%20imageType%201..1>[ImageType&#124;dimension:integer;componentType:string;pixelType:PixelTypes;components:integer],[Image])

## Referenced by Class

 *  **None** *[➞imageType](image__imageType.md)*  <sub>1..1</sub>  **[ImageType](ImageType.md)**

## Attributes


### Own

 * [dimension](dimension.md)  <sub>1..1</sub>
     * Description: Number of spatial dimensions.
     * Range: [Integer](types/Integer.md)
 * [componentType](componentType.md)  <sub>1..1</sub>
     * Description: Type of binary data components in a pixel.
     * Range: [String](types/String.md)
 * [pixelType](pixelType.md)  <sub>1..1</sub>
     * Description: Type of the pixel or attribute.
     * Range: [PixelTypes](PixelTypes.md)
 * [components](components.md)  <sub>1..1</sub>
     * Description: Number of components in a pixels.
     * Range: [Integer](types/Integer.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | wasm:ImageType |

