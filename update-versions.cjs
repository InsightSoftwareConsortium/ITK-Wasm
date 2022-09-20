const fs = require('fs')

const version = process.argv[2]
if (!version) {
  console.error(`usage: ${__filename} VERSION`)
  process.exit(1)
}

function rewriteVersion(filename) {
  if (!fs.existsSync(filename)) {
    return
  }
  const lines = fs.readFileSync(filename, { encoding: 'utf-8' }).split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (lines[i].startsWith('const version = ')) {
      lines[i] = `const version = '${version}';`
    }
  }

  fs.writeFileSync(filename, lines.join('\n'))
}

rewriteVersion('dist/core/index.js')
rewriteVersion('dist/itkConfigDevelopment.js')
