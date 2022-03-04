#!/usr/bin/env node

const path = require('path')
const fs = require('fs-extra')

mainPackageFile = fs.readFileSync(path.join('package.json'))
mainPackage = JSON.parse(mainPackageFile)
version = mainPackage.version

const packages = ['image-io', 'mesh-io']
packages.forEach((packageName) => {
  const templateFile = fs.readFileSync(path.join(__dirname, `${packageName}.package.json.in`))
  const template = JSON.parse(templateFile)
  template.version = version
  template.dependencies['itk-wasm'] = version
  fs.writeFileSync(path.join('dist', packageName, 'package.json'), JSON.stringify(template))
  readmeFile = path.join(__dirname, `README.${packageName}.md`)
  fs.copyFileSync(readmeFile, path.join('dist', packageName, 'README.md'))
})
