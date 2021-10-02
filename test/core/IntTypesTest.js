import test from 'ava'
import path from 'path'

import { IntTypes } from '../../dist/index.js'

test('Int8 should be defined', t => {
  const type = IntTypes.Int8
  t.is(type, 'int8_t')
})

test('UInt8 should be defined', t => {
  const type = IntTypes.UInt8
  t.is(type, 'uint8_t')
})

test('Int16 should be defined', t => {
  const type = IntTypes.Int16
  t.is(type, 'int16_t')
})

test('UInt16 should be defined', t => {
  const type = IntTypes.UInt16
  t.is(type, 'uint16_t')
})

test('Int32 should be defined', t => {
  const type = IntTypes.Int32
  t.is(type, 'int32_t')
})

test('UInt32 should be defined', t => {
  const type = IntTypes.UInt32
  t.is(type, 'uint32_t')
})

test('Int64 should be defined', t => {
  const type = IntTypes.Int64
  t.is(type, 'int64_t')
})

test('UInt64 should be defined', t => {
  const type = IntTypes.UInt64
  t.is(type, 'uint64_t')
})

test('SizeValueType should be defined', t => {
  const type = IntTypes.SizeValueType
  t.is(type, 'uint64_t')
})
test('SizeValueType should be equal to UInt64', t => {
  const type = IntTypes.SizeValueType
  t.is(type, 'uint64_t')
})

test('IdentifierType should be defined', t => {
  const type = IntTypes.IdentifierType
  t.is(type, 'uint64_t')
})
test('IdentifierType should be equal to UInt64', t => {
  const type = IntTypes.IdentifierType
  t.is(type, 'uint64_t')
})

test('IndexValueType should be defined', t => {
  const type = IntTypes.IndexValueType
  t.is(type, 'int64_t')
})
test('IndexValueType should be equal to Int64', t => {
  const type = IntTypes.IndexValueType
  t.is(type, 'int64_t')
})

test('OffsetValueType should be defined', t => {
  const type = IntTypes.OffsetValueType
  t.is(type, 'int64_t')
})
test('OffsetValueType should be equal to Int64', t => {
  const type = IntTypes.OffsetValueType
  t.is(type, 'int64_t')
})
