import camelCase from './camel-case.js'

function pascalCase(param) {
  const outParam = camelCase(param)
  return `${outParam[0].toUpperCase()}${outParam.substring(1)}`
}

export default pascalCase