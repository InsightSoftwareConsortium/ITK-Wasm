import fs from 'fs-extra'

import snakeCase from '../snake-case.js'

import functionModuleImports from './function-module-imports.js'
import functionModuleArgs from './function-module-args.js'
import functionModuleDocstring from './function-module-docstring.js'
import functionModuleReturnType from './function-module-return-type.js'
import interfaceJsonTypeToInterfaceType from '../interface-json-type-to-interface-type.js'

function dispatchFunctionModule(interfaceJson, pypackage, modulePath) {
  const functionName = snakeCase(interfaceJson.name)
  let moduleContent = `# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,`

  moduleContent += functionModuleImports(interfaceJson)

  const functionArgs = functionModuleArgs(interfaceJson)
  const returnType = functionModuleReturnType(interfaceJson)
  const docstring = functionModuleDocstring(interfaceJson)

  let functionArgsToPass = ""
  interfaceJson.inputs.forEach((value) => {
    functionArgsToPass += `${snakeCase(value.name)}, `
  })
  interfaceJson.outputs.forEach((output) => {
    if (interfaceJsonTypeToInterfaceType.has(output.type)) {
      const interfaceType = interfaceJsonTypeToInterfaceType.get(output.type)
      switch (interfaceType) {
        case "TextFile":
        case "BinaryFile":
          functionArgsToPass += `${snakeCase(output.name)}, `
          break
        default:
          //
      }
    }
  })
  interfaceJson['parameters'].forEach((value) => {
    if (value.name === "memory-io" || value.name === "version") {
      return
    }
    functionArgsToPass += `${snakeCase(value.name)}=${snakeCase(value.name)}, `
  })
  functionArgsToPass = functionArgsToPass.substring(0, functionArgsToPass.length - 2)

  const syncModuleContent = `${moduleContent}def ${functionName}(
${functionArgs}) -> ${returnType}:
    ${docstring}
    func = environment_dispatch("${pypackage}", "${functionName}")
    output = func(${functionArgsToPass})
    return output
`
  fs.writeFileSync(modulePath, syncModuleContent)

  const asyncModuleContent = `${moduleContent}async def ${functionName}_async(
${functionArgs}) -> ${returnType}:
    ${docstring}
    func = environment_dispatch("${pypackage}", "${functionName}_async")
    output = await func(${functionArgsToPass})
    return output
`
  fs.writeFileSync(modulePath.replace('.py', '_async.py'), asyncModuleContent)
}

export default dispatchFunctionModule
