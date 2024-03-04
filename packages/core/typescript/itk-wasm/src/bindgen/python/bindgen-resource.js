import path from 'path'
import { fileURLToPath } from 'url'

function bindgenResource(filePath) {
  const currentScriptPath = path.dirname(fileURLToPath(import.meta.url))
  const resourcesDir = path.join(currentScriptPath, 'resources')
  const resourceFilePath = path.join(
    resourcesDir,
    filePath.split('/').join(path.sep)
  )
  return resourceFilePath
}

export default bindgenResource
