function camelCase (kebobCase: string): string {
  // make any alphabets that follows '-' an uppercase character, and remove the corresponding hyphen
  const cameledParam = kebobCase.replace(/-([a-z])/g, (kk) => {
    return kk[1].toUpperCase()
  })

  // remove all non-alphanumeric characters
  const outParam = cameledParam.replace(/([^0-9a-z])/ig, '')

  // check if resulting string is empty
  if (outParam === '') {
    console.error('Resulting string is empty.')
  }
  return outParam
}

export default camelCase
