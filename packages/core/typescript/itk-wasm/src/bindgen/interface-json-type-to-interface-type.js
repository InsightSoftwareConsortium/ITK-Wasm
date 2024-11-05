const interfaceJsonTypeToInterfaceType = new Map([
  ['INPUT_TEXT_FILE:FILE', 'TextFile'],
  ['OUTPUT_TEXT_FILE:FILE', 'TextFile'],
  ['INPUT_TEXT_FILE', 'TextFile'],
  ['OUTPUT_TEXT_FILE', 'TextFile'],
  ['INPUT_BINARY_FILE:FILE', 'BinaryFile'],
  ['OUTPUT_BINARY_FILE:FILE', 'BinaryFile'],
  ['INPUT_BINARY_FILE', 'BinaryFile'],
  ['OUTPUT_BINARY_FILE', 'BinaryFile'],
  ['INPUT_TEXT_STREAM', 'TextStream'],
  ['OUTPUT_TEXT_STREAM', 'TextStream'],
  ['INPUT_BINARY_STREAM', 'BinaryStream'],
  ['OUTPUT_BINARY_STREAM', 'BinaryStream'],
  ['INPUT_IMAGE', 'Image'],
  ['OUTPUT_IMAGE', 'Image'],
  ['INPUT_MESH', 'Mesh'],
  ['OUTPUT_MESH', 'Mesh'],
  ['INPUT_POINT_SET', 'PointSet'],
  ['OUTPUT_POINT_SET', 'PointSet'],
  ['INPUT_POLYDATA', 'PolyData'],
  ['OUTPUT_POLYDATA', 'PolyData'],
  ['INPUT_TRANSFORM', 'TransformList'],
  ['OUTPUT_TRANSFORM', 'TransformList'],
  ['INPUT_JSON', 'JsonCompatible'],
  ['OUTPUT_JSON', 'JsonCompatible']
])

export default interfaceJsonTypeToInterfaceType
