import * as <bindgenPackageNameCamelCase> from '../../dist/bundles/<bindgenPackageName>.js'
<bindgenPackageNameCamelCase>.setPipelinesBaseUrl('/pipelines')

const packageFunctions = []
for (const [key, val] of Object.entries(<bindgenPackageNameCamelCase>)) {
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
console.log(<bindgenPackageNameCamelCase>)
