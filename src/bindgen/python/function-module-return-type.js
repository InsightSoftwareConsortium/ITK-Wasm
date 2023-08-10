import interfaceJsonTypeToPythonType from './interface-json-type-to-python-type.js'
import canonicalType from '../canonical-type.js'

function functionModuleReturnType(interfaceJson) {
  let returnType = ""
  const jsonOutputs = interfaceJson['outputs']
  if (jsonOutputs.length > 1) {
    returnType += "Tuple["
    jsonOutputs.forEach((value) => {
      const canonical = canonicalType(value.type)
      const pythonType = interfaceJsonTypeToPythonType.get(canonical)
      returnType += `${pythonType}, `
    })
    returnType = returnType.substring(0, returnType.length - 2)
    returnType += "]"
  } else {
    returnType = interfaceJsonTypeToPythonType.get(jsonOutputs[0].type)
  }

  return returnType
}

export default functionModuleReturnType
