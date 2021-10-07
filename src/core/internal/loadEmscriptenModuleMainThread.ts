import axios from 'axios'

import EmscriptenModule from '../EmscriptenModule.js'

function loadEmscriptenModuleMainThread(moduleRelativePathOrURL: string | URL, moduleType: 'image-io' | 'mesh-io' | 'pipeline', itkModulesPath: string ): Promise<EmscriptenModule> {
  let modulePrefix: string = 'unknown'
  if (typeof moduleRelativePathOrURL !== 'string') {
    modulePrefix = moduleRelativePathOrURL.href
  } else {
    modulePrefix = `${itkModulesPath}/${moduleType}/${moduleRelativePathOrURL}`
  }
  if (modulePrefix.endsWith('.js')) {
    modulePrefix = modulePrefix.substring(0, modulePrefix.length - 3)
  }
  if (modulePrefix.endsWith('.wasm')) {
    modulePrefix = modulePrefix.substring(0, modulePrefix.length - 5)
  }
  console.log(`modulePrefix: ${modulePrefix}`)
  return new Promise(function (resolve, reject) {
    const s = document.createElement('script')
    s.src = `${modulePrefix}.js`
    s.onload = resolve
    s.onerror = reject
    s.type = 'module'
    document.head.appendChild(s)
  }).then(async () => {
    const moduleBaseName: string = modulePrefix.replace(/.*\//, '')
    const wasmBinaryPath = `${modulePrefix}.wasm`
    const response = await axios.get(wasmBinaryPath, { responseType: 'arraybuffer' })
    const wasmBinary = response.data
    // @ts-ignore: error TS7015: Element implicitly has an 'any' type
      // because index expression is not of type 'number'.
    return Promise.resolve(window[moduleBaseName]({ wasmBinary }))
  })
}

export default loadEmscriptenModuleMainThread
