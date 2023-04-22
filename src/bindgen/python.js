import fs from 'fs-extra'
import path from 'path'

import wasmBinaryInterfaceJson from './wasmBinaryInterfaceJson.js'
import interfaceJsonTypeToInterfaceType from './interfaceJsonTypeToInterfaceType.js'
import camelCase from './camelCase.js'
import snakeCase from './snakeCase.js'

const interfaceJsonTypeToPythonType = new Map([
  ['INPUT_TEXT_FILE:FILE', 'os.PathLike'],
  ['OUTPUT_TEXT_FILE:FILE', 'os.PathLike'],
  ['INPUT_BINARY_FILE:FILE', 'os.PathLike'],
  ['OUTPUT_BINARY_FILE:FILE', 'os.PathLike'],
  ['INPUT_TEXT_STREAM', 'str'],
  ['OUTPUT_TEXT_STREAM', 'str'],
  ['INPUT_BINARY_STREAM', 'bytes'],
  ['OUTPUT_BINARY_STREAM', 'bytes'],
  ['INPUT_IMAGE', 'Image'],
  ['OUTPUT_IMAGE', 'Image'],
  ['INPUT_MESH', 'Mesh'],
  ['OUTPUT_MESH', 'Mesh'],
  ['INPUT_POLYDATA', 'PolyData'],
  ['OUTPUT_POLYDATA', 'PolyData'],
  ['BOOL', 'bool'],
  ['TEXT', 'str'],
  ['INT', 'int'],
  ['FLOAT', 'float'],
  ['OUTPUT_JSON', 'Dict'],
])

function bindgenResource(filePath) {
  return path.join(path.dirname(import.meta.url.substring(7)), 'python-resources', filePath)
}

function mkdirP(dir) {
  try {
    fs.mkdirSync(dir, { recursive: true })
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

function wasiPackageReadme(packageName, packageDescription, packageDir) {
  let readme = ''
  readme += `# ${packageName}\n`
  readme += `\n[![PyPI version](https://badge.fury.io/py/${packageName}.svg)](https://badge.fury.io/py/${packageName})\n`
  readme += `\n${packageDescription}\n`

  const dispatchPackage = packageName.replace(/-wasi$/, '')
  readme += `\nThis package provides the WASI WebAssembly implementation. It is usually not called directly. Please use the [\`${dispatchPackage}\`](https://pypi.org/project/${dispatchPackage}/) instead.\n\n`
  readme += `\n## Installation\n
\`\`\`sh
pip install ${packageName}
\`\`\`
`
  const readmePath = path.join(packageDir, 'README.md')
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, readme)
  }
}

function emscriptenPackageReadme(packageName, packageDescription, packageDir) {
  let readme = ''
  readme += `# ${packageName}\n`
  readme += `\n[![PyPI version](https://badge.fury.io/py/${packageName}.svg)](https://badge.fury.io/py/${packageName})\n`
  readme += `\n${packageDescription}\n`

  const dispatchPackage = packageName.replace(/-emscripten$/, '')
  readme += `\nThis package provides the Emscripten WebAssembly implementation. It is usually not called directly. Please use the [\`${dispatchPackage}\`](https://pypi.org/project/${dispatchPackage}/) instead.\n\n`
  readme += `\n## Installation\n
\`\`\`sh
pip install ${packageName}
\`\`\`
`
  const readmePath = path.join(packageDir, 'README.md')
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, readme)
  }
}

function dispatchPackageReadme(packageName, packageDescription, packageDir) {
  let readme = ''
  readme += `# ${packageName}\n`
  readme += `\n[![PyPI version](https://badge.fury.io/py/${packageName}.svg)](https://badge.fury.io/py/${packageName})\n`
  readme += `\n${packageDescription}\n`
  readme += `\n## Installation\n
\`\`\`sh
pip install ${packageName}
\`\`\`
`
  const readmePath = path.join(packageDir, 'README.md')
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, readme)
  }
}

function packagePyProjectToml(packageName, packageDir, bindgenPyPackage, options) {
  let pyProjectToml = fs.readFileSync(bindgenResource('template.pyproject.toml'), {encoding:'utf8', flag:'r'})
  pyProjectToml = pyProjectToml.replaceAll('@bindgenPackageName@', packageName)
  const repository = options.repository ?? 'https://github.com/InsightSoftwareConsortium/itk-wasm'
  let bindgenKeywords = ''
  let bindgenDependencies = ''
  let bindgenHatchEnvDependencies = ''
  let bindgenHatchEnvScripts = `
[tool.hatch.envs.default.scripts]
test = "pytest"
`
  if (packageName.endsWith('wasi')) {
    bindgenDependencies += '\n    "importlib_resources",\n'
    bindgenKeywords = '\n  "wasi",'
  } else if (packageName.endsWith('emscripten')) {
    bindgenKeywords = '\n  "emscripten",'
    bindgenHatchEnvDependencies = '\n  "pytest-pyodide",'
    bindgenHatchEnvScripts = `
[tool.hatch.envs.default.scripts]
test = [
  "hatch build -t wheel",
  "pytest --dist-dir=./dist --rt=chrome",
]
download-pyodide = [
  "curl -L https://github.com/pyodide/pyodide/releases/download/0.23.1/pyodide-0.23.1.tar.bz2 -o pyodide.tar.bz2",
  "tar xjf pyodide.tar.bz2",
  "rm -rf dist pyodide.tar.bz2",
  "mv pyodide dist",
]
serve = [
  "hatch build -t wheel",
  'echo "\\nVisit http://localhost:8877/console.html\\n"',
  "python -m http.server --directory=./dist 8877",
]
`

  } else {
    bindgenKeywords = '\n  "wasi",\n  "emscripten",'
    bindgenDependencies += `\n    "${packageName}-wasi; sys_platform != \\"emscripten\\"",\n    "${packageName}-emscripten; sys_platform == \\"emscripten\\"",\n`
  }
  pyProjectToml = pyProjectToml.replaceAll('@bindgenKeywords@', bindgenKeywords)
  pyProjectToml = pyProjectToml.replaceAll('@bindgenDependencies@', bindgenDependencies)
  pyProjectToml = pyProjectToml.replaceAll('@bindgenHatchEnvDependencies@', bindgenHatchEnvDependencies)
  pyProjectToml = pyProjectToml.replaceAll('@bindgenHatchEnvScripts@', bindgenHatchEnvScripts)
  pyProjectToml = pyProjectToml.replaceAll('@bindgenProjectRepository@', repository)
  pyProjectToml = pyProjectToml.replaceAll('@bindgenPyPackage@', bindgenPyPackage)
  const pyProjectTomlPath = path.join(packageDir, 'pyproject.toml')
  if (!fs.existsSync(pyProjectTomlPath)) {
    fs.writeFileSync(pyProjectTomlPath, pyProjectToml)
  }
}

function packageVersion(packageDir, pypackage, options) {
  const versionString = options.packageVersion ?? '0.1.0'
  const version = `__version__ = "${versionString}"
`
  const versionPath = path.join(packageDir, pypackage, '_version.py')
  if (!fs.existsSync(versionPath) || typeof options.packageVersion !== 'undefined') {
    fs.writeFileSync(versionPath, version)
  }
}

function functionModuleImports(interfaceJson) {
let moduleContent = ""
  const usedInterfaceTypes = new Set()
  const pipelineComponents = ['inputs', 'outputs', 'parameters']
  pipelineComponents.forEach((pipelineComponent) => {
    interfaceJson[pipelineComponent].forEach((value) => {
      if (interfaceJsonTypeToInterfaceType.has(value.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(value.type)
        if (!interfaceType.includes('File')) {
          usedInterfaceTypes.add(interfaceType)
        }
      }
    })
  })
  usedInterfaceTypes.forEach((interfaceType) => {
    moduleContent += `\n    ${interfaceType},`
  })
  moduleContent += "\n)\n\n"

  return moduleContent
}

function functionModuleArgs(interfaceJson) {
  let functionArgs = ""
  interfaceJson['inputs'].forEach((value) => {
    const pythonType = interfaceJsonTypeToPythonType.get(value.type)
    functionArgs += `    ${snakeCase(value.name)}: ${pythonType},\n`
  })
  interfaceJson['parameters'].forEach((value) => {
    if (value.name === "memory-io") {
      return
    }
    const pythonType = interfaceJsonTypeToPythonType.get(value.type)
    functionArgs += `    ${snakeCase(value.name)}: ${pythonType}`
    if(value.type === "BOOL") {
      if (value.default === "false") {
        functionArgs += ` = False,\n`
      } else {
        functionArgs += ` = False,\n`
      }
    } else if(value.type.includes("TEXT")) {
      functionArgs += ` = "${value.default}",\n`
    } else if(value.required && value.itemsExpectedMax > 1) {
      functionArgs += ` = [],\n`
    } else {
      functionArgs += ` = ${value.default},\n`
    }
  })
  return functionArgs
}

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

  if (jsonOutputs.length > 1) {
    returnType += "Tuple["
    jsonOutputs.forEach((value) => {
      const pythonType = interfaceJsonTypeToPythonType.get(value.type)
      returnType += `${pythonType}, `
    })
    returnType = returnType.substring(0, returnType.length - 2)
    returnType += "]"
    returnType += "    )\n"
  } else {
    returnType = interfaceJsonTypeToPythonType.get(jsonOutputs[0].type)
  }

  return returnType
}

function functionModuleDocstring(interfaceJson) {
  let docstring = `"""${interfaceJson.description}`
  docstring += `

    Parameters
    ----------

`
  interfaceJson['inputs'].forEach((value) => {
    const pythonType = interfaceJsonTypeToPythonType.get(value.type)
    docstring += `    ${snakeCase(value.name)}: ${pythonType}\n`
    docstring += `        ${value.description}\n\n`
  })
  interfaceJson['parameters'].forEach((value) => {
    if (value.name === "memory-io") {
      return
    }
    const pythonType = interfaceJsonTypeToPythonType.get(value.type)
    docstring += `    ${snakeCase(value.name)}: ${pythonType}, optional\n`
    docstring += `        ${value.description}\n\n`
  })
  docstring += `
    Returns
    -------

`
  const jsonOutputs = interfaceJson['outputs']
  jsonOutputs.forEach((value) => {
    const pythonType = interfaceJsonTypeToPythonType.get(value.type)
    docstring += `    ${pythonType}\n`
    docstring += `        ${value.description}\n\n`
  })

  docstring += '    """'

  return docstring
}

function wasiFunctionModule(interfaceJson, pypackage, modulePath) {
  const functionName = snakeCase(interfaceJson.name)
  let moduleContent = `# Generated file. Do not edit.

from pathlib import Path
import os
from typing import Dict, Tuple

from importlib_resources import files as file_resources

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
          pipelineOutputs += `        PipelineOutput(InterfaceTypes.${interfaceType}, ${interfaceType}(${snakeCase(output.name)})),\n`
          break
        default:
          pipelineOutputs += `        PipelineOutput(InterfaceTypes.${interfaceType}),\n`
      }
    }
  })

  let pipelineInputs = ''
  const inputPipelineComponents = ['inputs', 'parameters']
  inputPipelineComponents.forEach((pipelineComponent) => {
    interfaceJson[pipelineComponent].forEach((input) => {
      if (interfaceJsonTypeToInterfaceType.has(input.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(input.type)
        switch (interfaceType) {
          case "TextStream":
          case "BinaryStream":
          case "TextFile":
          case "BinaryFile":
            pipelineInputs += `        PipelineInput(InterfaceTypes.${interfaceType}, ${interfaceType}(${snakeCase(input.name)})),\n`
            break
          default:
            pipelineInputs += `        PipelineInput(InterfaceTypes.${interfaceType}, ${snakeCase(input.name)}),\n`
        }
      }
    })
  })

  let args = `    args: List[str] = ['--memory-io',]\n`
  let inputCount = 0
  args += "    # Inputs\n"
  interfaceJson.inputs.forEach((input) => {
    if (interfaceJsonTypeToInterfaceType.has(input.type)) {
      const interfaceType = interfaceJsonTypeToInterfaceType.get(input.type)
      const name = interfaceType.includes('File') ? `str(${snakeCase(input.name)})` : inputCount.toString()
      args += `    args.append('${name}')\n`
      inputCount++
    } else {
      const snake = snakeCase(input.name)
      args += `    args.append(str(${snake}))\n`
    }
  })

  let outputCount = 0
  args += "    # Outputs\n"
  interfaceJson.outputs.forEach((output) => {
    if (interfaceJsonTypeToInterfaceType.has(output.type)) {
      const interfaceType = interfaceJsonTypeToInterfaceType.get(output.type)
      const name = interfaceType.includes('File') ?  `str(${snakeCase(output.name)}` : outputCount.toString()
      args += `    args.append('${name}')\n`
      outputCount++
    } else {
      const snake = snakeCase(output.name)
      args += `    args.append(str(${snake}))\n`
    }
  })

  args += "    # Options\n"
  interfaceJson.parameters.forEach((parameter) => {
    if (parameter.name === 'memory-io') {
      // Internal
      return
    }
    const snake = snakeCase(parameter.name)
    args += `    if ${snake} is not None:\n`
    if (parameter.type === "BOOL") {
      args += `        args.append('--${parameter.name}')\n`
    } else if (parameter.itemsExpectedMax > 1) {
      args += `    if len(${snake}) < ${parameter.itemsExpectedMin}:\n`
      args += `        raise new ValueError('"${parameter.name}" option must have a length > ${parameter.itemsExpectedMin}')\n`
      args += `    \n`
      args += `    args.append('--${parameter.name}')\n`
      args += `    for value in ${snake}:\n`
      if (interfaceJsonTypeToInterfaceType.has(parameter.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(parameter.type)
        if (interfaceType.includes('File')) {
          // for files
          args += `        input_file = str(${snakeCase(parameter.name)})\n`
          args += `        inputs.append(InterfaceTypes.${interfaceType}(value))\n`
          args += `        args.append(input_file)\n`
        } else if (interfaceType.includes('Stream')) {
          // for streams
          args += `        input_count_string = str(len(inputs))\n`
          args += `        inputs.append(InterfaceTypes.${interfaceType}(value))\n`
          args += `        args.append(input_count_spring)\n`
        } else {
          // Image, Mesh, PolyData, JsonObject
          args += `        input_count_string = str(len(inputs))\n`
          args += `        inputs.push(InterfaceTypes.${interfaceType}(value))\n`
          args += `        args.append(input_count_string)\n`
        }
      } else {
        args += `        args.append(str(value))\n`
      }
      args += `    })\n`
    } else {
      if (interfaceJsonTypeToInterfaceType.has(parameter.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(parameter.type)
        if (interfaceType.includes('File')) {
          // for files
          args += `        input_file = str(${snakeCase(parameter.name)})\n`
          args += `        inputs.append(InterfaceTypes.${interfaceType}(${snake})\n`
          args += `        args.append('--${parameter.name}')\n`
          args += `        args.append(input_file)\n`
        } else if (interfaceType.includes('Stream')) {
          // for streams
          args += `        input_count_string = str(len(inputs))\n`
          args += `        inputs.append(InterfaceTypes.${interfaceType}(${snake})\n`
          args += `        args.append('--${parameter.name}')\n`
          args += `        args.append(input_count_string)\n`
        } else {
          // Image, Mesh, PolyData, JsonObject
          args += `        input_count_string = str(len(inputs))\n`
          args += `        inputs.append(InterfaceTypes.${interfaceType}(${snake}))\n`
          args += `        args.append('--${parameter.name}')\n`
          args += `        args.append(input_count_string)\n`
        }
      } else {
        args += `        args.append('--${parameter.name}')\n`
        args += `        args.append(str(${snake}))\n`
      }
    }
    args += `\n`
  })

  let postOutput = ''
  function toPythonType(type, value) {
    const pythonType = interfaceJsonTypeToPythonType.get(type)
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
  } else {
    const outputValue = "outputs[0]"
    postOutput = `    result = ${toPythonType(jsonOutputs[0].type, outputValue)}\n`
  }
  postOutput += '    return result\n'

  moduleContent += `def ${functionName}(
${functionArgs}) -> ${returnType}:
    ${docstring}
    pipeline = Pipeline(file_resources('${pypackage}').joinpath(Path('wasm_modules') / Path('${interfaceJson.name}.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
${pipelineOutputs}    ]

    pipeline_inputs: List[PipelineInput] = [
${pipelineInputs}    ]

${args}
    outputs = pipeline.run(args, pipeline_outputs, pipeline_inputs)

${postOutput}

    del pipeline
`
  fs.writeFileSync(modulePath, moduleContent)
}

function emscriptenTestModule(packageDir, pypackage) {
  mkdirP(path.join(packageDir, 'test'))

  let moduleContent = `import pytest
import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide

from ${pypackage} import __version__ as test_package_version

@pytest.fixture
def package_wheel():
    return f"${pypackage}-{test_package_version}-py3-none-any.whl"

@run_in_pyodide(packages=['micropip'])
async def test_example(selenium, package_wheel):
    import micropip
    await micropip.install(package_wheel)

    # Write your test code here
`

  const modulePath = path.join(packageDir, 'test', 'test_pyodide.py')
  if (!fs.existsSync(modulePath)) {
    fs.writeFileSync(modulePath, moduleContent)
  }
}

function emscriptenFunctionModule(interfaceJson, pypackage, modulePath) {
  const functionName = snakeCase(interfaceJson.name)
  let moduleContent = `# Generated file. Do not edit.

from pathlib import Path
import os
from typing import Dict, Tuple

from .pyodide import js_package

from itkwasm.pyodide import (
    to_js,
    to_py,
    js_resources
)

`

  const functionArgs = functionModuleArgs(interfaceJson)
  const returnType = functionModuleReturnType(interfaceJson)
  const docstring = functionModuleDocstring(interfaceJson)

  let args = ''
  interfaceJson.inputs.forEach((input) => {
    args += `to_js(${snakeCase(input.name)}), `
  })

  let options = ''
  interfaceJson.parameters.forEach((parameter) => {
    if (parameter.name === 'memory-io') {
      // Internal
      return
    }
    options += `${camelCase(parameter.name)}=to_js(${snakeCase(parameter.name)}), `
  })

  const jsFunction = camelCase(interfaceJson.name)

  moduleContent += `async def ${functionName}_async(
${functionArgs}) -> ${returnType}:
    ${docstring}
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    outputs = await js_module.${jsFunction}(web_worker, ${args} ${options})

    output_web_worker = None
    output_list = []
    print(dir(outputs))
    outputs_object_map = outputs.as_object_map()
    for output_name in outputs.object_keys():
        if output_name == 'webWorker':
            output_web_worker = outputs_object_map[output_name]
        else:
            print(output_name)
            print(type(outputs_object_map[output_name]))
            print(outputs_object_map[output_name].constructor.name)
            print(outputs_object_map[output_name])
            output_list.append(to_py(outputs_object_map[output_name]))

    js_resources.web_worker = output_web_worker

    if len(output_list) == 1:
        return output_list[0]
    return tuple(output_list)
`
  fs.writeFileSync(modulePath, moduleContent)
}


function dispatchFunctionModule(interfaceJson, pypackage, modulePath) {
  const functionName = snakeCase(interfaceJson.name)
  let moduleContent = `# Generated file. Do not edit.

from itkwasm import (
    environment_dispatch,`

  moduleContent += functionModuleImports(interfaceJson)

  const functionArgs = functionModuleArgs(interfaceJson)
  const returnType = functionModuleReturnType(interfaceJson)
  const docstring = functionModuleDocstring(interfaceJson)

  let functionArgsToPass = ""
  interfaceJson['inputs'].forEach((value) => {
    functionArgsToPass += `${snakeCase(value.name)}, `
  })
  interfaceJson['parameters'].forEach((value) => {
    if (value.name === "memory-io") {
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

function packageDunderInit(outputDir, buildDir, wasmBinaries, packageName, packageDescription, packageDir, pypackage, async, sync) {
  const functionNames = []
  wasmBinaries.forEach((wasmBinaryName) => {
    const { interfaceJson, parsedPath } = wasmBinaryInterfaceJson(outputDir, buildDir, wasmBinaryName)
    if (async) {
      functionNames.push(snakeCase(interfaceJson.name) + "_async")
    }
    if (sync) {
      functionNames.push(snakeCase(interfaceJson.name))
    }
  })

  const functionImports = functionNames.map(n => `from .${n} import ${n}`).join("\n")

  const dunderInit = `"""${packageName}: ${packageDescription}"""

${functionImports}

from ._version import __version__
`
  const dunderInitPath = path.join(packageDir, pypackage, '__init__.py')
  fs.writeFileSync(dunderInitPath, dunderInit)
}

function wasiPackage(outputDir, buildDir, wasmBinaries, options) {
  const packageName = `${options.packageName}-wasi`
  const packageDir = path.join(outputDir, packageName)
  const packageDescription = `${options.packageDescription} WASI implementation.`
  mkdirP(packageDir)

  const pypackage = snakeCase(packageName)
  const bindgenPyPackage = pypackage
  mkdirP(path.join(packageDir, pypackage))

  wasiPackageReadme(packageName, packageDescription, packageDir)
  packagePyProjectToml(packageName, packageDir, bindgenPyPackage, options)
  packageVersion(packageDir, pypackage, options)
  const async = false
  const sync = true
  packageDunderInit(outputDir, buildDir, wasmBinaries, packageName, packageDescription, packageDir, pypackage, async, sync)

  const wasmModulesDir = path.join(packageDir, pypackage, 'wasm_modules')
  mkdirP(wasmModulesDir)
  wasmBinaries.forEach((wasmBinaryName) => {
    const { interfaceJson, parsedPath } = wasmBinaryInterfaceJson(outputDir, buildDir, wasmBinaryName)
    fs.copyFileSync(path.join(parsedPath.dir, parsedPath.base), path.join(wasmModulesDir, parsedPath.base))
    const functionName = snakeCase(interfaceJson.name)
    wasiFunctionModule(interfaceJson, pypackage, path.join(packageDir, pypackage, `${functionName}.py`))
  })
}

function emscriptenPyodideModule(packageDir, pypackage, options) {
  const defaultJsPackageName = options.packageName.replace('itkwasm-', '@itk-wasm/')
  const defaultJsModuleName = options.packageName.replace('itkwasm-', '')
  const version = options.packageVersion ?? '0.1.0'

  const moduleUrl = options.jsModuleUrl ?? `https://cdn.jsdelivr.net/npm/${defaultJsPackageName}@${version}/dist/bundles/${defaultJsModuleName}.js`

  const moduleContent = `from itkwasm.pyodide import JsPackageConfig, JsPackage

default_config = JsPackageConfig("${moduleUrl}")
js_package = JsPackage(default_config)
`

  const modulePath = path.join(packageDir, pypackage, 'pyodide.py')

  if (!fs.existsSync(modulePath)) {
    fs.writeFileSync(modulePath, moduleContent)
  }
}

function emscriptenPackage(outputDir, buildDir, wasmBinaries, options) {
  const packageName = `${options.packageName}-emscripten`
  const packageDir = path.join(outputDir, packageName)
  const packageDescription = `${options.packageDescription} Emscripten implementation.`
  mkdirP(packageDir)

  const pypackage = snakeCase(packageName)
  const bindgenPyPackage = pypackage
  mkdirP(path.join(packageDir, pypackage))

  emscriptenPackageReadme(packageName, packageDescription, packageDir)
  packagePyProjectToml(packageName, packageDir, bindgenPyPackage, options)
  packageVersion(packageDir, pypackage, options)
  const async = true
  const sync = false
  packageDunderInit(outputDir, buildDir, wasmBinaries, packageName, packageDescription, packageDir, pypackage, async, sync)
  emscriptenPyodideModule(packageDir, pypackage, options)
  emscriptenTestModule(packageDir, pypackage)

  const wasmModulesDir = path.join(packageDir, pypackage, 'wasm_modules')
  mkdirP(wasmModulesDir)
  wasmBinaries.forEach((wasmBinaryName) => {
    const { interfaceJson, parsedPath } = wasmBinaryInterfaceJson(outputDir, buildDir, wasmBinaryName)
    const functionName = snakeCase(interfaceJson.name) + '_async'
    emscriptenFunctionModule(interfaceJson, pypackage, path.join(packageDir, pypackage, `${functionName}.py`))
  })
}

function pythonBindings(outputDir, buildDir, wasmBinaries, options) {
  const packageName = options.packageName
  const packageDir = path.join(outputDir, packageName)
  mkdirP(packageDir)

  const pypackage = snakeCase(packageName)
  const bindgenPyPackage = pypackage
  mkdirP(path.join(packageDir, pypackage))

  dispatchPackageReadme(packageName, options.packageDescription, packageDir)
  packagePyProjectToml(packageName, packageDir, bindgenPyPackage, options)
  packageVersion(packageDir, pypackage, options)
  const async = true
  const sync = true
  packageDunderInit(outputDir, buildDir, wasmBinaries, packageName, options.packageDescription, packageDir, pypackage, async, sync)

  wasmBinaries.forEach((wasmBinaryName) => {
    const { interfaceJson } = wasmBinaryInterfaceJson(outputDir, buildDir, wasmBinaryName)
    const functionName = snakeCase(interfaceJson.name)
    dispatchFunctionModule(interfaceJson, pypackage, path.join(packageDir, pypackage, `${functionName}.py`))
  })
}

function bindgen (outputDir, buildDir, filteredWasmBinaries, options) {
  pythonBindings(outputDir, buildDir, filteredWasmBinaries, options)
  wasiPackage(outputDir, buildDir, filteredWasmBinaries, options)
  emscriptenPackage(outputDir, buildDir, filteredWasmBinaries, options)
}

export default bindgen
