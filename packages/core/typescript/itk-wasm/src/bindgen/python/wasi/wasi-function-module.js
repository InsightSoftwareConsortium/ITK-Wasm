import fs from 'fs-extra'

import snakeCase from '../../snake-case.js'
import canonicalType from '../../canonical-type.js'

import functionModuleImports from '../function-module-imports.js'
import functionModuleReturnType from '../function-module-return-type.js'
import functionModuleDocstring from '../function-module-docstring.js'
import functionModuleArgs from '../function-module-args.js'
import interfaceJsonTypeToInterfaceType from '../../interface-json-type-to-interface-type.js'
import interfaceJsonTypeToPythonType from '../interface-json-type-to-python-type.js'
import writeIfOverrideNotPresent from '../../write-if-override-not-present.js'

function wasiFunctionModule(interfaceJson, pypackage, modulePath) {
  const functionName = snakeCase(interfaceJson.name)
  let moduleContent = `from pathlib import Path, PurePosixPath
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

  let pipelineOutputFilePrep = ''
  interfaceJson.outputs.forEach((output) => {
    if (interfaceJsonTypeToInterfaceType.has(output.type)) {
      const interfaceType = interfaceJsonTypeToInterfaceType.get(output.type)
      const isArray = output.itemsExpectedMax > 1
      if (interfaceType.includes('File')) {
        const snake = snakeCase(output.name)
        if (isArray) {
          pipelineOutputFilePrep += `    ${snake}_pipeline_outputs = [PipelineOutput(InterfaceTypes.${interfaceType}, ${interfaceType}(PurePosixPath(p))) for p in ${snake}]\n`
        }
      }
    }
  })

  let pipelineOutputs = ''
  let haveArray = false
  interfaceJson.outputs.forEach((output) => {
    if (interfaceJsonTypeToInterfaceType.has(output.type)) {
      const interfaceType = interfaceJsonTypeToInterfaceType.get(output.type)
      const isArray = output.itemsExpectedMax > 1
      switch (interfaceType) {
        case 'TextFile':
        case 'BinaryFile':
          if (isArray) {
            haveArray = true
            pipelineOutputs += `        *${snakeCase(output.name)}_pipeline_outputs,\n`
          } else {
            pipelineOutputs += `        PipelineOutput(InterfaceTypes.${interfaceType}, ${interfaceType}(PurePosixPath(${snakeCase(output.name)}))),\n`
          }
          break
        default:
          pipelineOutputs += `        PipelineOutput(InterfaceTypes.${interfaceType}),\n`
      }
    }
  })
  let pipelineOutputIndices = ''
  if (haveArray) {
    pipelineOutputIndices += `    output_index = 0\n`
    interfaceJson.outputs.forEach((output) => {
      if (interfaceJsonTypeToInterfaceType.has(output.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(output.type)
        if (interfaceType.includes('File')) {
          const snake = snakeCase(output.name)
          const isArray = output.itemsExpectedMax > 1
          if (isArray) {
            pipelineOutputIndices += `    ${snake}_start = output_index\n`
            pipelineOutputIndices += `    output_index += len(${snake})\n`
            pipelineOutputIndices += `    ${snake}_end = output_index\n`
          } else {
            pipelineOutputIndices += `    ${snake}_index = output_index\n`
            pipelineOutputIndices += `    output_index += 1\n`
          }
        } else if (!interfaceType.includes('File')) {
          pipelineOutputIndices += `    ${snake}_index = output_index\n`
          pipelineOutputIndices += `    output_index += 1\n`
        }
      }
    })
  }

  let pipelineInputs = ''
  interfaceJson['inputs'].forEach((input) => {
    if (interfaceJsonTypeToInterfaceType.has(input.type)) {
      const interfaceType = interfaceJsonTypeToInterfaceType.get(input.type)
      switch (interfaceType) {
        case 'TextFile':
        case 'BinaryFile':
          pipelineInputs += `        PipelineInput(InterfaceTypes.${interfaceType}, ${interfaceType}(PurePosixPath(${snakeCase(input.name)}))),\n`
          break
        case 'TextStream':
        case 'BinaryStream':
          pipelineInputs += `        PipelineInput(InterfaceTypes.${interfaceType}, ${interfaceType}(${snakeCase(input.name)})),\n`
          break
        default:
          pipelineInputs += `        PipelineInput(InterfaceTypes.${interfaceType}, ${snakeCase(input.name)}),\n`
      }
    }
  })

  let args = `    args: List[str] = ['--memory-io',]\n`
  let inputCount = 0
  args += '    # Inputs\n'
  interfaceJson.inputs.forEach((input) => {
    const snakeName = snakeCase(input.name)
    if (interfaceJsonTypeToInterfaceType.has(input.type)) {
      const interfaceType = interfaceJsonTypeToInterfaceType.get(input.type)
      if (interfaceType.includes('File')) {
        args += `    if not Path(${snakeName}).exists():\n`
        args += `        raise FileNotFoundError("${snakeName} does not exist")\n`
      }
      const name = interfaceType.includes('File')
        ? `str(PurePosixPath(${snakeName}))`
        : `'${inputCount.toString()}'`
      args += `    args.append(${name})\n`
      inputCount++
    } else {
      args += `    args.append(str(${snakeName}))\n`
    }
  })

  let outputCount = 0
  args += '    # Outputs\n'
  interfaceJson.outputs.forEach((output) => {
    const snake = snakeCase(output.name)
    if (interfaceJsonTypeToInterfaceType.has(output.type)) {
      const interfaceType = interfaceJsonTypeToInterfaceType.get(output.type)
      const isArray = output.itemsExpectedMax > 1
      let name = `    ${snake}_name = '${outputCount.toString()}'\n`
      if (interfaceType.includes('File')) {
        if (isArray) {
          name = ''
        } else {
          name = `    ${snake}_name = str(PurePosixPath(${snake}))\n`
        }
      }
      args += name
      if (isArray) {
        args += `    args.extend([str(PurePosixPath(p)) for p in ${snake}])\n`
      } else {
        args += `    args.append(${snake}_name)\n`
      }
      args += '\n'
      outputCount++
    } else {
      args += `    args.append(str(${snake}))\n`
    }
  })

  args += '    # Options\n'
  args += `    input_count = len(pipeline_inputs)\n`
  interfaceJson.parameters.forEach((parameter) => {
    if (parameter.name === 'memory-io' || parameter.name === 'version') {
      // Internal
      return
    }
    const snake = snakeCase(parameter.name)
    if (parameter.type === 'BOOL') {
      args += `    if ${snake}:\n`
      args += `        args.append('--${parameter.name}')\n`
    } else if (parameter.itemsExpectedMax > 1) {
      const notNone = parameter.required ? '' : `${snake} is not None and `
      args += `    if ${notNone}len(${snake}) < ${parameter.itemsExpectedMin}:\n`
      args += `       raise ValueError('"${parameter.name}" kwarg must have a length > ${parameter.itemsExpectedMin}')\n`
      args += `    if ${notNone}len(${snake}) > 0:\n`
      args += `        args.append('--${parameter.name}')\n`
      args += `        for value in ${snake}:\n`
      if (interfaceJsonTypeToInterfaceType.has(parameter.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(
          parameter.type
        )
        if (interfaceType.includes('File')) {
          // for files
          args += `            input_file = str(PurePosixPath(value))\n`
          args += `            pipeline_inputs.append(PipelineInput(InterfaceTypes.${interfaceType}, ${interfaceType}(value)))\n`
          args += `            args.append(input_file)\n`
        } else if (interfaceType.includes('Stream')) {
          // for streams
          args += `            pipeline_inputs.append(PipelineInput(InterfaceTypes.${interfaceType}, ${interfaceType}(value)))\n`
          args += `            args.append(str(input_count))\n`
          args += `            input_count += 1\n`
        } else {
          // Image, Mesh, PolyData, JsonCompatible
          args += `            pipeline_inputs.append(PipelineInput(InterfaceTypes.${interfaceType}, value))\n`
          args += `            args.append(str(input_count))\n`
          args += `            input_count += 1\n`
        }
      } else {
        if (parameter.type.startsWith('TEXT:{')) {
          const choices = parameter.type.split('{')[1].split('}')[0].split(',')
          args += `                if ${snake} not in (${choices.map((c) => `'${c}'`).join(', ')}):\n`
          args += `                    raise ValueError(f'${snake} must be one of ${choices.join(', ')}')\n`
        }
        args += `            args.append(str(value))\n`
      }
    } else {
      if (interfaceJsonTypeToInterfaceType.has(parameter.type)) {
        args += `    if ${snake} is not None:\n`
        const interfaceType = interfaceJsonTypeToInterfaceType.get(
          parameter.type
        )
        if (interfaceType.includes('File')) {
          // for files
          args += `        input_file = str(PurePosixPath(${snakeCase(parameter.name)}))\n`
          args += `        pipeline_inputs.append(PipelineInput(InterfaceTypes.${interfaceType}, ${interfaceType}(${snake})))\n`
          args += `        args.append('--${parameter.name}')\n`
          args += `        args.append(input_file)\n`
        } else if (interfaceType.includes('Stream')) {
          // for streams
          args += `        pipeline_inputs.append(PipelineInput(InterfaceTypes.${interfaceType}, ${interfaceType}(${snake})))\n`
          args += `        args.append('--${parameter.name}')\n`
          args += `        args.append(str(input_count))\n`
          args += `        input_count += 1\n`
        } else {
          // Image, Mesh, PolyData, JsonCompatible
          args += `        pipeline_inputs.append(PipelineInput(InterfaceTypes.${interfaceType}, ${snake}))\n`
          args += `        args.append('--${parameter.name}')\n`
          args += `        args.append(str(input_count))\n`
          args += `        input_count += 1\n`
        }
      } else {
        args += `    if ${snake}:\n`
        if (parameter.type.startsWith('TEXT:{')) {
          const choices = parameter.type.split('{')[1].split('}')[0].split(', ')
          args += `        if ${snake} not in (${choices.map((c) => `'${c}'`).join(',')}):\n`
          args += `            raise ValueError(f'${snake} must be one of ${choices.join(', ')}')\n`
        }
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
      case 'os.PathLike':
        return `Path(${value}.data.path)`
      case 'str':
        if (type === 'TEXT') {
          return `${value}`
        } else {
          return `${value}.data.data`
        }
      case 'bytes':
        return `${value}.data.data`
      case 'int':
        return `int(${value})`
      case 'bool':
        return `bool(${value})`
      case 'float':
        return `float(${value})`
      case 'Any':
        return `${value}.data`
      default:
        return `${value}.data`
    }
  }
  outputCount = 0
  const jsonOutputs = interfaceJson['outputs']
  const numOutputs = interfaceJson.outputs.filter(
    (o) => !o.type.includes('FILE')
  ).length
  if (numOutputs > 1) {
    postOutput += '    result = (\n'
  } else if (numOutputs === 1) {
    postOutput = '    result = '
  }

  if (numOutputs > 0) {
    // const outputValue = "outputs[0]"
    // postOutput = `    result = ${toPythonType(jsonOutputs[0].type, outputValue)}\n`
    const indent = numOutputs > 1 ? '        ' : ''
    const comma = numOutputs > 1 ? ',' : ''
    jsonOutputs.forEach((value) => {
      if (value.type.includes('FILE')) {
        outputCount++
        return
      }
      const snake = snakeCase(value.name)
      const outputIndex = haveArray ? `${snake}_index` : outputCount.toString()
      if (haveArray) {
        const isArray = value.itemsExpectedMax > 1
        if (isArray) {
          const outputValue = `outputs[${snake}_start:${snake}_end]`
          postOutput += `${indent}*[${toPythonType(value.type, 'v')} for v in ${outputValue}]${comma}\n`
        } else {
          const outputValue = `outputs[${snake}_index]`
          postOutput += `${indent}${toPythonType(value.type, outputValue)}${comma}\n`
        }
      } else {
        const outputValue = `outputs[${outputIndex}]`
        postOutput += `${indent}${toPythonType(value.type, outputValue)}${comma}\n`
      }
      outputCount++
    })
  }
  if (numOutputs > 1) {
    postOutput += '    )\n'
  }
  if (numOutputs > 0) {
    postOutput += '    return result\n'
  }

  moduleContent += `def ${functionName}(
${functionArgs}) -> ${returnType}:
    ${docstring}
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('${pypackage}').joinpath(Path('wasm_modules') / Path('${interfaceJson.name}.wasi.wasm')))
${pipelineOutputFilePrep}
    pipeline_outputs: List[PipelineOutput] = [
${pipelineOutputs}    ]
${pipelineOutputIndices}
    pipeline_inputs: List[PipelineInput] = [
${pipelineInputs}    ]

${args}
    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)

${postOutput}
`
  writeIfOverrideNotPresent(modulePath, moduleContent, '#')
}

export default wasiFunctionModule
