const fs = require('fs')

let version = process.argv[2]
if (!version) {
  const packageString = fs.readFileSync('package.json', { encoding: 'utf-8' })
  const packageData = JSON.parse(packageString)
  version = packageData.version
}

function rewriteVersion(filename) {
  if (!fs.existsSync(filename)) {
    return
  }
  const lines = fs.readFileSync(filename, { encoding: 'utf-8' }).split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (lines[i].startsWith('const version = ')) {
      lines[i] = `const version = "${version}";`
    } else if (lines[i].startsWith('declare const version = ')){
      lines[i] = `declare const version = "${version}";`
    }
  }

  fs.writeFileSync(filename, lines.join('\n'))
}

rewriteVersion('src/version.ts')
rewriteVersion('dist/version.js')
rewriteVersion('dist/version.d.ts')
