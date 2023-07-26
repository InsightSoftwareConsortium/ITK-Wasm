import path from 'path'
import fs from 'fs-extra'

import inputParametersDemoTypeScript from "./input-parameters-demo-typescript.js"
import camelCase from "../../camel-case.js"
import pascalCase from '../../pascal-case.js'
import packageToBundleName from "../package-to-bundle-name.js"
import writeIfOverrideNotPresent from "../../write-if-override-not-present.js"
import outputDemoRunTypeScript from './output-demo-run-typescript.js'
import outputDemoTypeScript from './output-demo-typescript.js'

function interfaceFunctionsDemoTypeScript(packageName, interfaceJson, outputPath) {
  let indent = '    '
  const bundleName = packageToBundleName(packageName)
  const functionName = camelCase(interfaceJson.name)
  const functionNamePascalCase = pascalCase(interfaceJson.name)

  let result = `import * as ${camelCase(bundleName)} from '../../../dist/bundles/${bundleName}.js'\n`

  result += `import ${functionName}LoadSampleInputs from "./${interfaceJson.name}-load-sample-inputs.js"\n`
  const loadSampleInputsModulePath = path.join(outputPath, `${interfaceJson.name}-load-sample-inputs.ts`)
  const loadSampleInputsModuleContent = `export default null
// export default function ${functionName}LoadSampleInputs (model) {

  // Load sample inputs for the ${functionName} function.
  //
  // This function should load sample inputs:
  //
  //  1) In the provided model map.
  //  2) Into the corresponding HTML input elements.
  //
  // Example for an input named \`exampleInput\`:

  // const exampleInput = 5
  // model.inputs.set("exampleInput", exampleInput)
  // const exampleElement = document.querySelector("#${functionName}Inputs [name=example-input]")
  // exampleElement.value = 5

// }
`
  writeIfOverrideNotPresent(loadSampleInputsModulePath, loadSampleInputsModuleContent)

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
  result += `class ${controllerClassName}  {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new ${functionNamePascalCase}Model()
    const model = this.model

    this.webWorker = null
`

  result += `\n    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#${functionName}Inputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', (event) => {
        loadSampleInputs(model)
      })
    }

    // ----------------------------------------------
    // Inputs
`
  interfaceJson.inputs.forEach((input) => {
    result += inputParametersDemoTypeScript(functionName, indent, input, true)
  })

  if (interfaceJson.parameters.length > 1) {
    result += `${indent}// ----------------------------------------------\n${indent}// Options\n`
    interfaceJson.parameters.forEach((parameter) => {
      // Internal
      if (parameter.name === "memory-io" || parameter.name === "version") {
        return
      }
      result += inputParametersDemoTypeScript(functionName, indent, parameter, false)
    })
  }

  result += `${indent}// ----------------------------------------------\n${indent}// Outputs`
  interfaceJson.outputs.forEach((output) => {
    result += outputDemoTypeScript(functionName, '', indent, output)
  })

  result += `\n${indent}const runButton = document.querySelector('#${functionName}Inputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()\n\n`

  interfaceJson.inputs.forEach((input) => {
    result += `${indent}  if(!model.inputs.has('${camelCase(input.name)}')) {\n        globalThis.notify("Required input not provided", "${camelCase(input.name)}", "danger", "exclamation-octagon")\n        return\n      }\n`
  })

    result += `\n
      try {
        runButton.loading = true
        const t0 = performance.now()

        const { webWorker, output } = await ${camelCase(bundleName)}.${functionName}(this.webWorker,\n`
  interfaceJson.inputs.forEach((input) => {
    if (input.type === 'INPUT_TEXT_STREAM' || input.type === 'INPUT_BINARY_STREAM') {
      result += `          model.inputs.get('${camelCase(input.name)}').slice(),\n`
    } else {
      result += `          model.inputs.get('${camelCase(input.name)}'),\n`
    }
  })
  result += '          Object.fromEntries(model.options.entries())\n'
  result += '        )\n\n'
  result += '        const t1 = performance.now()\n'
  result += `        globalThis.notify("${functionName} successfully completed", \`in \${t1 - t0} milliseconds.\`, "success", "rocket-fill")\n`
  result += '        this.webWorker = webWorker\n'

  interfaceJson.outputs.forEach((output) => {
    result += outputDemoRunTypeScript(functionName, '    ', indent, output)
  })

  result += '      } catch (error) {\n'
  result += '        globalThis.notify("Error while running pipeline", error.toString(), "danger", "exclamation-octagon")\n'
  result += '        throw error\n'
  result += '      } finally {\n'
  result += '        runButton.loading = false\n'
  result += '      }\n'
  result += '    })\n'

  result += '  }\n'
  result += '}\n'

  result += `\nconst ${functionName}Controller = new ${controllerClassName}(${functionName}LoadSampleInputs)\n`

  const modulePath = path.join(outputPath, `${interfaceJson.name}-controller.ts`)
  writeIfOverrideNotPresent(modulePath, result)
  return modulePath
}

export default interfaceFunctionsDemoTypeScript