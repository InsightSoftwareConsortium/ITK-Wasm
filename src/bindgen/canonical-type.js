function canonicalType(parameterType) {
  // Strip extras
  const canonical = parameterType.split(' ')[0]
  return canonical
}

export default canonicalType