import fs from 'fs'

import localPathRelativeToModule from './localPathRelativeToModule.js'

function findLocalPolyDataIOPath (): string {
  const buildPath = localPathRelativeToModule(import.meta.url, '../../polydata-io')
  if (fs.existsSync(buildPath)) {
    return buildPath
  }
  const packagePath = localPathRelativeToModule(import.meta.url, '../../../../polydata-io')
  if (fs.existsSync(packagePath)) {
    return packagePath
  }
  throw Error("Cannot find path to itk polydata IO's. Try: npm install --save itk-polydata-io")
}

export default findLocalPolyDataIOPath
