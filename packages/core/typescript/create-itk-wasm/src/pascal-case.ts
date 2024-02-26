import camelCase from './camel-case.js'

function pascalCase(param: string): string {
  const outParam = camelCase(param)
  return `${outParam[0].toUpperCase()}${outParam.substring(1)}`
}

export default pascalCase
