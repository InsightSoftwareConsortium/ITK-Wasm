import camelCase from "../../camel-case.js"

function outputDemoRunTypeScript(functionName, prefix, indent, parameter) {
  const parameterName = camelCase(parameter.name)
  let result = `\n${prefix}${indent}model.outputs.set("${parameterName}", ${parameterName})\n`

  switch(parameter.type) {
    case 'OUTPUT_TEXT_FILE':
    case 'OUTPUT_TEXT_FILE:FILE':
    case 'OUTPUT_TEXT_STREAM': {
      result += `${prefix}${indent}${parameterName}OutputDownload.variant = "success"\n`
      result += `${prefix}${indent}${parameterName}OutputDownload.disabled = false\n`
      result += `${prefix}${indent}const ${parameterName}Output = document.querySelector('#${functionName}Outputs sl-textarea[name=${parameter.name}]')\n`
      const textDataProp = parameter.type.includes('FILE') ? '.data' : ''
      result += `${prefix}${indent}${parameterName}Output.value = ${parameterName}${textDataProp}.substring(0, 1024).toString() + ' ...'\n`
      result += `${prefix}${indent}${parameterName}Output.disabled = false\n`
    }
      break
    case 'OUTPUT_BINARY_FILE':
    case 'OUTPUT_BINARY_FILE:FILE':
    case 'OUTPUT_BINARY_STREAM': {
      result += `${prefix}${indent}${parameterName}OutputDownload.variant = "success"\n`
      result += `${prefix}${indent}${parameterName}OutputDownload.disabled = false\n`
      result += `${prefix}${indent}const ${parameterName}Output = document.querySelector('#${functionName}Outputs sl-textarea[name=${parameter.name}]')\n`
      const binaryDataProp = parameter.type.includes('FILE') ? '.data' : ''
      result += `${prefix}${indent}${parameterName}Output.value = ${parameterName}${binaryDataProp}.subarray(0, 1024).toString() + ' ...'\n`
      result += `${prefix}${indent}${parameterName}Output.disabled = false\n`
    }
      break
    case 'OUTPUT_JSON':
      result += `${prefix}${indent}${parameterName}OutputDownload.variant = "success"\n`
      result += `${prefix}${indent}${parameterName}OutputDownload.disabled = false\n`
      result += `${indent}${indent}const ${parameterName}Details = document.getElementById("${parameter.name}-output")\n`
      result += `${indent}${indent}${parameterName}Details.innerHTML = \`<pre>$\{globalThis.escapeHtml(JSON.stringify(${parameterName}, globalThis.interfaceTypeJsonReplacer, 2))}</pre>\`\n`
      result += `${indent}${indent}${parameterName}Details.disabled = false\n`
      result += `${prefix}${indent}const ${parameterName}Output = document.querySelector('#${functionName}Outputs sl-details[name=${parameter.name}]')\n`
      break
    case 'OUTPUT_MESH':
      result += `${prefix}${indent}${parameterName}OutputDownload.variant = "success"\n`
      result += `${prefix}${indent}${parameterName}OutputDownload.disabled = false\n`
      result += `${indent}${indent}const ${parameterName}Details = document.getElementById("${parameter.name}-output")\n`
      result += `${indent}${indent}${parameterName}Details.innerHTML = \`<pre>$\{globalThis.escapeHtml(JSON.stringify(${parameterName}, globalThis.interfaceTypeJsonReplacer, 2))}</pre>\`\n`
      result += `${indent}${indent}${parameterName}Details.disabled = false\n`
      result += `${prefix}${indent}const ${parameterName}Output = document.querySelector('#${functionName}Outputs sl-details[name=${parameter.name}]')\n`
      break
    default:
      console.error(`Unexpected interface type: ${parameter.type}`)
      process.exit(1)
  }
  return result
}

export default outputDemoRunTypeScript
