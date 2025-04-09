
# Class: Transform

Representation of a spatial transformation.

URI: [wasm:Transform](https://w3id.org/itk/wasmTransform)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[TransformType],[BinaryData]<parameters%201..1-++[Transform&#124;numberOfFixedParameters:integer;numberOfParameters:integer;name:string;inputSpaceName:string;outputSpaceName:string],[BinaryData]<fixedParameters%201..1-++[Transform],[TransformType]<transformType%201..1-++[Transform],[TransformList]++-%20values%201..*>[Transform],[TransformList],[BinaryData])](https://yuml.me/diagram/nofunky;dir:TB/class/[TransformType],[BinaryData]<parameters%201..1-++[Transform&#124;numberOfFixedParameters:integer;numberOfParameters:integer;name:string;inputSpaceName:string;outputSpaceName:string],[BinaryData]<fixedParameters%201..1-++[Transform],[TransformType]<transformType%201..1-++[Transform],[TransformList]++-%20values%201..*>[Transform],[TransformList],[BinaryData])

## Referenced by Class

 *  **None** *[➞values](transformList__values.md)*  <sub>1..\*</sub>  **[Transform](Transform.md)**

## Attributes


### Own

 * [➞transformType](transform__transformType.md)  <sub>1..1</sub>
     * Description: Type of the transform.
     * Range: [TransformType](TransformType.md)
 * [➞numberOfFixedParameters](transform__numberOfFixedParameters.md)  <sub>1..1</sub>
     * Description: Number of fixed parameters in the transform.
     * Range: [Integer](types/Integer.md)
 * [➞numberOfParameters](transform__numberOfParameters.md)  <sub>1..1</sub>
     * Description: Number of parameters in the transform.
     * Range: [Integer](types/Integer.md)
 * [➞name](transform__name.md)  <sub>1..1</sub>
     * Description: Name of the transform.
     * Range: [String](types/String.md)
 * [➞inputSpaceName](transform__inputSpaceName.md)  <sub>1..1</sub>
     * Description: Name of the input space.
     * Range: [String](types/String.md)
 * [➞outputSpaceName](transform__outputSpaceName.md)  <sub>1..1</sub>
     * Description: Name of the output space.
     * Range: [String](types/String.md)
 * [➞fixedParameters](transform__fixedParameters.md)  <sub>1..1</sub>
     * Description: Fixed parameters of the transform. These are always double / float64.
     * Range: [BinaryData](BinaryData.md)
 * [➞parameters](transform__parameters.md)  <sub>1..1</sub>
     * Description: Parameters of the transform.
     * Range: [BinaryData](BinaryData.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | wasm:Transform |