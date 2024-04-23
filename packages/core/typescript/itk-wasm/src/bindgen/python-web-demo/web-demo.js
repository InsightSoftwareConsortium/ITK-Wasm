import fs from 'fs-extra'
import path from 'path'

import writeIfOverrideNotPresent from '../write-if-override-not-present.js'
import snakeCase from '../snake-case.js'
import wasmBinaryInterfaceJson from '../wasm-binary-interface-json.js'
import interfaceFunctionsDemoHtml from '../typescript/demo/interface-functions-demo-html.js'
import interfaceFunctionPython from './interface-function-python.js'
import githubCorner from '../typescript/demo/github-corner.js'

function typescriptBindgenResource(filePath) {
  return path.join(path.dirname(import.meta.url.substring(7)), '..', 'typescript', 'resources', filePath)
}

function webDemo (outputDir, buildDir, emscriptenWasmBinaries, options) {
  let demoFunctionsHtml = ''
  let pipelinesFunctionsTabs = ''

  const packageName = options.packageName

  const demoStylePath = path.join(outputDir, 'style.css')
  if (!fs.existsSync(demoStylePath)) {
    fs.copyFileSync(typescriptBindgenResource(path.join('demo-app', 'style.css')), demoStylePath)
  }
  
  const demoAppPackage = path.join(path.dirname(import.meta.url.substring(7)), '..', '..', '..', '..', 'demo-app')
  const utilitiesHome =  path.joing(demoAppPackage, 'src', 'utilities.js')
  const demoJsUtilities = path.join(outputDir, 'utilities.js')
  writeIfOverrideNotPresent(demoJsUtilities, fs.readFileSync(utilitiesHome), 'utf8')


  const logoPath = path.join(outputDir, 'logo.svg')
  if (!fs.existsSync(logoPath)) {
    fs.copyFileSync(typescriptBindgenResource(path.join('demo-app', 'logo.svg')), logoPath)
    const pyLogoPath = path.join(outputDir, 'python-logo.svg')
    fs.copyFileSync(typescriptBindgenResource(path.join('demo-app', 'python-logo.svg')), pyLogoPath)
  }

  let demoFunctionsIndexJsDisableInputs = ''
  let demoFunctionsIndexJsLoadScripts = ''
  let demoFunctionsIndexJsEnableInputs = ''
  emscriptenWasmBinaries.forEach((wasmBinaryName) => {
    let wasmBinaryRelativePath = `${buildDir}/${wasmBinaryName}`
    if (!fs.existsSync(wasmBinaryRelativePath)) {
      wasmBinaryRelativePath = wasmBinaryName
    }

    const { interfaceJson } = wasmBinaryInterfaceJson(outputDir, buildDir, wasmBinaryName)

    const functionName = snakeCase(interfaceJson.name)

    demoFunctionsIndexJsDisableInputs += `  globalThis.disableInputs('${functionName}-inputs')\n`
    demoFunctionsIndexJsLoadScripts += `  await savePythonScript(pyodide, './${functionName}_load_sample_inputs.py')\n`
    demoFunctionsIndexJsLoadScripts += `  await pyodide.runPythonAsync(await (await fetch("./${functionName}_controller.py")).text())\n`
    demoFunctionsIndexJsEnableInputs += `  globalThis.enableInputs('${functionName}-inputs')\n`

    const useCamelCase = false
    const functionDemoHtml = interfaceFunctionsDemoHtml(interfaceJson, functionName, useCamelCase)
    if (functionDemoHtml) {
      demoFunctionsHtml += functionDemoHtml
      pipelinesFunctionsTabs += `    <sl-tab slot="nav" panel="${functionName}-panel">${functionName}</sl-tab>\n`
      // Todo: implement interfaceFunctionPython
      interfaceFunctionPython(packageName, interfaceJson, outputDir)
    } else {
      pipelinesFunctionsTabs += `    <sl-tab slot="nav" panel="${functionName}-panel" disabled>${functionName}</sl-tab>\n`
    }
  })

  const demoFunctionsIndexJsContent = `  function basename(path) {
    return path.replace(/.*\\//, '');
  }

  async function savePythonScript(pyodide, scriptPath) {
    await pyodide.runPythonAsync(\`
      from pyodide.http import pyfetch
      from pathlib import Path
      response = await pyfetch("\${scriptPath}")
      with open(Path("\${scriptPath}").name, "wb") as f:
          f.write(await response.bytes())
  \`)
    pyodide.pyimport(basename(scriptPath).replace('.py', ''))
  }

  async function main(){
  ${demoFunctionsIndexJsDisableInputs}
    const pyodide = await loadPyodide()
    await pyodide.loadPackage("numpy")
    await pyodide.loadPackage("micropip")
    const micropip = pyodide.pyimport("micropip")
    await micropip.install("${packageName}")

  ${demoFunctionsIndexJsLoadScripts}
  ${demoFunctionsIndexJsEnableInputs}
    globalThis.pyodide = pyodide
    return pyodide
  }
  const pyodideReady = main()
`

  const demoIndexPath = path.join(outputDir, 'index.html')
  let demoIndexContent = fs.readFileSync(typescriptBindgenResource(path.join('demo-app', 'index.html')), { encoding: 'utf8', flag: 'r' })
const shoelaceScript = `
<link
  rel="stylesheet"
  media="(prefers-color-scheme:light)"
  href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.5.2/cdn/themes/light.css"
/>
<link
  rel="stylesheet"
  media="(prefers-color-scheme:dark)"
  href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.5.2/cdn/themes/dark.css"
onload="document.documentElement.classList.add('sl-theme-dark');"
/>
<script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.5.2/cdn/shoelace-autoloader.js"></script>

<script src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"></script>
`
  demoIndexContent = demoIndexContent.replaceAll('@shoelaceScript@', shoelaceScript)
  const packageNameLanguageLogos = `${packageName}<img src="./python-logo.svg" alt="Python logo" class="language-logo"/>`
  demoIndexContent = demoIndexContent.replaceAll('@bindgenPackageName@', packageNameLanguageLogos)
  demoIndexContent = demoIndexContent.replaceAll('@bindgenPackageDescription@', options.packageDescription)
  const bindgenGitHubCorner = githubCorner(options)
  demoIndexContent = demoIndexContent.replaceAll('@bindgenGitHubCorner@', bindgenGitHubCorner)
  demoIndexContent = demoIndexContent.replaceAll('@bindgenFunctions@', demoFunctionsHtml)
  demoIndexContent = demoIndexContent.replaceAll('@pipelinesFunctionsTabs@', pipelinesFunctionsTabs)

const indexModule = `
<script type="module">
${demoFunctionsIndexJsContent}
</script>
`
  demoIndexContent = demoIndexContent.replaceAll('@indexModule@', indexModule)
  writeIfOverrideNotPresent(demoIndexPath, demoIndexContent, '<!--')
}

export default webDemo
