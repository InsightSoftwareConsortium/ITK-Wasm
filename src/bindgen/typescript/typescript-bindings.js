import fs from 'fs-extra'
import path from 'path'

import wasmBinaryInterfaceJson from '../wasm-binary-interface-json.js'
import camelCase from '../camel-case.js'

import packageToBundleName from './package-to-bundle-name.js'
import writeIfOverrideNotPresent from '../write-if-override-not-present.js'

import interfaceFunctionsDemoHtml from './demo/interface-functions-demo-html.js'
import interfaceFunctionsDemoTypeScript from './demo/interface-functions-demo-typescript.js'
import githubCorner from './demo/github-corner.js'
import writeSupportFiles from './write-support-files.js'
import resultsModule from './results-module.js'
import optionsModule from './options-module.js'
import functionModule from './function-module.js'
import outputOptionsCheck from '../output-options-check.js'

// Array of types that will require an import from itk-wasm
function bindgenResource(filePath) {
  return path.join(path.dirname(import.meta.url.substring(7)), 'resources', filePath)
}

function typescriptBindings (outputDir, buildDir, wasmBinaries, options, forNode=false) {
  // index module
  let indexContent = ''
  const nodeTextKebab = forNode ? '-node' : ''
  const nodeTextCamel = forNode ? 'Node' : ''

  const srcOutputDir = path.join(outputDir, 'src')
  try {
    fs.mkdirSync(srcOutputDir, { recursive: true })
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }

  let readmeInterface = ''
  let readmePipelines = ''
  let demoFunctionsHtml = ''
  let pipelinesFunctionsTabs = ''
  let demoFunctionsTypeScript = ''

  const packageName = options.packageName
  const bundleName = packageToBundleName(packageName)
  const packageJsonPath = path.join(outputDir, 'package.json')
  if (!fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(bindgenResource('template.package.json')))
    packageJson.name = packageName
    packageJson.description = options.packageDescription
    packageJson.module = `./dist/bundles/${bundleName}.js`
    packageJson.exports['.'].browser = `./dist/bundles/${bundleName}.js`
    packageJson.exports['.'].node = `./dist/bundles/${bundleName}.node.js`
    packageJson.exports['.'].default = `./dist/bundles/${bundleName}.js`
    if (options.repository) {
      packageJson.repository = { 'type': 'git', 'url': options.repository }
    }
    if (options.packageVersion) {
      packageJson.version = options.packageVersion
    } else {
      packageJson.version = "0.1.0"
    }
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  } else {
    if (options.packageVersion) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath))
      packageJson.version = options.packageVersion
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    }
  }

  if (!forNode) {
    indexContent += "export * from './pipelines-base-url.js'\n"
    indexContent += "export * from './pipeline-worker-url.js'\n"
  }

  writeSupportFiles(outputDir, forNode, bindgenResource, packageName, options.packageDescription)

  wasmBinaries.forEach((wasmBinaryName) => {
    let wasmBinaryRelativePath = `${buildDir}/${wasmBinaryName}`
    if (!fs.existsSync(wasmBinaryRelativePath)) {
      wasmBinaryRelativePath = wasmBinaryName
    }
    const distPipelinesDir = path.join(outputDir, 'dist', 'pipelines')
    try {
      fs.mkdirSync(distPipelinesDir, { recursive: true })
    } catch (err) {
      if (err.code !== 'EEXIST') throw err
    }
    fs.copyFileSync(wasmBinaryRelativePath, path.join(distPipelinesDir, path.basename(wasmBinaryRelativePath)))
    fs.copyFileSync(`${wasmBinaryRelativePath}.zstd`, path.join(distPipelinesDir, `${path.basename(wasmBinaryRelativePath)}.zstd`))
    const prefix = wasmBinaryRelativePath.substring(0, wasmBinaryRelativePath.length-5)
    fs.copyFileSync(`${prefix}.js`, path.join(distPipelinesDir, `${path.basename(prefix)}.js`))
    fs.copyFileSync(`${prefix}.umd.js`, path.join(distPipelinesDir, `${path.basename(prefix)}.umd.js`))

    const { interfaceJson, parsedPath } = wasmBinaryInterfaceJson(outputDir, buildDir, wasmBinaryName)

    outputOptionsCheck(interfaceJson)

    const moduleKebabCase = parsedPath.name
    const moduleCamelCase = camelCase(parsedPath.name)
    const modulePascalCase = `${moduleCamelCase[0].toUpperCase()}${moduleCamelCase.substring(1)}`
    const functionName = camelCase(interfaceJson.name)

    const useCamelCase = true
    const functionDemoHtml = interfaceFunctionsDemoHtml(interfaceJson, functionName, useCamelCase)
    if (functionDemoHtml) {
      demoFunctionsHtml += functionDemoHtml
      pipelinesFunctionsTabs += `    <sl-tab slot="nav" panel="${functionName}-panel">${functionName}</sl-tab>\n`
      const demoTypeScriptOutputPath = path.join(outputDir, 'test', 'browser', 'demo-app')
      interfaceFunctionsDemoTypeScript(packageName, interfaceJson, demoTypeScriptOutputPath)
      demoFunctionsTypeScript += `import './${interfaceJson.name}-controller.js'\n`
    } else {
      pipelinesFunctionsTabs += `    <sl-tab slot="nav" panel="${functionName}-panel" disabled>${functionName}</sl-tab>\n`
    }

    readmeInterface += `  ${moduleCamelCase}${nodeTextCamel},\n`

    const resultsModuleFileName = `${moduleKebabCase}${nodeTextKebab}-result`
    const { readmeResult } = resultsModule(srcOutputDir, interfaceJson, forNode, modulePascalCase, nodeTextCamel, resultsModuleFileName)
    indexContent += `\n\nimport ${modulePascalCase}${nodeTextCamel}Result from './${resultsModuleFileName}.js'\n`
    indexContent += `export type { ${modulePascalCase}${nodeTextCamel}Result }\n\n`

    const filteredParameters = interfaceJson.parameters.filter(p => { return p.name !== 'memory-io' && p.name !== 'version'})
    const haveOutputFile = interfaceJson.outputs.some(o => { return o.type.includes('FILE') })
    const haveOptions = !!filteredParameters.length || haveOutputFile

    const { readmeOptions } = optionsModule(srcOutputDir, interfaceJson, modulePascalCase, nodeTextCamel, moduleKebabCase, haveOptions)
    if (haveOptions) {
      indexContent += `import ${modulePascalCase}Options from './${moduleKebabCase}-options.js'\n`
      indexContent += `export type { ${modulePascalCase}Options }\n\n`
    }

    const { readmeFunction } = functionModule(srcOutputDir, forNode, interfaceJson, modulePascalCase, moduleKebabCase, moduleCamelCase, nodeTextCamel, nodeTextKebab, haveOptions)

    indexContent += `import ${moduleCamelCase}${nodeTextCamel} from './${moduleKebabCase}${nodeTextKebab}.js'\n`
    indexContent += `export { ${moduleCamelCase}${nodeTextCamel} }\n`

    readmePipelines += readmeFunction
    readmePipelines += readmeOptions
    readmePipelines += readmeResult
  })

  readmeInterface += `  setPipelinesBaseUrl,
  getPipelinesBaseUrl,
  setPipelineWorkerUrl,
  getPipelineWorkerUrl,
`
  readmeInterface += `} from "${packageName}"\n\`\`\`\n`
  readmeInterface += readmePipelines

  const itkConfigPath = path.join(outputDir, 'src', 'itkConfig.js')
  if (!fs.existsSync(itkConfigPath)) {
    fs.copyFileSync(bindgenResource('itkConfig.js'), itkConfigPath)
  }

  const indexPath = path.join(srcOutputDir, `index${nodeTextKebab}.ts`)
  writeIfOverrideNotPresent(indexPath, indexContent)

  if (!forNode) {
    const demoIndexPath = path.join(outputDir, 'test', 'browser', 'demo-app', 'index.html')
    let demoIndexContent = fs.readFileSync(bindgenResource(path.join('demo-app', 'index.html')), { encoding: 'utf8', flag: 'r' })
const shoelaceScript = `
<script type="module">
  import '@shoelace-style/shoelace/dist/themes/light.css';
  import '@shoelace-style/shoelace/dist/themes/dark.css';
  import '@shoelace-style/shoelace/dist/components/button/button.js';
  import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
  import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
  import '@shoelace-style/shoelace/dist/components/tab/tab.js';
  import '@shoelace-style/shoelace/dist/components/input/input.js';
  import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
  import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
  import '@shoelace-style/shoelace/dist/components/alert/alert.js';
  import '@shoelace-style/shoelace/dist/components/icon/icon.js';
  import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
  import '@shoelace-style/shoelace/dist/components/divider/divider.js';
  import '@shoelace-style/shoelace/dist/components/details/details.js';
  import '@shoelace-style/shoelace/dist/components/popup/popup.js';
  import '@shoelace-style/shoelace/dist/components/tag/tag.js';
  import '@shoelace-style/shoelace/dist/components/select/select.js';
  import '@shoelace-style/shoelace/dist/components/option/option.js';
  import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

  import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path';
  setBasePath('/');

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // dark mode
    document.documentElement.classList.add('sl-theme-dark');
  }
</script>
`
    demoIndexContent = demoIndexContent.replaceAll('@shoelaceScript@', shoelaceScript)
    const packageNameLanguageLogos = `${packageName}<img src="./javascript-logo.svg" alt="JavaScript logo" class="language-logo"/><img src="./typescript-logo.svg" alt="TypeScript logo" class="language-logo"/>`
    demoIndexContent = demoIndexContent.replaceAll('@bindgenPackageName@', packageNameLanguageLogos)
    demoIndexContent = demoIndexContent.replaceAll('@bindgenPackageDescription@', options.packageDescription)
    const bindgenGitHubCorner = githubCorner(options)
    demoIndexContent = demoIndexContent.replaceAll('@bindgenGitHubCorner@', bindgenGitHubCorner)
    demoIndexContent = demoIndexContent.replaceAll('@bindgenFunctions@', demoFunctionsHtml)
    demoIndexContent = demoIndexContent.replaceAll('@pipelinesFunctionsTabs@', pipelinesFunctionsTabs)
const indexModule = `
<script type="module" src="./index.ts"></script>
`
    demoIndexContent = demoIndexContent.replaceAll('@indexModule@', indexModule)
    writeIfOverrideNotPresent(demoIndexPath, demoIndexContent, '<!--')

    const demoTypeScriptPath = path.join(outputDir, 'test', 'browser', 'demo-app', 'index.ts')
    let demoTypeScriptContent = fs.readFileSync(bindgenResource(path.join('demo-app', 'index.ts')), { encoding: 'utf8', flag: 'r' })
    demoTypeScriptContent = demoTypeScriptContent.replaceAll('@bindgenBundleName@', bundleName)
    demoTypeScriptContent = demoTypeScriptContent.replaceAll('@bindgenBundleNameCamelCase@', camelCase(bundleName))
    demoTypeScriptContent = demoTypeScriptContent.replaceAll('@bindgenFunctionLogic@', demoFunctionsTypeScript)
    writeIfOverrideNotPresent(demoTypeScriptPath, demoTypeScriptContent)
  }

  return readmeInterface
}

export default typescriptBindings