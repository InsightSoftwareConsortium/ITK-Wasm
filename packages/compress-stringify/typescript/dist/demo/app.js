import * as itkCompressStringify from '../itk-compress-stringify.js'
console.log('demo stuff')

const packageFunctions = []
for (const [key, val] of Object.entries(itkCompressStringify)) {
  if (typeof val == 'function') {
    packageFunctions.push(key)
  }
}

const pipelineFunctionsList = document.getElementById('pipeline-functions-list')
pipelineFunctionsList.innerHTML = `
<li>
  ${packageFunctions.join('</li>\n<li>')}
</li>
`
console.log(packageFunctions)
console.log(itkCompressStringify)
