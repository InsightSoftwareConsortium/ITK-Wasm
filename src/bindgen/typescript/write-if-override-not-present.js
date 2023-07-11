import fs from 'fs-extra'

function writeIfOverrideNotPresent(modulePath, content) {
  const prefix = '// Generated file. To retain edits, remove this comment.\n\n'
  if (!fs.existsSync(modulePath)) {
    fs.writeFileSync(modulePath, prefix + content)
    return
  }
  const firstLine = fs.readFileSync(modulePath, 'utf-8').split('\n')[0]
  if (firstLine.includes('Generated file')) {
    fs.writeFileSync(modulePath, prefix + content)
  }
}

export default writeIfOverrideNotPresent