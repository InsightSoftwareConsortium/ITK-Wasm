import snakeCase from "../snake-case.js"

import interfaceJsonTypeToPythonType from './interface-json-type-to-python-type.js'

function functionModuleDocstring(interfaceJson) {
  let docstring = `"""${interfaceJson.description}
`
  interfaceJson['inputs'].forEach((value) => {
    const description = value.description.replaceAll('\n', ' ')
    const pythonType = interfaceJsonTypeToPythonType.get(value.type)
    docstring += `\n    :param ${snakeCase(value.name)}: ${description}\n`
    docstring += `    :type  ${snakeCase(value.name)}: ${pythonType}\n`
  })
  interfaceJson['parameters'].forEach((value) => {
    if (value.name === "memory-io" || value.name === "version") {
      return
    }
    const pythonType = interfaceJsonTypeToPythonType.get(value.type)
    const description = value.description.replaceAll('\n', ' ')
    docstring += `\n    :param ${snakeCase(value.name)}: ${description}\n`
    docstring += `    :type  ${snakeCase(value.name)}: ${pythonType}\n`
  })
  const jsonOutputs = interfaceJson['outputs']
  jsonOutputs.forEach((value) => {
    const description = value.description.replaceAll('\n', ' ')
    const pythonType = interfaceJsonTypeToPythonType.get(value.type)
    docstring += `\n    :return: ${description}\n`
    docstring += `    :rtype:  ${pythonType}\n`
  })

  docstring += '    """'

  return docstring
}

export default functionModuleDocstring
