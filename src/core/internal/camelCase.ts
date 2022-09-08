function camelCase (kebobCase: string): string {
  return kebobCase.replace(/-([a-z])/g, (kk) => {
    return kk[1].toUpperCase()
  })
}

export default camelCase
