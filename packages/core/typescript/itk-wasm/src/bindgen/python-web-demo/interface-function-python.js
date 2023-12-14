import path from 'path'
import fs from 'fs-extra'

import inputParametersPython from "./input-parameters-python.js"
import snakeCase from "../snake-case.js"
import pascalCase from "../pascal-case.js"
// import packageToBundleName from "../package-to-bundle-name.js"
import writeIfOverrideNotPresent from "../write-if-override-not-present.js"
// import outputDemoRunTypeScript from './output-demo-run-typescript.js'
import outputPython from './output-python.js'

function interfaceFunctionPython(packageName, interfaceJson, outputPath) {
  let indent = ''
  const functionName = snakeCase(interfaceJson.name)
  const functionNamePascalCase = pascalCase(interfaceJson.name)

  let result = `from dataclasses import dataclass
from typing import Any, Dict

import numpy as np

import js
from pyodide.ffi.wrappers import add_event_listener
import pyodide

`
  const packageImport = packageName.replace(/-/g, '_')
  result += `from ${packageImport} import ${functionName}_async\n`

  result += `from ${functionName}_load_sample_inputs import load_sample_inputs\n\n`

  result += `@dataclass
class ${functionNamePascalCase}Model:
    inputs: Dict['str', Any]
    options: Dict['str', Any]
    outputs: Dict['str', Any]

class ${functionNamePascalCase}Controller:

    def __init__(self, load_sample_inputs):
        self.model = ${functionNamePascalCase}Model({}, {}, {})

        self.load_sample_inputs = load_sample_inputs
        if load_sample_inputs is not None:
            load_sample_inputs_button = js.document.querySelector("#${functionName}-inputs [name=load-sample-inputs]")
            load_sample_inputs_button.setAttribute('style', 'display: block-inline;')
            add_event_listener(load_sample_inputs_button, 'click', self.on_load_sample_inputs_click)

        # Inputs
`

  let methods = `    async def on_load_sample_inputs_click(self, event):
        load_sample_inputs_button = js.document.querySelector("#${functionName}-inputs [name=load-sample-inputs]")
        load_sample_inputs_button.loading = True
        self.model = await self.load_sample_inputs(self.model)
        load_sample_inputs_button.loading = False

`
  indent = '    '
  interfaceJson.inputs.forEach((input) => {
    const { init, method } = inputParametersPython(functionName, indent, input, true)
    result += init
    methods += method
  })

  if (interfaceJson.parameters.length > 1) {
    result += `${indent}    # Options\n`
    interfaceJson.parameters.forEach((parameter) => {
      // Internal
      if (parameter.name === "memory-io" || parameter.name === "version") {
        return
      }
      const { init, method } = inputParametersPython(functionName, indent, parameter, false)
      result += init
      methods += method
    })
  }

  let runOutput = ''
  result += `${indent}    # Outputs\n`
  interfaceJson.outputs.forEach((output) => {
    const { init, method, run } = outputPython(functionName, '', indent, output)
    result += init
    methods += method
    runOutput += run
  })

  result += `        # Run
        run_button = js.document.querySelector('#${functionName}-inputs sl-button[name="run"]')
        self.run_button = run_button
        add_event_listener(run_button, 'click', self.on_run)

`

  methods += `    async def on_run(self, event):
        event.preventDefault()
        event.stopPropagation()

`

  interfaceJson.inputs.forEach((input) => {
    const inputName = snakeCase(input.name)
    methods += `        if '${inputName}' not in self.model.inputs:\n
            js.globalThis.notify("Error while running pipeline", "Missing input '${inputName}'", "danger", "exclamation-octagon")
            return
`
  })

  methods += `
        self.run_button.loading = True
        try:
            t0 = js.performance.now()
            `

  if (interfaceJson.outputs.length > 1) {
    interfaceJson.outputs.forEach((output) => {
      const outputName = snakeCase(output.name)
      methods += `${outputName}, `
    })
  } else {
    methods += `${snakeCase(interfaceJson.outputs[0].name)} `
  }
  methods += `= await ${functionName}_async(`

  interfaceJson.inputs.forEach((input) => {
    methods += `self.model.inputs['${snakeCase(input.name)}'], `
  })
  methods += '**self.model.options)\n'

  methods += `            t1 = js.performance.now()
            js.globalThis.notify("${functionName} successfully completed", f"in {t1 - t0} milliseconds.", "success", "rocket-fill")
${runOutput}
        except Exception as error:
            js.globalThis.notify("Error while running pipeline", str(error), "danger", "exclamation-octagon")
            raise error
        finally:
            self.run_button.loading = False
`
  result += methods
  result += `\n${functionName}_controller = ${functionNamePascalCase}Controller(load_sample_inputs)\n`

  const scriptPath = path.join(outputPath, `${functionName}_controller.py`)
  writeIfOverrideNotPresent(scriptPath, result, '#')

  const loadSampleInputsDefault = `load_sample_inputs = None

# async def load_sample_inputs(model):
    # Load sample inputs for the ${functionName} function.
    #
    # This function should load sample inputs:
    #
    # 1) In the provided model.
    # 2) Into the corresponding HTML input elements.
    #
    # Example for an input named \`example_input\`:
    #
    # example_input = 5
    # model.inputs["example_input"] = example_input
    # example_element = document.querySelector("#${functionName}-inputs [name=example-input]")
    # example_element.value = 5
    #
    # return model
`
  const loadSampleInputsPath = path.join(outputPath, `${functionName}_load_sample_inputs.py`)
  if (!fs.existsSync(loadSampleInputsPath)) {
    fs.writeFileSync(loadSampleInputsPath, loadSampleInputsDefault)
  }
  return scriptPath
}

export default interfaceFunctionPython
