function canonicalType(parameterType) {
  // Strip extras
  let canonical = parameterType.split(' ')[0]
  canonical = canonical.split(':')[0]
  return canonical
}

export default canonicalType
