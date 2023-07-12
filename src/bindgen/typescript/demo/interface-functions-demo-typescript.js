import path from 'path'

import inputParametersDemoTypeScript from "./input-parameters-demo-typescript.js"
import camelCase from "../../camel-case.js"
import packageToBundleName from "../package-to-bundle-name.js"
import writeIfOverrideNotPresent from "../write-if-override-not-present.js"
import outputDemoRunTypeScript from './output-demo-run-typescript.js'
import outputDemoTypeScript from './output-demo-typescript.js'

function interfaceFunctionsDemoTypeScript(packageName, interfaceJson, outputPath) {
  let indent = '  '
  const bundleName = packageToBundleName(packageName)
  const functionName = camelCase(interfaceJson.name)

  let result = `import * as ${camelCase(bundleName)} from '../../../dist/bundles/${bundleName}.js'\n`
  result += `import ${functionName}LoadSampleInputs from "./${interfaceJson.name}-load-sample-inputs.js"\n\n`

  const setupFunctionName = camelCase(`setup-${interfaceJson.name}`)
  result += `function ${setupFunctionName}(loadSampleInputs)  {
  // Data context
  const context = {
    inputs: new Map(),
    options: new Map(),
    outputs: new Map(),
  }

  // ----------------------------------------------
  // Inputs
`

  const loadSampleInputsModulePath = path.join(outputPath, `${interfaceJson.name}-load-sample-inputs.ts`)
  const loadSampleInputsModuleContent = `export default null
// export default function ${functionName}LoadSampleInputs (context) {

  // Load sample inputs for the ${functionName} function.
  //
  // This function should load sample inputs:
  //
  //  1) In the provided context map.
  //  2) Into the corresponding HTML input elements.
  //
  // Example for an input named \`exampleInput\`:

  // const exampleInput = 5
  // context.inputs.set("exampleInput", exampleInput)
  // const exampleElement = document.querySelector("#${functionName}Inputs [name=example-input]")
  // exampleElement.value = 5

// }
`
  writeIfOverrideNotPresent(loadSampleInputsModulePath, loadSampleInputsModuleContent)

  result += `\n  if (loadSampleInputs) {
    const loadSampleInputsButton = document.querySelector("#${functionName}Inputs [name=loadSampleInputs]")
    loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
    loadSampleInputsButton.addEventListener('click', (event) => {
      loadSampleInputs(context)
    })
  }\n\n`

  interfaceJson.inputs.forEach((input) => {
    result += inputParametersDemoTypeScript(functionName, indent, input, true)
  })

  if (interfaceJson.parameters.length > 1) {
    result += '  // ----------------------------------------------\n  // Options\n\n'
    interfaceJson.parameters.forEach((parameter) => {
      // Internal
      if (parameter.name === "memory-io" || parameter.name === "version") {
        return
      }
      result += inputParametersDemoTypeScript(functionName, indent, parameter, false)
    })
  }

  result += '  // ----------------------------------------------\n  // Outputs\n'
  interfaceJson.outputs.forEach((output) => {
    result += outputDemoTypeScript(functionName, '', indent, output)
  })

  result += `\n  const form = document.querySelector(\`#${functionName}Inputs form\`)
  form.addEventListener('submit', async (event) => {
    event.preventDefault()\n\n`

  interfaceJson.inputs.forEach((input) => {
    result += `    if(!context.inputs.has('${camelCase(input.name)}')) {\n      globalThis.notify("Required input not provided", "${camelCase(input.name)}", "danger", "exclamation-octagon")\n      return\n    }\n`
  })

    result += `\n    const progressBar = document.querySelector('#${functionName}Inputs > form > sl-progress-bar')
    try {
      progressBar.setAttribute('style', 'visibility: default;')
      progressBar.indeterminate = true
      const t0 = performance.now()
      const { webWorker, output } = await ${camelCase(bundleName)}.${functionName}(null,\n`
  interfaceJson.inputs.forEach((input) => {
    if (input.type === 'INPUT_TEXT_STREAM' || input.type === 'INPUT_BINARY_STREAM') {
      result += `        context.inputs.get('${camelCase(input.name)}').slice(),\n`
    } else {
      result += `        context.inputs.get('${camelCase(input.name)}'),\n`
    }
  })
  result += '        Object.fromEntries(context.options.entries())\n'
  result += '        )\n'
  result += '      const t1 = performance.now()\n'
  result += `      globalThis.notify("${functionName} successfully completed", \`in \${t1 - t0} milliseconds.\`, "success", "rocket-fill")\n`
  result += '      webWorker.terminate()\n'

  interfaceJson.outputs.forEach((output) => {
    result += outputDemoRunTypeScript(functionName, '    ', indent, output)
  })

  result += '    } catch (error) {\n'
  result += '      globalThis.notify("Error while running pipeline", error.toString(), "danger", "exclamation-octagon")\n'
  result += '      throw error\n'
  result += '    } finally {\n'
  result += '      progressBar.indeterminate = false\n'
  result += '      progressBar.setAttribute("style", "visibility: hidden;")\n'
  result += '    }\n'
  result += '\n  })\n'

  result += '}\n'
  result += `${setupFunctionName}(${functionName}LoadSampleInputs)\n`

  const modulePath = path.join(outputPath, `${interfaceJson.name}.ts`)
  writeIfOverrideNotPresent(modulePath, result)
  return modulePath
}

export default interfaceFunctionsDemoTypeScript