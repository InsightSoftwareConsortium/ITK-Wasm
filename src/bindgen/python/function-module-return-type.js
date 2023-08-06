import interfaceJsonTypeToPythonType from './interface-json-type-to-python-type.js'

function functionModuleReturnType(interfaceJson) {
  let returnType = ""
  const jsonOutputs = interfaceJson['outputs']
  if (jsonOutputs.length > 1) {
    returnType += "Tuple["
    jsonOutputs.forEach((value) => {
      const pythonType = interfaceJsonTypeToPythonType.get(value.type)
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
