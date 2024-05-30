
# Class: TextFile


Representation of a text file on a filesystem. For performance reasons, use TextStream when possible, instead of TextFile.

URI: [wasm:TextFile](https://w3id.org/itk/wasmTextFile)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[InterfaceType]^-[TextFile&#124;path:string;data:string],[InterfaceType])](https://yuml.me/diagram/nofunky;dir:TB/class/[InterfaceType]^-[TextFile&#124;path:string;data:string],[InterfaceType])

## Parents

 *  is_a: [InterfaceType](InterfaceType.md) - An interface type is a higher-level type that represents the structure of data that can be passed between WebAssembly modules and the host environment.

## Attributes


### Own

 * [path](path.md)  <sub>1..1</sub>
     * Description: The filename or path.
     * Range: [String](types/String.md)
 * [➞data](textFile__data.md)  <sub>1..1</sub>
     * Description: The content of the text file.
     * Range: [String](types/String.md)

## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | wasm:TextFile |

