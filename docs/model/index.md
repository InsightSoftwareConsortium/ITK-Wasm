
# LinkML Model


**[LinkML](https://linkml.io) metamodel version:** 1.7.0

**ITK-Wasm model version:** 0.1.0


The ITK-Wasm LinkML model provides FAIR definitions of the interface types that enable high-performance, portable, sustainable, and reproducible spatial analysis.


### Classes

 * [BinaryData](BinaryData.md) - Represents a contiguous array of bytes.
 * [DoubleList](DoubleList.md) - Representation of a sequence of doubles.
 * [FloatList](FloatList.md) - Representation of a sequence of floats.
 * [ImageType](ImageType.md) - Representation of an N-dimensional scientific image type.
 * [IntegerList](IntegerList.md) - Representation of a sequence of integers.
 * [InterfaceType](InterfaceType.md) - An interface type is a higher-level type that represents the structure of data that can be passed between WebAssembly modules and the host environment.
     * [BinaryFile](BinaryFile.md) - Representation of a binary file on a filesystem. For performance reasons, use BinaryStream when possible, instead of BinaryFile.
     * [BinaryStream](BinaryStream.md) - Representation of a binary stream. For performance reasons, use BinaryStream when possible, instead of BinaryFile.
     * [Image](Image.md) - Representation of an N-dimensional scientific image.
     * [JsonCompatible](JsonCompatible.md) - A type that can be represented in JSON.
     * [Mesh](Mesh.md) - Representation of an N-dimensional mesh.
     * [PolyData](PolyData.md) - Representation of a polydata, 3D geometric data for rendering that represents a collection of points, lines, polygons, and/or triangle strips.
     * [TextFile](TextFile.md) - Representation of a text file on a filesystem. For performance reasons, use TextStream when possible, instead of TextFile.
     * [TextStream](TextStream.md) - Representation of a text stream. For performance reasons, use TextStream when possible, instead of TextFile.
 * [MeshType](MeshType.md) - Representation of a mesh type. Here "Pixel" refers to the data attributes associated with the mesh.
 * [Metadata](Metadata.md) - Representation of generic key-value metadata.
 * [MetadataEntry](MetadataEntry.md) - Representation of a generic key-value metadata entry.
 * [StringList](StringList.md) - Representation of a sequence of strings.

### Mixins


### Slots

 * [➞data](binaryFile__data.md) - The content of the binary file.
 * [➞data](binaryStream__data.md) - The content of the binary stream.
 * [cellComponentType](cellComponentType.md) - Type of binary data components used to represent a cell. Typically int32.
 * [cellPixelComponentType](cellPixelComponentType.md) - Type of binary data components associated with a cell data attribute.
 * [cellPixelComponents](cellPixelComponents.md) - Number of components in a cell data attribute.
 * [cellPixelType](cellPixelType.md) - Type of the cell data attribute.
 * [componentType](componentType.md) - Type of binary data components in a pixel.
 * [components](components.md) - Number of components in a pixels.
 * [dimension](dimension.md) - Number of spatial dimensions.
 * [➞values](doubleList__values.md) - The content of the double sequence.
 * [➞values](floatList__values.md) - The content of the float sequence.
 * [➞data](image__data.md) - Content of the image pixels.
 * [➞direction](image__direction.md) - Orientation of the pixel grid in physical space.
 * [➞imageType](image__imageType.md) - Type of the image.
 * [➞metadata](image__metadata.md) - Metadata for the image.
 * [➞name](image__name.md) - Name of the image.
 * [➞origin](image__origin.md) - Location of the center of the first pixel in physical space.
 * [➞size](image__size.md) - Number of image pixels in each dimension.
 * [➞spacing](image__spacing.md) - Size of a pixel in physical space.
 * [➞values](integerList__values.md) - The content of the integer sequence.
 * [➞cellBufferSize](mesh__cellBufferSize.md) - Size of the cell buffer.
 * [➞cellData](mesh__cellData.md) - Cell data attributes.
 * [➞cells](mesh__cells.md) - Connectivity of the cells.
 * [➞meshType](mesh__meshType.md) - The type of the mesh.
 * [➞name](mesh__name.md) - Name of the mesh.
 * [➞numberOfCellPixels](mesh__numberOfCellPixels.md) - Number of cell data attributes.
 * [➞numberOfCells](mesh__numberOfCells.md) - Number of cells in the mesh.
 * [➞numberOfPointPixels](mesh__numberOfPointPixels.md) - Number of point data attributes.
 * [➞numberOfPoints](mesh__numberOfPoints.md) - Number of points in the mesh.
 * [➞pointData](mesh__pointData.md) - Point data attributes.
 * [➞points](mesh__points.md) - Spatial coordinates of the points.
 * [➞key](metadataEntry__key.md) - The key of the metadata entry.
 * [➞value](metadataEntry__value.md) - The value of the metadata entry.
 * [➞entries](metadata__entries.md) - The content of the metadata.
 * [path](path.md) - The filename or path.
 * [pixelType](pixelType.md) - Type of the pixel or attribute.
 * [pointComponentType](pointComponentType.md) - Type of binary data components in a point. Typically float32.
 * [pointPixelComponentType](pointPixelComponentType.md) - Type of binary data components associated with a point data attribute.
 * [pointPixelComponents](pointPixelComponents.md) - Number of components in a point data attribute.
 * [pointPixelType](pointPixelType.md) - Type of the point data attribute.
 * [➞cellData](polyData__cellData.md) - Cell data attributes.
 * [➞lines](polyData__lines.md) - Connectivity of the lines. Binary data with int32 components.
 * [➞linesBufferSize](polyData__linesBufferSize.md) - Size of the lines buffer.
 * [➞name](polyData__name.md) - Name of the polydata.
 * [➞numberOfCellPixels](polyData__numberOfCellPixels.md) - Number of cell data attributes.
 * [➞numberOfPointPixels](polyData__numberOfPointPixels.md) - Number of point data attributes.
 * [➞numberOfPoints](polyData__numberOfPoints.md) - Number of points in the polydata.
 * [➞pointData](polyData__pointData.md) - Point data attributes.
 * [➞points](polyData__points.md) - Spatial coordinates of the points. Binary data with float32 components.
 * [➞polygons](polyData__polygons.md) - Connectivity of the polygons. Binary data with int32 components.
 * [➞polygonsBufferSize](polyData__polygonsBufferSize.md) - Size of the polygons buffer.
 * [➞values](stringList__values.md) - The content of the string sequence.
 * [➞data](textFile__data.md) - The content of the text file.
 * [➞data](textStream__data.md) - The content of the text stream.

### Enums

 * [FloatTypes](FloatTypes.md) - Float types.
 * [IntTypes](IntTypes.md) - Integer types.
 * [PixelTypes](PixelTypes.md) - Pixel or attribute types.

### Subsets


### Types


#### Built in

 * **Bool**
 * **Curie**
 * **Decimal**
 * **ElementIdentifier**
 * **NCName**
 * **NodeIdentifier**
 * **URI**
 * **URIorCURIE**
 * **XSDDate**
 * **XSDDateTime**
 * **XSDTime**
 * **float**
 * **int**
 * **str**

#### Defined

 * [Boolean](types/Boolean.md)  (**Bool**)  - A binary (true or false) value
 * [Curie](types/Curie.md)  (**Curie**)  - a compact URI
 * [Date](types/Date.md)  (**XSDDate**)  - a date (year, month and day) in an idealized calendar
 * [DateOrDatetime](types/DateOrDatetime.md)  (**str**)  - Either a date or a datetime
 * [Datetime](types/Datetime.md)  (**XSDDateTime**)  - The combination of a date and time
 * [Decimal](types/Decimal.md)  (**Decimal**)  - A real number with arbitrary precision that conforms to the xsd:decimal specification
 * [Double](types/Double.md)  (**float**)  - A real number that conforms to the xsd:double specification
 * [Float](types/Float.md)  (**float**)  - A real number that conforms to the xsd:float specification
 * [Integer](types/Integer.md)  (**int**)  - An integer
 * [Jsonpath](types/Jsonpath.md)  (**str**)  - A string encoding a JSON Path. The value of the string MUST conform to JSON Point syntax and SHOULD dereference to zero or more valid objects within the current instance document when encoded in tree form.
 * [Jsonpointer](types/Jsonpointer.md)  (**str**)  - A string encoding a JSON Pointer. The value of the string MUST conform to JSON Point syntax and SHOULD dereference to a valid object within the current instance document when encoded in tree form.
 * [Ncname](types/Ncname.md)  (**NCName**)  - Prefix part of CURIE
 * [Nodeidentifier](types/Nodeidentifier.md)  (**NodeIdentifier**)  - A URI, CURIE or BNODE that represents a node in a model.
 * [Objectidentifier](types/Objectidentifier.md)  (**ElementIdentifier**)  - A URI or CURIE that represents an object in the model.
 * [Sparqlpath](types/Sparqlpath.md)  (**str**)  - A string encoding a SPARQL Property Path. The value of the string MUST conform to SPARQL syntax and SHOULD dereference to zero or more valid objects within the current instance document when encoded as RDF.
 * [String](types/String.md)  (**str**)  - A character string
 * [Time](types/Time.md)  (**XSDTime**)  - A time object represents a (local) time of day, independent of any particular day
 * [Uri](types/Uri.md)  (**URI**)  - a complete URI
 * [Uriorcurie](types/Uriorcurie.md)  (**URIorCURIE**)  - a URI or a CURIE
