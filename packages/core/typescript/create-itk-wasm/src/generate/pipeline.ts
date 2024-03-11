import fs from 'fs'
import path from 'path'

import chalk from 'chalk'
import * as emoji from 'node-emoji'

import ProjectSpec from '../project-spec.js'
import PipelineSpec from '../pipeline-spec.js'
import OptionSpec from '../option-spec.js'
import Dispatch from '../dispatch.js'
import die from '../die.js'
import camelCase from '../camel-case.js'

function findDispatchInput(pipeline: PipelineSpec): OptionSpec {
  return pipeline.inputs.find(
    (input) => (input.type as unknown as Dispatch) === pipeline.dispatch
  )
}

function pipelineFunction(
  pipeline: PipelineSpec,
  usedInterfaceTypes: Set<string>
): string {
  if (pipeline.dispatch === 'None') {
    return ''
  }
  const dispatch = pipeline.dispatch
  const dispatchInput = findDispatchInput(pipeline)
  const camelDispatchInput = camelCase(dispatchInput.name)

  let dimensionTrait = 'Dimension'
  if (dispatch === 'Image') {
    dimensionTrait = 'ImageDimension'
  } else if (dispatch === 'Mesh' || dispatch === 'PolyData') {
    dimensionTrait = 'PointDimension'
  }
  let pixelTypeTrait = 'PixelType'
  const indent = '  '
  const needsImageType = usedInterfaceTypes.has('Image') && dispatch !== 'Image'
  const needsMeshType = usedInterfaceTypes.has('Mesh') && dispatch !== 'Mesh'
  const needsPolyDataType =
    usedInterfaceTypes.has('PolyData') && dispatch !== 'PolyData'
  const defaultImageType = needsImageType
    ? `${indent}using ImageType = itk::Image<PixelType, Dimension>;\n`
    : ''
  const defaultMeshType = needsMeshType
    ? `${indent}using MeshType = itk::Mesh<PixelType, Dimension>;\n`
    : ''
  const defaultPolyDataType = needsPolyDataType
    ? `${indent}using PolyDataType = itk::PolyData<PixelType>;\n`
    : ''

  const firstTypeSizeName = optionTypeSizeName(
    dispatchInput.type,
    'input',
    dispatchInput.itemsExpectedMin,
    dispatchInput.itemsExpectedMax
  )
  let result = ''
  result += `template <typename T${dispatch}>
int ${camelCase(pipeline.name)}(itk::wasm::Pipeline &pipeline, const T${dispatch} *${camelDispatchInput})
{
  using ${dispatch}Type = T${dispatch};
  constexpr unsigned int Dimension = ${dispatch}Type::${dimensionTrait};
  using PixelType = typename ${dispatch}Type::${pixelTypeTrait};${defaultImageType}${defaultMeshType}${defaultPolyDataType}

  pipeline.get_option("${dispatchInput.name}")->required()${firstTypeSizeName};

`

  pipeline.inputs.forEach((input) => {
    if (input === dispatchInput) {
      return
    }
    result += optionCxx(indent, 'input', input, false)
  })
  pipeline.parameters.forEach((parameter) => {
    result += optionCxx(indent, 'parameter', parameter, false)
  })
  pipeline.outputs.forEach((output) => {
    result += optionCxx(indent, 'output', output, false)
  })

  result += `  ITK_WASM_PARSE(pipeline);

  // Pipeline code goes here

  return EXIT_SUCCESS;
}

`

  return result
}

function pipelineFunctor(pipeline: PipelineSpec): string {
  if (pipeline.dispatch === 'None') {
    return ''
  }
  const dispatch = pipeline.dispatch
  const dispatchInput = findDispatchInput(pipeline)
  const camelDispatchInput = camelCase(dispatchInput.name)

  let result = `template <typename T${dispatch}>
class PipelineFunctor
{
public:
  int operator()(itk::wasm::Pipeline &pipeline)
  {
    using ${dispatch}Type = T${dispatch};

`

  result += optionCxx('    ', 'input', dispatchInput, true)

  result += `    ITK_WASM_PRE_PARSE(pipeline);

    typename ${dispatch}Type::ConstPointer ${camelDispatchInput}Ref = ${camelDispatchInput}.Get();
    return ${camelCase(pipeline.name)}<${dispatch}Type>(pipeline, ${camelDispatchInput}Ref);
  }
};

`
  return result
}

function pipelineMain(
  pipeline: PipelineSpec,
  usedInterfaceTypes: Set<string>
): string {
  let result = `int main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("${pipeline.name}", "${pipeline.description}", argc, argv);
`

  if (pipeline.dispatch === 'None') {
    const needsDimension =
      usedInterfaceTypes.has('Image') ||
      (usedInterfaceTypes.has('Mesh') && pipeline.dispatch === 'None')
    const needsPixelType =
      usedInterfaceTypes.has('Image') ||
      usedInterfaceTypes.has('Mesh') ||
      (usedInterfaceTypes.has('PolyData') && pipeline.dispatch === 'None')
    const needsImageType =
      usedInterfaceTypes.has('Image') && pipeline.dispatch === 'None'
    const needsMeshType =
      usedInterfaceTypes.has('Mesh') && pipeline.dispatch === 'None'
    const needsPolyDataType =
      usedInterfaceTypes.has('PolyData') && pipeline.dispatch === 'None'

    const indent = '  '

    const defaultDimension = needsDimension
      ? `${indent}constexpr unsigned int Dimension = 3;\n`
      : ''
    const defaultPixelType = needsPixelType
      ? `${indent}using PixelType = float;\n`
      : ''
    const defaultImageType = needsImageType
      ? `${indent}using ImageType = itk::Image<PixelType, Dimension>;\n`
      : ''
    const defaultMeshType = needsMeshType
      ? `${indent}using MeshType = itk::Mesh<PixelType, Dimension>;\n`
      : ''
    const defaultPolyDataType = needsPolyDataType
      ? `${indent}using PolyDataType = itk::PolyData<PixelType>;\n`
      : ''
    result += `${defaultDimension}${defaultPixelType}${defaultImageType}${defaultMeshType}${defaultPolyDataType}
`
    pipeline.inputs.forEach((input) => {
      result += optionCxx(indent, 'input', input, false)
    })
    pipeline.parameters.forEach((parameter) => {
      result += optionCxx(indent, 'parameter', parameter, false)
    })
    pipeline.outputs.forEach((output) => {
      result += optionCxx(indent, 'output', output, false)
    })

    result += `  ITK_WASM_PARSE(pipeline);

  // Pipeline code goes here

  return EXIT_SUCCESS;
}
  `
  } else {
    const dispatchInput = findDispatchInput(pipeline)
    const dimensionString = pipeline.dispatchDimensions
      .map((dimension) => {
        return `${dimension}U`
      })
      .join(', ')
    const dispatchArgs =
      pipeline.dispatch === 'PolyData'
        ? `>::PixelTypes<${pipeline.dispatchPixels.join(', ')}>`
        : `,\n    ${pipeline.dispatchPixels.join(', ')}>\n    ::Dimensions<${dimensionString}>`
    result += `
  return itk::wasm::SupportInput${pipeline.dispatch}Types<PipelineFunctor${dispatchArgs}("${dispatchInput.name}", pipeline);
}
`
  }

  return result
}

function pipelineFunctions(pipeline: PipelineSpec): string {
  let result = ''

  const usedInterfaceTypes = new Set<string>()
  pipeline.inputs.forEach((input) => {
    usedInterfaceTypes.add(input.type)
  })
  pipeline.outputs.forEach((output) => {
    usedInterfaceTypes.add(output.type)
  })
  pipeline.parameters.forEach((parameter) => {
    usedInterfaceTypes.add(parameter.type)
  })

  result += pipelineFunction(pipeline, usedInterfaceTypes)
  result += pipelineFunctor(pipeline)
  result += pipelineMain(pipeline, usedInterfaceTypes)

  return result
}

function cxxType(optionKind: string, optionType: string): string {
  switch (optionKind) {
    case 'input':
    case 'parameter':
      switch (optionType) {
        case 'Image':
          return 'itk::wasm::InputImage<ImageType>'
        case 'Mesh':
          return 'itk::wasm::InputMesh<MeshType>'
        case 'PolyData':
          return 'itk::wasm::InputPolyData<PolyDataType>'
        case 'BinaryStream':
          return 'itk::wasm::InputBinaryStream'
        case 'TextStream':
          return 'itk::wasm::InputTextStream'
        case 'BinaryFile':
          return 'std::string'
        case 'TextFile':
          return 'std::string'
        case 'JsonCompatible':
          return 'itk::wasm::InputTextStream'
        case 'string':
          return 'std::string'
        case 'double':
          return 'double'
        case 'float':
          return 'float'
        case 'bool':
          return 'bool'
        case 'int32':
          return 'int32_t'
        case 'uint32':
          return 'uint32_t'
        case 'int64':
          return 'int64_t'
        case 'uint64':
          return 'uint64_t'
        default:
          throw new Error(`Unknown option type: ${optionType}`)
      }
      break
    case 'output':
      switch (optionType) {
        case 'Image':
          return 'itk::wasm::OutputImage<ImageType>'
        case 'Mesh':
          return 'itk::wasm::OutputMesh<MeshType>'
        case 'PolyData':
          return 'itk::wasm::OutputPolyData<PolyDataType>'
        case 'BinaryStream':
          return 'itk::wasm::OutputBinaryStream'
        case 'TextStream':
          return 'itk::wasm::OutputTextStream'
        case 'BinaryFile':
          return 'std::string'
        case 'TextFile':
          return 'std::string'
        case 'JsonCompatible':
          return 'itk::wasm::OutputTextStream'
        case 'string':
          return 'std::string'
        case 'double':
          return 'double'
        case 'float':
          return 'float'
        case 'bool':
          return 'bool'
        case 'int32':
          return 'int32_t'
        case 'uint32':
          return 'uint32_t'
        case 'int64':
          return 'int64_t'
        case 'uint64':
          return 'uint64_t'
        default:
          throw new Error(`Unknown option type: ${optionType}`)
      }
      break
    default:
      throw new Error(`Unknown option kind: ${optionKind}`)
  }
}

function optionTypeSizeName(
  optionType: string,
  optionKind: string,
  itemsExpectedMin: number,
  itemsExpectedMax: number
): string {
  let result = ''
  const isScalar = itemsExpectedMin === 1 && itemsExpectedMax === 1

  if (!isScalar) {
    if (itemsExpectedMin === itemsExpectedMax) {
      result += `->type_size(${itemsExpectedMin})`
    } else {
      result += `->type_size(${itemsExpectedMin}, ${itemsExpectedMax})`
    }
  }

  const typeNamePrefix = optionKind === 'output' ? 'OUTPUT_' : 'INPUT_'
  switch (optionType) {
    case 'Image':
      result += `->type_name("${typeNamePrefix}IMAGE")`
      break
    case 'Mesh':
      result += `->type_name("${typeNamePrefix}MESH")`
      break
    case 'PolyData':
      result += `->type_name("${typeNamePrefix}POLYDATA")`
      break
    case 'BinaryStream':
      result += `->type_name("${typeNamePrefix}BINARY_STREAM")`
      break
    case 'TextStream':
      result += `->type_name("${typeNamePrefix}TEXT_STREAM")`
      break
    case 'BinaryStream':
      result += `->type_name("${typeNamePrefix}BINARY_FILE")`
      break
    case 'TextStream':
      result += `->type_name("${typeNamePrefix}TEXT_FILE")`
      break
    case 'JsonCompatible':
      result += `->type_name("${typeNamePrefix}JSON")`
      break
    case 'BinaryFile':
      result += `->type_name("${typeNamePrefix}BINARY_FILE")`
      break
    case 'TextFile':
      result += `->type_name("${typeNamePrefix}TEXT_FILE")`
      break
  }

  return result
}

function optionCxx(
  indent: string,
  optionKind: string,
  option: OptionSpec,
  noRequired: boolean
): string {
  let result = indent
  const isScalar =
    option.itemsExpectedMin === 1 && option.itemsExpectedMax === 1
  if (!isScalar) {
    result += `std::vector<`
  }
  result += cxxType(optionKind, option.type)
  if (!isScalar) {
    result += `>`
  }
  result += ` ${camelCase(option.name)}`
  if (option.type === 'bool') {
    result += ` = false`
  } else if (option.defaultValue) {
    if (option.defaultValue.includes(',')) {
      result += ` = {${option.defaultValue}}`
    } else {
      result += ` = ${option.defaultValue}`
    }
  }
  result += `;\n`

  const flags = optionKind === 'parameter' ? '--' : ''
  const addOption = option.type === 'bool' ? 'add_flag' : 'add_option'
  result += `${indent}pipeline.${addOption}("${flags}${option.name}", ${camelCase(option.name)}, "${option.description}")`
  if (!noRequired) {
    if (option.required || optionKind === 'input' || optionKind === 'output') {
      result += '->required()'
    }
  }

  result += optionTypeSizeName(
    option.type,
    optionKind,
    option.itemsExpectedMin,
    option.itemsExpectedMax
  )

  result += `;\n\n`

  return result
}

function generatePipeline(
  project: ProjectSpec,
  pipeline: PipelineSpec,
  verbose: boolean = false
) {
  if (verbose) {
    console.log(
      chalk.cyan(
        `    ${emoji.random().emoji}  Generating pipeline ${pipeline.name}...`
      )
    )
  }

  if (
    pipeline.inputs.length === 0 &&
    pipeline.outputs.length === 0 &&
    pipeline.parameters.length === 0
  ) {
    die(
      `Pipeline ${pipeline.name} must have at least one input, parameter, or output.`
    )
  }

  const cmakelistsPath = path.join(project.directory, 'CMakeLists.txt')
  const content = fs.readFileSync(cmakelistsPath, 'utf8')
  const pipelineDelimiter = '# End create-itk-wasm added pipelines.\n'
  if (!content.includes(pipelineDelimiter)) {
    die(
      `CMakeLists.txt does not contain the pipeline content delimiter: ${pipelineDelimiter}`
    )
  }

  const pipelinePath = path.join(project.directory, pipeline.name)
  fs.mkdirSync(pipelinePath, { recursive: true })

  const pipelineCmakelistsPath = path.join(pipelinePath, 'CMakeLists.txt')
  const pipelineContent = `add_executable(${pipeline.name} ${pipeline.name}.cxx)
target_link_libraries(${pipeline.name} PUBLIC \${ITK_LIBRARIES})

add_test(NAME ${pipeline.name}-help COMMAND ${pipeline.name} --help)
`
  fs.writeFileSync(pipelineCmakelistsPath, pipelineContent)

  const pipelineCxxPath = path.join(pipelinePath, `${pipeline.name}.cxx`)
  let pipelineCxxContent = `/*=========================================================================

 *  Copyright NumFOCUS
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         https://www.apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *=========================================================================*/

#include "itkPipeline.h"
`

  const inputIncludes = new Set()
  pipeline.inputs.concat(pipeline.parameters).forEach((input) => {
    switch (input.type) {
      case 'Image':
        inputIncludes.add('#include "itkInputImage.h"')
        break
      case 'Mesh':
        inputIncludes.add('#include "itkInputMesh.h"')
        break
      case 'PolyData':
        inputIncludes.add('#include "itkInputPolyData.h"')
        break
      case 'BinaryStream':
        inputIncludes.add('#include "itkInputBinaryStream.h"')
        break
      case 'TextStream':
        inputIncludes.add('#include "itkInputTextStream.h"')
        break
      case 'JsonCompatible':
        inputIncludes.add('#include "itkInputTextStream.h"')
        break
      default:
      // no include needed
    }
  })
  for (const include of inputIncludes) {
    pipelineCxxContent += `${include}\n`
  }

  const outputIncludes = new Set()
  pipeline.outputs.forEach((output) => {
    switch (output.type) {
      case 'Image':
        outputIncludes.add('#include "itkOutputImage.h"')
        break
      case 'Mesh':
        outputIncludes.add('#include "itkOutputMesh.h"')
        break
      case 'PolyData':
        outputIncludes.add('#include "itkOutputPolyData.h"')
        break
      case 'BinaryStream':
        outputIncludes.add('#include "itkOutputBinaryStream.h"')
        break
      case 'TextStream':
        outputIncludes.add('#include "itkOutputTextStream.h"')
        break
      case 'JsonCompatible':
        outputIncludes.add('#include "itkOutputTextStream.h"')
        break
      default:
        die(
          'Use JsonCompatible for output types other than Image, Mesh, PolyData, BinaryStream, and TextStream'
        )
    }
  })
  for (const include of outputIncludes) {
    pipelineCxxContent += `${include}\n`
  }

  switch (pipeline.dispatch) {
    case 'None':
      break
    case 'Image':
      pipelineCxxContent += `#include "itkSupportInputImageTypes.h"\n`
      break
    case 'Mesh':
      pipelineCxxContent += `#include "itkSupportInputMeshTypes.h"\n`
      break
    case 'PolyData':
      pipelineCxxContent += `#include "itkSupportInputPolyDataTypes.h"\n`
      break
    default:
      die(`Unknown dispatch: ${pipeline.dispatch}`)
  }
  pipelineCxxContent += '\n'

  pipelineCxxContent += pipelineFunctions(pipeline)
  fs.writeFileSync(pipelineCxxPath, pipelineCxxContent)

  const contentSplit = content.split(pipelineDelimiter, 2)
  const newContent = `${contentSplit[0]}add_subdirectory(${pipeline.name})
${pipelineDelimiter}${contentSplit[1]}`
  fs.writeFileSync(cmakelistsPath, newContent)
}

export default generatePipeline
