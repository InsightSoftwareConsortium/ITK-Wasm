import fs from 'fs-extra'

import snakeCase from '../../snake-case.js'
import canonicalType from '../../canonical-type.js'

import functionModuleImports from '../function-module-imports.js'
import functionModuleReturnType from '../function-module-return-type.js'
import functionModuleDocstring from '../function-module-docstring.js'
import functionModuleArgs from '../function-module-args.js'
import interfaceJsonTypeToInterfaceType from '../../interface-json-type-to-interface-type.js'
import interfaceJsonTypeToPythonType from '../interface-json-type-to-python-type.js'

function wasiFunctionModule(interfaceJson, pypackage, modulePath) {
  const functionName = snakeCase(interfaceJson.name)
  let moduleContent = `# Generated file. Do not edit.

from pathlib import Path, PurePosixPath
import os
from typing import Dict, Tuple, Optional, List, Any

from importlib_resources import files as file_resources

_pipeline = None

from itkwasm import (
    InterfaceTypes,
    PipelineOutput,
    PipelineInput,
    Pipeline,`

  moduleContent += functionModuleImports(interfaceJson)
  const functionArgs = functionModuleArgs(interfaceJson)
  const returnType = functionModuleReturnType(interfaceJson)
  const docstring = functionModuleDocstring(interfaceJson)

  let pipelineOutputs = ''
  interfaceJson.outputs.forEach((output) => {
    if (interfaceJsonTypeToInterfaceType.has(output.type)) {
      const interfaceType = interfaceJsonTypeToInterfaceType.get(output.type)
      switch (interfaceType) {
        case "TextFile":
        case "BinaryFile":
          pipelineOutputs += `        PipelineOutput(InterfaceTypes.${interfaceType}, ${interfaceType}(PurePosixPath(${snakeCase(output.name)}))),\n`
          break
        default:
          pipelineOutputs += `        PipelineOutput(InterfaceTypes.${interfaceType}),\n`
      }
    }
  })

  let pipelineInputs = ''
  interfaceJson['inputs'].forEach((input) => {
    if (interfaceJsonTypeToInterfaceType.has(input.type)) {
      const interfaceType = interfaceJsonTypeToInterfaceType.get(input.type)
      switch (interfaceType) {
        case "TextFile":
        case "BinaryFile":
          pipelineInputs += `        PipelineInput(InterfaceTypes.${interfaceType}, ${interfaceType}(PurePosixPath(${snakeCase(input.name)}))),\n`
          break
        case "TextStream":
        case "BinaryStream":
          pipelineInputs += `        PipelineInput(InterfaceTypes.${interfaceType}, ${interfaceType}(${snakeCase(input.name)})),\n`
          break
        default:
          pipelineInputs += `        PipelineInput(InterfaceTypes.${interfaceType}, ${snakeCase(input.name)}),\n`
      }
    }
  })

  let args = `    args: List[str] = ['--memory-io',]\n`
  let inputCount = 0
  args += "    # Inputs\n"
  interfaceJson.inputs.forEach((input) => {
    const snakeName = snakeCase(input.name)
    if (interfaceJsonTypeToInterfaceType.has(input.type)) {
      const interfaceType = interfaceJsonTypeToInterfaceType.get(input.type)
      if (interfaceType.includes('File')) {
        args += `    if not Path(${snakeName}).exists():\n`
        args += `        raise FileNotFoundError("${snakeName} does not exist")\n`
      }
      const name = interfaceType.includes('File') ? `str(PurePosixPath(${snakeName}))` : `'${inputCount.toString()}'`
      args += `    args.append(${name})\n`
      inputCount++
    } else {
      args += `    args.append(str(${snakeName}))\n`
    }
  })

  let outputCount = 0
  args += "    # Outputs\n"
  interfaceJson.outputs.forEach((output) => {
    if (interfaceJsonTypeToInterfaceType.has(output.type)) {
      const interfaceType = interfaceJsonTypeToInterfaceType.get(output.type)
      const name = interfaceType.includes('File') ?  `str(PurePosixPath(${snakeCase(output.name)}))` : `'${outputCount.toString()}'`
      args += `    args.append(${name})\n`
      outputCount++
    } else {
      const snake = snakeCase(output.name)
      args += `    args.append(str(${snake}))\n`
    }
  })

  args += "    # Options\n"
  interfaceJson.parameters.forEach((parameter) => {
    if (parameter.name === 'memory-io' || parameter.name === 'version') {
      // Internal
      return
    }
    const snake = snakeCase(parameter.name)
    if (parameter.type === "BOOL") {
      args += `    if ${snake}:\n`
      args += `        args.append('--${parameter.name}')\n`
    } else if (parameter.itemsExpectedMax > 1) {
      args += `    if len(${snake}) < ${parameter.itemsExpectedMin}:\n`
      args += `       raise ValueError('"${parameter.name}" kwarg must have a length > ${parameter.itemsExpectedMin}')\n`
      args += `    if len(${snake}) > 0:\n`
      args += `        args.append('--${parameter.name}')\n`
      args += `        for value in ${snake}:\n`
      if (interfaceJsonTypeToInterfaceType.has(parameter.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(parameter.type)
        if (interfaceType.includes('File')) {
          // for files
          args += `            input_file = str(PurePosixPath(${snakeCase(parameter.name)}))\n`
          args += `            pipeline_inputs.append(PipelineInput(InterfaceTypes.${interfaceType}, ${interfaceType}(value)))\n`
          args += `            args.append(input_file)\n`
        } else if (interfaceType.includes('Stream')) {
          // for streams
          args += `            input_count_string = str(len(pipeline_inputs))\n`
          args += `            pipeline_inputs.append(PipelineInput(InterfaceTypes.${interfaceType}, ${interfaceType}(value)))\n`
          args += `            args.append(input_count_spring)\n`
        } else {
          // Image, Mesh, PolyData, JsonObject
          args += `            input_count_string = str(len(pipeline_inputs))\n`
          args += `            pipeline_inputs.append(PipelineInput(InterfaceTypes.${interfaceType}, value))\n`
          args += `            args.append(input_count_string)\n`
        }
      } else {
        args += `            args.append(str(value))\n`
      }
    } else {
      if (interfaceJsonTypeToInterfaceType.has(parameter.type)) {
        args += `    if ${snake} is not None:\n`
        const interfaceType = interfaceJsonTypeToInterfaceType.get(parameter.type)
        if (interfaceType.includes('File')) {
          // for files
          args += `        input_file = str(PurePosixPath(${snakeCase(parameter.name)}))\n`
          args += `        pipeline_inputs.append(PipelineInput(InterfaceTypes.${interfaceType}, ${interfaceType}(${snake})))\n`
          args += `        args.append('--${parameter.name}')\n`
          args += `        args.append(input_file)\n`
        } else if (interfaceType.includes('Stream')) {
          // for streams
          args += `        input_count_string = str(len(pipeline_inputs))\n`
          args += `        pipeline_inputs.append(PipelineInput(InterfaceTypes.${interfaceType}, ${interfaceType}(${snake})))\n`
          args += `        args.append('--${parameter.name}')\n`
          args += `        args.append(input_count_string)\n`
        } else {
          // Image, Mesh, PolyData, JsonObject
          args += `        input_count_string = str(len(pipeline_inputs))\n`
          args += `        pipeline_inputs.append(PipelineInput(InterfaceTypes.${interfaceType}, ${snake}))\n`
          args += `        args.append('--${parameter.name}')\n`
          args += `        args.append(input_count_string)\n`
        }
      } else {
        args += `    if ${snake}:\n`
        args += `        args.append('--${parameter.name}')\n`
        args += `        args.append(str(${snake}))\n`
      }
    }
    args += `\n`
  })

  let postOutput = ''
  function toPythonType(type, value) {
    const canonical = canonicalType(type)
    const pythonType = interfaceJsonTypeToPythonType.get(canonical)
    switch (pythonType) {
      case "os.PathLike":
        return `Path(${value}.data.path)`
      case "str":
        if (type === 'TEXT') {
          return `${value}`
        } else {
          return `${value}.data.data`
        }
      case "bytes":
        return `${value}.data.data`
      case "int":
        return `int(${value})`
      case "bool":
        return `bool(${value})`
      case "float":
        return `float(${value})`
      case "Any":
        return `${value}.data.data`
      default:
        return `${value}.data`
    }
  }
  const jsonOutputs = interfaceJson['outputs']
  if (jsonOutputs.length > 1) {
    postOutput += '    result = (\n'
    jsonOutputs.forEach((value, index) => {
      const outputValue = `outputs[${index}]`
      postOutput += `        ${toPythonType(value.type, outputValue)},\n`
    })
    postOutput += '    )\n'
  } else {
    const outputValue = "outputs[0]"
    postOutput = `    result = ${toPythonType(jsonOutputs[0].type, outputValue)}\n`
  }
  postOutput += '    return result\n'

  moduleContent += `def ${functionName}(
${functionArgs}) -> ${returnType}:
    ${docstring}
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('${pypackage}').joinpath(Path('wasm_modules') / Path('${interfaceJson.name}.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
${pipelineOutputs}    ]

    pipeline_inputs: List[PipelineInput] = [
${pipelineInputs}    ]

${args}
    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)

${postOutput}
`
  fs.writeFileSync(modulePath, moduleContent)
}

export default wasiFunctionModule
