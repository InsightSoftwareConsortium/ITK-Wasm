import fs from 'fs-extra'
import path from 'path'

import writeIfOverrideNotPresent from '../write-if-override-not-present.js'

function writeSupportFiles(
  outputDir,
  forNode,
  bindgenResource,
  packageName,
  packageDescription
) {
  if (!forNode) {
    try {
      fs.mkdirSync(path.join(outputDir, 'build'), { recursive: true })
    } catch (err) {
      if (err.code !== 'EEXIST') throw err
    }
    try {
      fs.mkdirSync(path.join(outputDir, 'test', 'browser', 'demo-app'), {
        recursive: true
      })
    } catch (err) {
      if (err.code !== 'EEXIST') throw err
    }

    const pipelinesBaseUrlPath = path.join(
      outputDir,
      'src',
      'pipelines-base-url.ts'
    )
    if (!fs.existsSync(pipelinesBaseUrlPath)) {
      fs.copyFileSync(
        bindgenResource('pipelines-base-url.ts'),
        pipelinesBaseUrlPath
      )
      let pipelinesBaseUrlPathContent = fs.readFileSync(
        bindgenResource('pipelines-base-url.ts'),
        { encoding: 'utf8', flag: 'r' }
      )
      pipelinesBaseUrlPathContent = pipelinesBaseUrlPathContent.replaceAll(
        '<bindgenPackageName>',
        packageName
      )
      writeIfOverrideNotPresent(
        pipelinesBaseUrlPath,
        pipelinesBaseUrlPathContent
      )
    }
    const pipelineWorkerUrlPath = path.join(
      outputDir,
      'src',
      'pipeline-worker-url.ts'
    )
    if (!fs.existsSync(pipelineWorkerUrlPath)) {
      let pipelineWorkerUrlPathContent = fs.readFileSync(
        bindgenResource('pipeline-worker-url.ts'),
        { encoding: 'utf8', flag: 'r' }
      )
      pipelineWorkerUrlPathContent = pipelineWorkerUrlPathContent.replaceAll(
        '<bindgenPackageName>',
        packageName
      )
      writeIfOverrideNotPresent(
        pipelineWorkerUrlPath,
        pipelineWorkerUrlPathContent
      )
    }
    const defaultWebWorkerPath = path.join(
      outputDir,
      'src',
      'default-web-worker.ts'
    )
    if (!fs.existsSync(defaultWebWorkerPath)) {
      let defaultWebWorkerContent = fs.readFileSync(
        bindgenResource('default-web-worker.ts'),
        { encoding: 'utf8', flag: 'r' }
      )
      writeIfOverrideNotPresent(defaultWebWorkerPath, defaultWebWorkerContent)
    }

    const indexWorkerEmbeddedPath = path.join(
      outputDir,
      'src',
      'index-worker-embedded.ts'
    )
    const indexWorkerEmbeddedContent = fs.readFileSync(
      bindgenResource('index-worker-embedded.ts'),
      { encoding: 'utf8', flag: 'r' }
    )
    writeIfOverrideNotPresent(
      indexWorkerEmbeddedPath,
      indexWorkerEmbeddedContent
    )
    const indexWorkerEmbeddedMinPath = path.join(
      outputDir,
      'src',
      'index-worker-embedded.min.ts'
    )
    const indexWorkerEmbeddedMinContent = fs.readFileSync(
      bindgenResource('index-worker-embedded.min.ts'),
      { encoding: 'utf8', flag: 'r' }
    )
    writeIfOverrideNotPresent(
      indexWorkerEmbeddedMinPath,
      indexWorkerEmbeddedMinContent
    )

    const npmIgnorePath = path.join(outputDir, '.npmignore')
    if (!fs.existsSync(npmIgnorePath)) {
      fs.copyFileSync(bindgenResource('npmignore.bindgen'), npmIgnorePath)
    }

    const docsIndexPath = path.join(outputDir, 'index.html')
    if (!fs.existsSync(docsIndexPath)) {
      let docsIndexContent = fs.readFileSync(bindgenResource('index.html'), {
        encoding: 'utf8',
        flag: 'r'
      })
      docsIndexContent = docsIndexContent.replaceAll(
        '<bindgenPackageName>',
        packageName
      )
      docsIndexContent = docsIndexContent.replaceAll(
        '<bindgenPackageDescription>',
        packageDescription
      )
      fs.writeFileSync(docsIndexPath, docsIndexContent)
      fs.copyFileSync(
        bindgenResource('.nojekyll'),
        path.join(outputDir, '.nojekll')
      )
    }

    const logoPath = path.join(
      outputDir,
      'test',
      'browser',
      'demo-app',
      'logo.svg'
    )
    if (!fs.existsSync(logoPath)) {
      fs.copyFileSync(
        bindgenResource(path.join('demo-app', 'logo.svg')),
        logoPath
      )
      const jsLogoPath = path.join(
        outputDir,
        'test',
        'browser',
        'demo-app',
        'javascript-logo.svg'
      )
      fs.copyFileSync(
        bindgenResource(path.join('demo-app', 'javascript-logo.svg')),
        jsLogoPath
      )
      const tsLogoPath = path.join(
        outputDir,
        'test',
        'browser',
        'demo-app',
        'typescript-logo.svg'
      )
      fs.copyFileSync(
        bindgenResource(path.join('demo-app', 'typescript-logo.svg')),
        tsLogoPath
      )
    }

    const demoStylePath = path.join(
      outputDir,
      'test',
      'browser',
      'demo-app',
      'style.css'
    )
    if (!fs.existsSync(demoStylePath)) {
      fs.copyFileSync(
        bindgenResource(path.join('demo-app', 'style.css')),
        demoStylePath
      )
    }

    const viteConfigPath = path.join(outputDir, 'vite.config.js')
    if (!fs.existsSync(viteConfigPath)) {
      fs.copyFileSync(bindgenResource('vite.config.js'), viteConfigPath)
    }
  }

  const tsConfigPath = path.join(outputDir, 'tsconfig.json')
  if (!fs.existsSync(tsConfigPath)) {
    fs.copyFileSync(bindgenResource('tsconfig.json'), tsConfigPath)
  }
}

export default writeSupportFiles
