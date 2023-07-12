import camelCase from "../../camel-case.js"

function inputParametersDemoTypeScript(functionName, indent, parameter, required) {
  let result = ''
  const contextProperty = required ? 'inputs' : 'options'
  const parameterName = camelCase(parameter.name)
  const inputIdentifier = `${parameterName}Element`
  switch(parameter.type) {
    case 'INPUT_TEXT_FILE:FILE':
    case 'INPUT_TEXT_STREAM':
      result += `${indent}const ${inputIdentifier} = document.querySelector('#${functionName}Inputs input[name=${parameter.name}-file]')\n`
      result += `${indent}${inputIdentifier}.addEventListener('change', (event) => {\n`
      result += `${indent}${indent}const dataTransfer = event.dataTransfer\n`
      result += `${indent}${indent}const files = event.target.files || dataTransfer.files\n\n`
      result += `${indent}${indent}files[0].arrayBuffer().then((arrayBuffer) => {\n`
      result += `${indent}${indent}${indent}context.${contextProperty}.set("${parameterName}", new TextDecoder().decode(new Uint8Array(arrayBuffer)))\n`
      result += `${indent}${indent}${indent}const input = document.querySelector("#${functionName}Inputs sl-input[name=${parameter.name}]")\n`
      result += `${indent}${indent}${indent}input.value = context.${contextProperty}.get("${parameterName}").substring(0, 50) + ' ...'\n`
      result += `${indent}${indent}})\n`
      result += `${indent}})\n\n`
      break
    case 'INPUT_BINARY_FILE:FILE':
    case 'INPUT_BINARY_STREAM':
      result += `${indent}const ${inputIdentifier} = document.querySelector('#${functionName}Inputs input[name=${parameter.name}-file]')\n`
      result += `${indent}${inputIdentifier}.addEventListener('change', (event) => {\n`
      result += `${indent}${indent}const dataTransfer = event.dataTransfer\n`
      result += `${indent}${indent}const files = event.target.files || dataTransfer.files\n\n`
      result += `${indent}${indent}files[0].arrayBuffer().then((arrayBuffer) => {\n`
      result += `${indent}${indent}${indent}context.${contextProperty}.set("${parameterName}", new Uint8Array(arrayBuffer))\n`
      result += `${indent}${indent}${indent}const input = document.querySelector("#${functionName}Inputs sl-input[name=${parameter.name}]")\n`
      result += `${indent}${indent}${indent}input.value = context.${contextProperty}.get("${parameterName}").toString().substring(0, 50) + ' ...'\n`
      result += `${indent}${indent}})\n`
      result += `${indent}})\n\n`
      break
    case 'TEXT':
      result += `${indent}const ${inputIdentifier} = document.querySelector('#${functionName}Inputs sl-input[name=${parameter.name}]')\n`
      result += `${indent}${inputIdentifier}.addEventListener('sl-change', (event) => {\n`
      result += `${indent}${indent}context.${contextProperty}.set("${parameterName}", ${inputIdentifier}.value)\n`
      result += `${indent}})\n\n`
      break
    case 'BOOL':
      result += `${indent}const ${inputIdentifier} = document.querySelector('#${functionName}Inputs sl-checkbox[name=${parameter.name}]')\n`
      result += `${indent}${inputIdentifier}.addEventListener('sl-change', (event) => {\n`
      result += `${indent}${indent}context.${contextProperty}.set("${parameterName}", ${inputIdentifier}.checked)\n`
      result += `${indent}})\n\n`
      break
    case 'INT':
    case 'UINT':
      result += `${indent}const ${inputIdentifier} = document.querySelector('#${functionName}Inputs sl-input[name=${parameter.name}]')\n`
      result += `${indent}${inputIdentifier}.addEventListener('sl-change', (event) => {\n`
      result += `${indent}${indent}context.${contextProperty}.set("${parameterName}", parseInt(${inputIdentifier}.value))\n`
      result += `${indent}})\n\n`
      break
    default:
      console.error(`Unexpected interface type: ${parameter.type}`)
      process.exit(1)
  }
  return result
}

export default inputParametersDemoTypeScript