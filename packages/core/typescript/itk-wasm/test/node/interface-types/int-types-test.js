import test from 'ava'

import { IntTypes } from '../../../dist/index-node.js'

test('Int8 should be defined', t => {
  const type = IntTypes.Int8
  t.is(type, 'int8')
})

test('UInt8 should be defined', t => {
  const type = IntTypes.UInt8
  t.is(type, 'uint8')
})

test('Int16 should be defined', t => {
  const type = IntTypes.Int16
  t.is(type, 'int16')
})

test('UInt16 should be defined', t => {
  const type = IntTypes.UInt16
  t.is(type, 'uint16')
})

test('Int32 should be defined', t => {
  const type = IntTypes.Int32
  t.is(type, 'int32')
})

test('UInt32 should be defined', t => {
  const type = IntTypes.UInt32
  t.is(type, 'uint32')
})

test('Int64 should be defined', t => {
  const type = IntTypes.Int64
  t.is(type, 'int64')
})

test('UInt64 should be defined', t => {
  const type = IntTypes.UInt64
  t.is(type, 'uint64')
})

test('SizeValueType should be defined', t => {
  const type = IntTypes.SizeValueType
  t.is(type, 'uint64')
})
test('SizeValueType should be equal to UInt64', t => {
  const type = IntTypes.SizeValueType
  t.is(type, 'uint64')
})

test('IdentifierType should be defined', t => {
  const type = IntTypes.IdentifierType
  t.is(type, 'uint64')
})
test('IdentifierType should be equal to UInt64', t => {
  const type = IntTypes.IdentifierType
  t.is(type, 'uint64')
})

test('IndexValueType should be defined', t => {
  const type = IntTypes.IndexValueType
  t.is(type, 'int64')
})
test('IndexValueType should be equal to Int64', t => {
  const type = IntTypes.IndexValueType
  t.is(type, 'int64')
})

test('OffsetValueType should be defined', t => {
  const type = IntTypes.OffsetValueType
  t.is(type, 'int64')
})
test('OffsetValueType should be equal to Int64', t => {
  const type = IntTypes.OffsetValueType
  t.is(type, 'int64')
})
