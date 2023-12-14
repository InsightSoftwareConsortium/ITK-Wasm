import path from 'path'

function packageToBundleName(packageName) {
  return path.basename(packageName.replace('@', '-'))
}

export default packageToBundleName
