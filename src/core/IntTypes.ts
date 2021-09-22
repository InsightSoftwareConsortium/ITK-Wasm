const IntTypes = {
   Int8: 'int8_t',
   UInt8: 'uint8_t',
   Int16: 'int16_t',
   UInt16: 'uint16_t',
   Int32: 'int32_t',
   UInt32: 'uint32_t',
   Int64: 'int64_t',
   UInt64: 'uint64_t',

   SizeValueType: 'uint64_t',
   IdentifierType: 'uint64_t',
   IndexValueType: 'int64_t',
   OffsetValueType: 'int64_t',
} as const

export default IntTypes
