
# Class: Image


Representation of an N-dimensional scientific image.

URI: [wasm:Image](https://w3id.org/itk/wasmImage)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[InterfaceType],[ImageType],[BinaryData]<data%200..1-++[Image&#124;name:string;origin:double%20%2B;spacing:double%20%2B;size:integer%20%2B;metadata:string],[BinaryData]<direction%201..1-++[Image],[ImageType]<imageType%201..1-++[Image],[InterfaceType]^-[Image],[BinaryData])](https://yuml.me/diagram/nofunky;dir:TB/class/[InterfaceType],[ImageType],[BinaryData]<data%200..1-++[Image&#124;name:string;origin:double%20%2B;spacing:double%20%2B;size:integer%20%2B;metadata:string],[BinaryData]<direction%201..1-++[Image],[ImageType]<imageType%201..1-++[Image],[InterfaceType]^-[Image],[BinaryData])

## Parents

 *  is_a: [InterfaceType](InterfaceType.md) - An interface type is a higher-level type that represents the structure of data that can be passed between WebAssembly modules and the host environment.

## Attributes


### Own

 * [➞imageType](image__imageType.md)  <sub>1..1</sub>
     * Description: Type of the image.
     * Range: [ImageType](ImageType.md)
 * [➞name](image__name.md)  <sub>1..1</sub>
     * Description: Name of the image.
     * Range: [String](types/String.md)
 * [➞origin](image__origin.md)  <sub>1..\*</sub>
     * Description: Location of the center of the first pixel in physical space.
x, y, z, ... order.
     * Range: [Double](types/Double.md)
 * [➞spacing](image__spacing.md)  <sub>1..\*</sub>
     * Description: Size of a pixel in physical space.
x, y, z, ... order.
     * Range: [Double](types/Double.md)
 * [➞direction](image__direction.md)  <sub>1..1</sub>
     * Description: Orientation of the pixel grid in physical space.
Encoded as float64 binary data in column-major order of length NxN where N is the spatial dimension of the image. x, y, z, ... order.
     * Range: [BinaryData](BinaryData.md)
 * [➞size](image__size.md)  <sub>1..\*</sub>
     * Description: Number of image pixels in each dimension.
x, y, z, ... order.
     * Range: [Integer](types/Integer.md)
 * [➞metadata](image__metadata.md)  <sub>1..1</sub>
     * Description: Metadata for the image.
     * Range: [String](types/String.md)
 * [➞data](image__data.md)  <sub>0..1</sub>
     * Description: Content of the image pixels.
Encoded in column-major order, i.e. contiguous x. Multi-component pixels are interleaved.
     * Range: [BinaryData](BinaryData.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | wasm:Image |

