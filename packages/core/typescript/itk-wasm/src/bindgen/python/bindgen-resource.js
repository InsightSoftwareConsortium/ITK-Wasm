import path from 'path'

function bindgenResource(filePath) {
  return path.join(path.dirname(import.meta.url.substring(7)), 'resources', filePath)
}

export default bindgenResource
