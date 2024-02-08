enum DispatchPixels {
  Uint8 = 'uint8_t',
  Int8 = 'int8_t',
  Uint16 = 'uint16_t',
  Int16 = 'int16_t',
  Uint32 = 'uint32_t',
  Int32 = 'int32_t',
  Float32 = 'float',
  Float64 = 'double',
  RGBUint8 = 'itk::RGBPixel<uint8_t>',
  RGBAUint8 = 'itk::RGBAPixel<uint8_t>'
  // Todo: add more pixel types
}

export default DispatchPixels
