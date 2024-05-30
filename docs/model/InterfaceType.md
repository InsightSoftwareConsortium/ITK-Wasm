
# Class: InterfaceType


An interface type is a higher-level type that represents the structure of data that can be passed between WebAssembly modules and the host environment.
The higher level abstract types that are defined in this model have an idiomatic and efficient representation in WebAssembly and programming languages that compile to or embed WebAssembly modules.
There are idiomatic representations and one-to-one mappings between:
- The WebAssembly Component Model Interface Types (WIT) (future) - JSON encoding (future) - C++ `itk::wasm` namespaced types in the ITK WebAssemblyInterface module - Python `itkwasm` package types - JavaScript `ITK-Wasm` package types - Java package types (future) - C# package types (future)

URI: [wasm:InterfaceType](https://w3id.org/itk/wasmInterfaceType)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[TextStream],[TextFile],[PolyData],[Mesh],[JsonCompatible],[InterfaceType]^-[TextStream],[InterfaceType]^-[TextFile],[InterfaceType]^-[PolyData],[InterfaceType]^-[Mesh],[InterfaceType]^-[JsonCompatible],[InterfaceType]^-[Image],[InterfaceType]^-[BinaryStream],[InterfaceType]^-[BinaryFile],[Image],[BinaryStream],[BinaryFile])](https://yuml.me/diagram/nofunky;dir:TB/class/[TextStream],[TextFile],[PolyData],[Mesh],[JsonCompatible],[InterfaceType]^-[TextStream],[InterfaceType]^-[TextFile],[InterfaceType]^-[PolyData],[InterfaceType]^-[Mesh],[InterfaceType]^-[JsonCompatible],[InterfaceType]^-[Image],[InterfaceType]^-[BinaryStream],[InterfaceType]^-[BinaryFile],[Image],[BinaryStream],[BinaryFile])

## Children

 * [BinaryFile](BinaryFile.md) - Representation of a binary file on a filesystem. For performance reasons, use BinaryStream when possible, instead of BinaryFile.
 * [BinaryStream](BinaryStream.md) - Representation of a binary stream. For performance reasons, use BinaryStream when possible, instead of BinaryFile.
 * [Image](Image.md) - Representation of an N-dimensional scientific image.
 * [JsonCompatible](JsonCompatible.md) - A type that can be represented in JSON.
 * [Mesh](Mesh.md) - Representation of an N-dimensional mesh.
 * [PolyData](PolyData.md) - Representation of a polydata, 3D geometric data for rendering that represents a collection of points, lines, polygons, and/or triangle strips.
 * [TextFile](TextFile.md) - Representation of a text file on a filesystem. For performance reasons, use TextStream when possible, instead of TextFile.
 * [TextStream](TextStream.md) - Representation of a text stream. For performance reasons, use TextStream when possible, instead of TextFile.

## Referenced by Class


## Attributes


## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | wasm:InterfaceType |

