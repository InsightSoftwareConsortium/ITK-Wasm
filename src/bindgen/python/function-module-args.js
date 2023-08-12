import snakeCase from '../snake-case.js'

import interfaceJsonTypeToPythonType from './interface-json-type-to-python-type.js'
import interfaceJsonTypeToInterfaceType from '../interface-json-type-to-interface-type.js'
import canonicalType from '../canonical-type.js'

function functionModuleArgs(interfaceJson) {
  let functionArgs = ""
  interfaceJson['inputs'].forEach((value) => {
    const canonical = canonicalType(value.type)
    const pythonType = interfaceJsonTypeToPythonType.get(canonical)
    functionArgs += `    ${snakeCase(value.name)}: ${pythonType},\n`
  })
  interfaceJson['parameters'].forEach((value) => {
    if (value.name === "memory-io" || value.name === "version") {
      return
    }
    const canonical = canonicalType(value.type)
    const pythonType = interfaceJsonTypeToPythonType.get(canonical)
    if (interfaceJsonTypeToInterfaceType.has(value.type)) {
      if(value.required && value.itemsExpectedMax > 1) {
        functionArgs += `    ${snakeCase(value.name)}: List[${pythonType}] = [],\n`
      } else {
        functionArgs += `    ${snakeCase(value.name)}: Optional[${pythonType}] = None,\n`
      }
    } else {
      if(value.itemsExpected > 1) {
        functionArgs += `    ${snakeCase(value.name)}: List[${pythonType}]`
      } else {
        functionArgs += `    ${snakeCase(value.name)}: ${pythonType}`

      }
      if(value.type === "BOOL") {
        functionArgs += ` = False,\n`
      } else if(value.type === "TEXT") {
        if (value.default) {
          functionArgs += ` = "${value.default}",\n`
        } else {
          functionArgs += ` = "",\n`
        }
      } else if(value.required && value.itemsExpectedMax > 1) {
        functionArgs += ` = [],\n`
      } else {
        functionArgs += ` = ${value.default},\n`
      }
    }
  })
  return functionArgs
}

export default functionModuleArgs
