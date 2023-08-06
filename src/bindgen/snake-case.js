function snakeCase(kebabCase) {
  return kebabCase.replaceAll('-', '_')
}

export default snakeCase