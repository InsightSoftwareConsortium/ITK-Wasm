
# Class: BinaryFile


Representation of a binary file on a filesystem. For performance reasons, use BinaryStream when possible, instead of BinaryFile.

URI: [wasm:BinaryFile](https://w3id.org/itk/wasmBinaryFile)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[InterfaceType],[BinaryData]<data%201..1-++[BinaryFile&#124;path:string],[InterfaceType]^-[BinaryFile],[BinaryData])](https://yuml.me/diagram/nofunky;dir:TB/class/[InterfaceType],[BinaryData]<data%201..1-++[BinaryFile&#124;path:string],[InterfaceType]^-[BinaryFile],[BinaryData])

## Parents

 *  is_a: [InterfaceType](InterfaceType.md) - An interface type is a higher-level type that represents the structure of data that can be passed between WebAssembly modules and the host environment.

## Attributes


### Own

 * [path](path.md)  <sub>1..1</sub>
     * Description: The filename or path.
     * Range: [String](types/String.md)
 * [➞data](binaryFile__data.md)  <sub>1..1</sub>
     * Description: The content of the binary file.
     * Range: [BinaryData](BinaryData.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | wasm:BinaryFile |

