
# Class: TransformType

Representation of an N-dimensional scientific spatial transformation.

URI: [wasm:TransformType](https://w3id.org/itk/wasmTransformType)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[Transform]++-%20transformType%201..1>[TransformType&#124;parametersValueType:string;inputDimension:integer;outputDimension:integer;transformParameterization:TransformParameterizations],[Transform])](https://yuml.me/diagram/nofunky;dir:TB/class/[Transform]++-%20transformType%201..1>[TransformType&#124;parametersValueType:string;inputDimension:integer;outputDimension:integer;transformParameterization:TransformParameterizations],[Transform])

## Referenced by Class

 *  **None** *[➞transformType](transform__transformType.md)*  <sub>1..1</sub>  **[TransformType](TransformType.md)**

## Attributes


### Own

 * [parametersValueType](parametersValueType.md)  <sub>1..1</sub>
     * Description: Type of binary data components in a transform.
     * Range: [String](types/String.md)
 * [➞inputDimension](transformType__inputDimension.md)  <sub>1..1</sub>
     * Description: Dimension of the input space.
     * Range: [Integer](types/Integer.md)
 * [➞outputDimension](transformType__outputDimension.md)  <sub>1..1</sub>
     * Description: Dimension of the output space.
     * Range: [Integer](types/Integer.md)
 * [➞transformParameterization](transformType__transformParameterization.md)  <sub>1..1</sub>
     * Description: How the transform is parameterized.
     * Range: [TransformParameterizations](TransformParameterizations.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | wasm:TransformType |