import path from 'path'

import inputParametersDemoTypeScript from './input-parameters-demo-typescript.js'
import camelCase from '../../camel-case.js'
import pascalCase from '../../pascal-case.js'
import packageToBundleName from '../package-to-bundle-name.js'
import writeIfOverrideNotPresent from '../../write-if-override-not-present.js'
import outputDemoRunTypeScript from './output-demo-run-typescript.js'
import outputDemoTypeScript from './output-demo-typescript.js'
import ioPackagesNeeded from './io-packages-needed.js'

function interfaceFunctionsDemoTypeScript(
  packageName,
  interfaceJson,
  outputPath
) {
  let result = ''
  let indent = '    '
  const bundleName = packageToBundleName(packageName)
  const functionName = camelCase(interfaceJson.name)
  const functionNamePascalCase = pascalCase(interfaceJson.name)

  const {
    needReadImage,
    needReadMesh,
    needReadPointSet,
    needReadTransform,
    needWriteImage,
    needWriteMesh,
    needWritePointSet,
    needWriteTransform
  } = ioPackagesNeeded(interfaceJson)
  if (needReadMesh) {
    if (packageName === '@itk-wasm/mesh-io') {
      result += `import { readMesh } from '../../../dist/index.js'\n`
    } else {
      result += `import { readMesh } from '@itk-wasm/mesh-io'\n`
    }
  }
  if (needReadPointSet) {
    if (packageName === '@itk-wasm/mesh-io') {
      result += `import { readPointSet } from '../../../dist/index.js'\n`
    } else {
      result += `import { readPointSet } from '@itk-wasm/mesh-io'\n`
    }
  }
  if (needReadImage) {
    if (packageName === '@itk-wasm/image-io') {
      result += `import { readImage } from '../../../dist/index.js'\n`
    } else {
      result += `import { readImage } from '@itk-wasm/image-io'\n`
    }
  }
  if (needReadTransform) {
    if (packageName === '@itk-wasm/transform-io') {
      result += `import { readTransform } from '../../../dist/index.js'\n`
    } else {
      result += `import { readTransform } from '@itk-wasm/transform-io'\n`
    }
  }
  if (needWriteMesh) {
    if (packageName === '@itk-wasm/mesh-io') {
      result += `import { writeMesh } from '../../../dist/index.js'\n`
    } else {
      result += `import { writeMesh } from '@itk-wasm/mesh-io'\n`
    }
  }
  if (needWritePointSet) {
    if (packageName === '@itk-wasm/mesh-io') {
      result += `import { writePointSet } from '../../../dist/index.js'\n`
    } else {
      result += `import { writePointSet } from '@itk-wasm/mesh-io'\n`
    }
  }
  if (needWriteImage) {
    if (packageName === '@itk-wasm/image-io') {
      result += `import { writeImage } from '../../../dist/index.js'\n`
    } else {
      result += `import { writeImage } from '@itk-wasm/image-io'\n`
    }
  }
  if (needWriteTransform) {
    if (packageName === '@itk-wasm/transform-io') {
      result += `import { writeTransform } from '../../../dist/index.js'\n`
    } else {
      result += `import { writeTransform } from '@itk-wasm/transform-io'\n`
    }
  }

  result += `import * as ${camelCase(bundleName)} from '../../../dist/index.js'\n`

  result += `import ${functionName}LoadSampleInputs, { usePreRun } from "./${interfaceJson.name}-load-sample-inputs.js"\n`
  const loadSampleInputsModulePath = path.join(
    outputPath,
    `${interfaceJson.name}-load-sample-inputs.ts`
  )
  const loadSampleInputsModuleContent = `export default null
// export default async function ${functionName}LoadSampleInputs (model, preRun=false) {

  // Load sample inputs for the ${functionName} function.
  //
  // This function should load sample inputs:
  //
  //  1) In the provided model map.
  //  2) Into the corresponding HTML input elements if preRun is not true.
  //
  // Example for an input named \`exampleInput\`:

  // const exampleInput = 5
  // model.inputs.set("exampleInput", exampleInput)
  // if (!preRun) {
  //   const exampleElement = document.querySelector("#${functionName}Inputs [name=example-input]")
  //   exampleElement.value = 5
  // }

  // return model
// }

// Use this function to run the pipeline when this tab group is select.
// This will load the web worker if it is not already loaded, download the wasm module, and allocate memory in the wasm model.
// Set this to \`false\` if sample inputs are very large or sample pipeline computation is long.
export const usePreRun = true
`
  writeIfOverrideNotPresent(
    loadSampleInputsModulePath,
    loadSampleInputsModuleContent
  )

  result += `
class ${functionNamePascalCase}Model {
  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
}


`

  const controllerClassName = camelCase(`${functionNamePascalCase}Controller`)
  result += `class ${controllerClassName} {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new ${functionNamePascalCase}Model()
    const model = this.model
`

  result += `\n    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#${functionName}Inputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
`
  interfaceJson.inputs.forEach((input) => {
    result += inputParametersDemoTypeScript(
      functionName,
      indent,
      input,
      true,
      'inputs'
    )
  })

  interfaceJson.outputs.forEach((output) => {
    if (output.type.includes('FILE')) {
      result += inputParametersDemoTypeScript(
        functionName,
        indent,
        output,
        true,
        'inputs'
      )
    }
  })

  if (interfaceJson.parameters.length > 1) {
    result += `${indent}// ----------------------------------------------\n${indent}// Options\n`
    interfaceJson.parameters.forEach((parameter) => {
      // Internal
      if (parameter.name === 'memory-io' || parameter.name === 'version') {
        return
      }
      result += inputParametersDemoTypeScript(
        functionName,
        indent,
        parameter,
        parameter.required,
        'options'
      )
    })
  }

  result += `${indent}// ----------------------------------------------\n${indent}// Outputs`
  interfaceJson.outputs.forEach((output) => {
    result += outputDemoTypeScript(functionName, '', indent, output)
  })

  result += `\n${indent}const preRun = async () => {
      if (loadSampleInputs && usePreRun) {
        await loadSampleInputs(model, true)
        await this.run()
      }
    }

    const onSelectTab = async (event) => {
      if (event.detail.name === '${functionName}-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== '${functionName}') {
          params.set('functionName', '${functionName}')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: '${functionName}' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === '${functionName}') {
        tabGroup.show('${functionName}-panel')
        preRun()
      }
    }
    onInit()

    const runButton = document.querySelector('#${functionName}Inputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()\n\n`

  interfaceJson.inputs.forEach((input) => {
    result += `${indent}  if(!model.inputs.has('${camelCase(input.name)}')) {\n        globalThis.notify("Required input not provided", "${camelCase(input.name)}", "danger", "exclamation-octagon")\n        return\n      }\n`
  })

  result += `\n
      try {
        runButton.loading = true

        const t0 = performance.now()
        const { `
  interfaceJson.outputs.forEach((output) => {
    result += `${camelCase(output.name)}, `
  })
  result += `} = await this.run()\n`
  result += '        const t1 = performance.now()\n'
  result += `        globalThis.notify("${functionName} successfully completed", \`in \${t1 - t0} milliseconds.\`, "success", "rocket-fill")\n`

  interfaceJson.outputs.forEach((output) => {
    result += outputDemoRunTypeScript(functionName, '    ', indent, output)
  })

  result += '      } catch (error) {\n'
  result +=
    '        globalThis.notify("Error while running pipeline", error.toString(), "danger", "exclamation-octagon")\n'
  result += '        throw error\n'
  result += '      } finally {\n'
  result += '        runButton.loading = false\n'
  result += '      }\n'
  result += '    })\n'

  result += '  }\n'

  result += `\n  async run() {
    const options = Object.fromEntries(this.model.options.entries())
    const { `
  interfaceJson.outputs.forEach((output) => {
    result += `${camelCase(output.name)}, `
  })
  result += `} = await ${camelCase(bundleName)}.${functionName}(`
  interfaceJson.inputs.forEach((input) => {
    if (
      input.type === 'INPUT_TEXT_STREAM' ||
      input.type === 'INPUT_BINARY_STREAM'
    ) {
      result += `      this.model.inputs.get('${camelCase(input.name)}').slice(),\n`
    } else if (
      input.type.startsWith('INPUT_BINARY_FILE') ||
      input.type.startsWith('INPUT_TEXT_FILE')
    ) {
      result += `      { data: this.model.inputs.get('${camelCase(input.name)}').data.slice(), path: this.model.inputs.get('${camelCase(input.name)}').path },\n`
    } else if (input.type === 'INPUT_IMAGE') {
      result += `      this.model.inputs.get('${camelCase(input.name)}'),\n`
    } else {
      result += `      this.model.inputs.get('${camelCase(input.name)}'),\n`
    }
  })
  interfaceJson.outputs.forEach((output) => {
    const defaultData = output.type.includes('BINARY')
      ? 'new Uint8Array()'
      : "''"
    if (
      output.type.startsWith('OUTPUT_BINARY_FILE') ||
      output.type.startsWith('OUTPUT_TEXT_FILE')
    ) {
      result += `      this.model.inputs.get('${camelCase(output.name)}'),\n`
    }
  })
  result += '      Object.fromEntries(this.model.options.entries())\n'
  result += '    )\n'
  result += `
    return { `
  interfaceJson.outputs.forEach((output) => {
    result += `${camelCase(output.name)}, `
  })
  result += '}\n  }\n'

  result += '}\n'

  result += `\nconst ${functionName}Controller = new ${controllerClassName}(${functionName}LoadSampleInputs)\n`

  const modulePath = path.join(
    outputPath,
    `${interfaceJson.name}-controller.ts`
  )
  writeIfOverrideNotPresent(modulePath, result)
  return modulePath
}

export default interfaceFunctionsDemoTypeScript
