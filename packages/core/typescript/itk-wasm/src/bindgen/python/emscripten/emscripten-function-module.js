import fs from 'fs-extra'

import camelCase from '../../camel-case.js'
import snakeCase from '../../snake-case.js'

import functionModuleImports from '../function-module-imports.js'
import functionModuleArgs from '../function-module-args.js'
import functionModuleReturnType from '../function-module-return-type.js'
import functionModuleDocstring from '../function-module-docstring.js'
import interfaceJsonTypeToInterfaceType from '../../interface-json-type-to-interface-type.js'
import writeIfOverrideNotPresent from '../../write-if-override-not-present.js'

function emscriptenFunctionModule(interfaceJson, pypackage, modulePath) {
  const functionName = snakeCase(interfaceJson.name)
  let moduleContent = `from pathlib import Path
import os
from typing import Dict, Tuple, Optional, List, Any

from .js_package import js_package

from itkwasm.pyodide import (
    to_js,
    to_py,
    js_resources
)
from itkwasm import (
    InterfaceTypes,`

  moduleContent += functionModuleImports(interfaceJson)
  const functionArgs = functionModuleArgs(interfaceJson)
  const returnType = functionModuleReturnType(interfaceJson)
  const docstring = functionModuleDocstring(interfaceJson)

  let args = ''
  interfaceJson.inputs.forEach((input) => {
    if (interfaceJsonTypeToInterfaceType.has(input.type)) {
      const interfaceType = interfaceJsonTypeToInterfaceType.get(input.type)
      switch (interfaceType) {
        case "TextFile":
        case "BinaryFile":
          args += `to_js(${interfaceType}(${snakeCase(input.name)})), `
          break
        default:
          args += `to_js(${snakeCase(input.name)}), `
      }
    } else {
      args += `to_js(${snakeCase(input.name)}), `
    }
  })
  interfaceJson.outputs.forEach((output) => {
    if (interfaceJsonTypeToInterfaceType.has(output.type)) {
      const interfaceType = interfaceJsonTypeToInterfaceType.get(output.type)
      switch (interfaceType) {
        case "TextFile":
        case "BinaryFile":
          args += `to_js(${snakeCase(output.name)}), `
          break
        default:
          //
      }
    }
  })

  let addKwargs = ''
  interfaceJson.parameters.forEach((parameter) => {
    if (parameter.name === 'memory-io' || parameter.name === 'version') {
      // Internal
      return
    }
    if (interfaceJsonTypeToInterfaceType.has(parameter.type)) {
      addKwargs += `    if ${snakeCase(parameter.name)} is not None:\n`
      const interfaceType = interfaceJsonTypeToInterfaceType.get(parameter.type)
      switch (interfaceType) {
        case "TextFile":
        case "BinaryFile":
          addKwargs += `        kwargs["${camelCase(parameter.name)}"] = to_js(${interfaceType}(${snakeCase(parameter.name)}))\n`
          break
        default:
          addKwargs += `        kwargs["${camelCase(parameter.name)}"] = to_js(${snakeCase(parameter.name)})\n`
      }
    } else {
      addKwargs += `    if ${snakeCase(parameter.name)}:\n`
      addKwargs += `        kwargs["${camelCase(parameter.name)}"] = to_js(${snakeCase(parameter.name)})\n`
    }
  })

  const jsFunction = camelCase(interfaceJson.name)

  moduleContent += `async def ${functionName}_async(
${functionArgs}) -> ${returnType}:
    ${docstring}
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
${addKwargs}
    outputs = await js_module.${jsFunction}(${args}webWorker=web_worker, noCopy=True, **kwargs)

    output_web_worker = None
    output_list = []
    outputs_object_map = outputs.as_object_map()
    for output_name in outputs.object_keys():
        if output_name == 'webWorker':
            output_web_worker = outputs_object_map[output_name]
        else:
            output_list.append(to_py(outputs_object_map[output_name]))

    js_resources.web_worker = output_web_worker

    if len(output_list) == 1:
        return output_list[0]
    return tuple(output_list)
`
  writeIfOverrideNotPresent(modulePath, moduleContent, '#')
}

export default emscriptenFunctionModule
