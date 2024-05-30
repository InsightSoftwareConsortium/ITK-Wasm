
# Class: BinaryData


Represents a contiguous array of bytes.
The data in representations are encoded as:

  - WIT: `list<u8>`
  - JSON: Data URI `string` with base64 encoding, zstd compression, 'data:application/zstd;base64,[...]'
  - C++: C array on the heap
  - Python: `numpy.ndarray`
  - JavaScript: TypedArray

URI: [wasm:BinaryData](https://w3id.org/itk/wasmBinaryData)


[![img](https://yuml.me/diagram/nofunky;dir:TB/class/[BinaryFile]++-%20data%201..1>[BinaryData],[BinaryStream]++-%20data%201..1>[BinaryData],[Image]++-%20data%200..1>[BinaryData],[Image]++-%20direction%201..1>[BinaryData],[Mesh]++-%20cellData%200..1>[BinaryData],[Mesh]++-%20cells%200..1>[BinaryData],[Mesh]++-%20pointData%200..1>[BinaryData],[Mesh]++-%20points%200..1>[BinaryData],[PolyData]++-%20cellData%200..1>[BinaryData],[PolyData]++-%20lines%200..1>[BinaryData],[PolyData]++-%20pointData%200..1>[BinaryData],[PolyData]++-%20points%200..1>[BinaryData],[PolyData]++-%20polygons%200..1>[BinaryData],[PolyData],[Mesh],[Image],[BinaryStream],[BinaryFile])](https://yuml.me/diagram/nofunky;dir:TB/class/[BinaryFile]++-%20data%201..1>[BinaryData],[BinaryStream]++-%20data%201..1>[BinaryData],[Image]++-%20data%200..1>[BinaryData],[Image]++-%20direction%201..1>[BinaryData],[Mesh]++-%20cellData%200..1>[BinaryData],[Mesh]++-%20cells%200..1>[BinaryData],[Mesh]++-%20pointData%200..1>[BinaryData],[Mesh]++-%20points%200..1>[BinaryData],[PolyData]++-%20cellData%200..1>[BinaryData],[PolyData]++-%20lines%200..1>[BinaryData],[PolyData]++-%20pointData%200..1>[BinaryData],[PolyData]++-%20points%200..1>[BinaryData],[PolyData]++-%20polygons%200..1>[BinaryData],[PolyData],[Mesh],[Image],[BinaryStream],[BinaryFile])

## Referenced by Class

 *  **None** *[➞data](binaryFile__data.md)*  <sub>1..1</sub>  **[BinaryData](BinaryData.md)**
 *  **None** *[➞data](binaryStream__data.md)*  <sub>1..1</sub>  **[BinaryData](BinaryData.md)**
 *  **None** *[➞data](image__data.md)*  <sub>0..1</sub>  **[BinaryData](BinaryData.md)**
 *  **None** *[➞direction](image__direction.md)*  <sub>1..1</sub>  **[BinaryData](BinaryData.md)**
 *  **None** *[➞cellData](mesh__cellData.md)*  <sub>0..1</sub>  **[BinaryData](BinaryData.md)**
 *  **None** *[➞cells](mesh__cells.md)*  <sub>0..1</sub>  **[BinaryData](BinaryData.md)**
 *  **None** *[➞pointData](mesh__pointData.md)*  <sub>0..1</sub>  **[BinaryData](BinaryData.md)**
 *  **None** *[➞points](mesh__points.md)*  <sub>0..1</sub>  **[BinaryData](BinaryData.md)**
 *  **None** *[➞cellData](polyData__cellData.md)*  <sub>0..1</sub>  **[BinaryData](BinaryData.md)**
 *  **None** *[➞lines](polyData__lines.md)*  <sub>0..1</sub>  **[BinaryData](BinaryData.md)**
 *  **None** *[➞pointData](polyData__pointData.md)*  <sub>0..1</sub>  **[BinaryData](BinaryData.md)**
 *  **None** *[➞points](polyData__points.md)*  <sub>0..1</sub>  **[BinaryData](BinaryData.md)**
 *  **None** *[➞polygons](polyData__polygons.md)*  <sub>0..1</sub>  **[BinaryData](BinaryData.md)**

## Attributes


## Other properties

|  |  |  |
| --- | --- | --- |
| **Mappings:** | | wasm:BinaryData |

