import path from 'path'
import fs from 'fs-extra'
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'

const currentScriptPath = path.dirname(fileURLToPath(import.meta.url))

function wasmBinaryInterfaceJson(outputDir, buildDir, wasmBinaryName) {
  let wasmBinaryRelativePath = `${buildDir}/${wasmBinaryName}`
  if (!fs.existsSync(wasmBinaryRelativePath)) {
    wasmBinaryRelativePath = wasmBinaryName
  }

  let interfaceJson = ''
  const parsedPath = path.parse(path.resolve(wasmBinaryRelativePath))
  if (parsedPath.name.endsWith('wasi')) {
    const runPipelineScriptPath = path.join(
      currentScriptPath,
      'interface-json-node-wasi.js'
    )
    const runPipelineRun = spawnSync(
      'node',
      [
        '--experimental-wasi-unstable-preview1',
        '--no-warnings',
        runPipelineScriptPath,
        wasmBinaryRelativePath
      ],
      {
        env: process.env,
        stdio: ['pipe', 'pipe', 'pipe']
      }
    )
    try {
      interfaceJson = JSON.parse(runPipelineRun.stdout.toString())
    } catch (error) {
      if (runPipelineRun.status !== 0) {
        console.error(runPipelineRun.stderr.toString())
        console.error(runPipelineRun.error)
        process.exit(runPipelineRun.status)
      }
    }
  } else {
    const runPath = path.join(parsedPath.dir, parsedPath.name)
    const runPipelineScriptPath = path.join(
      currentScriptPath,
      'interface-json-node.js'
    )
    const runPipelineRun = spawnSync('node', [runPipelineScriptPath, runPath], {
      env: process.env,
      stdio: ['ignore', 'pipe', 'inherit']
    })
    if (runPipelineRun.status !== 0) {
      console.error(runPipelineRun.error)
      process.exit(runPipelineRun.status)
    }
    let interfaceString = new TextDecoder().decode(runPipelineRun.stdout)
    interfaceString = interfaceString.substring(
      interfaceString.indexOf('{'),
      interfaceString.lastIndexOf('}') + 1
    )
    interfaceJson = JSON.parse(interfaceString)
  }

  return { interfaceJson, parsedPath }
}

export default wasmBinaryInterfaceJson
