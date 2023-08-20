import snakeCase from "../snake-case.js"

function inputParametersPython(functionName, indent, parameter, required) {
  let initResult = ''
  let methodResult = ''
  const modelProperty = required ? 'inputs' : 'options'
  const parameterName = snakeCase(parameter.name)
  const inputIdentifier = `${parameterName}_element`
  switch (parameter.type) {
    case 'INPUT_TEXT_FILE':
    case 'INPUT_TEXT_FILE:FILE':
    case 'INPUT_TEXT_STREAM':
      initResult += `${indent}    ${inputIdentifier} = js.document.querySelector('#${functionName}-inputs input[name=${parameter.name}-file]')\n`
      initResult += `${indent}    add_event_listener(${inputIdentifier}, 'change', self.on_${parameterName}_change)\n\n`
      methodResult += `${indent}async def on_${parameterName}_change(self, event):\n`
      methodResult += `${indent}    files = event.target.files\n`
      methodResult += `${indent}    array_buffer = await files.item(0).arrayBuffer()\n`
      methodResult += `${indent}    ${parameterName}_str = array_buffer.to_string()\n`
      methodResult += `${indent}    self.model.${modelProperty}['${parameterName}'] = ${parameterName}_str\n`
      methodResult += `${indent}    ${parameterName}_element = js.document.getElementById("${functionName}-${parameterName}-details")\n`
      methodResult += `${indent}    ${parameterName}_element.innerHTML = f"<pre>{${parameterName}_str[:50] + ' ...'}</pre>"\n\n`
      break
    case 'INPUT_BINARY_FILE':
    case 'INPUT_BINARY_FILE:FILE':
    case 'INPUT_BINARY_STREAM':
      initResult += `${indent}    ${inputIdentifier} = js.document.querySelector('#${functionName}-inputs input[name=${parameter.name}-file]')\n`
      initResult += `${indent}    add_event_listener(${inputIdentifier}, 'change', self.on_${parameterName}_change)\n\n`
      methodResult += `${indent}async def on_${parameterName}_change(self, event):\n`
      methodResult += `${indent}    files = event.target.files\n`
      methodResult += `${indent}    array_buffer = await files.item(0).arrayBuffer()\n`
      methodResult += `${indent}    ${parameterName}_bytes = array_buffer.to_bytes()\n`
      methodResult += `${indent}    self.model.${modelProperty}['${parameterName}'] = ${parameterName}_bytes\n`
      methodResult += `${indent}    ${parameterName}_element = js.document.getElementById("#${functionName}-${parameterName}-details")\n`
      methodResult += `${indent}    ${parameterName}_element.innerHTML = f"<pre>{str(np.frombuffer(${parameterName}_bytes[:50], dtype=np.uint8)) + ' ...'}</pre>"\n\n`
      break
    case 'TEXT':
      initResult += `${indent}    ${inputIdentifier} = js.document.querySelector('#${functionName}-inputs sl-input[name=${parameter.name}]')\n`
      initResult += `${indent}    self.${inputIdentifier} = ${inputIdentifier}\n`
      initResult += `${indent}    add_event_listener(${inputIdentifier}, 'sl-change', self.on_${parameterName}_change)\n\n`
      methodResult += `${indent}def on_${parameterName}_change(self, event):\n`
      methodResult += `${indent}    self.model.${modelProperty}['${parameterName}'] = self.${inputIdentifier}.value\n\n`
      break
    case 'BOOL':
      initResult += `${indent}    ${inputIdentifier} = js.document.querySelector('#${functionName}-inputs sl-checkbox[name=${parameter.name}]')\n`
      initResult += `${indent}    self.${inputIdentifier} = ${inputIdentifier}\n`
      initResult += `${indent}    add_event_listener(${inputIdentifier}, 'sl-change', self.on_${parameterName}_change)\n\n`
      methodResult += `${indent}def on_${parameterName}_change(self, event):\n`
      methodResult += `${indent}    self.model.${modelProperty}['${parameterName}'] = self.${inputIdentifier}.checked\n\n`
      break
    case 'INT':
    case 'UINT':
      initResult += `${indent}    ${inputIdentifier} = js.document.querySelector('#${functionName}-inputs sl-input[name=${parameter.name}]')\n`
      initResult += `${indent}    self.${inputIdentifier} = ${inputIdentifier}\n`
      initResult += `${indent}    add_event_listener(${inputIdentifier}, 'sl-change', self.on_${parameterName}_change)\n\n`
      methodResult += `${indent}def on_${parameterName}_change(self, event):\n`
      methodResult += `${indent}    self.model.${modelProperty}['${parameterName}'] = int(self.${inputIdentifier}.value)\n\n`
      break
    case 'INPUT_JSON':
      initResult += `${indent}    ${inputIdentifier} = js.document.querySelector('#${functionName}-inputs sl-input[name=${parameter.name}-file]')\n`
      initResult += `${indent}    self.${inputIdentifier} = ${inputIdentifier}\n`
      initResult += `${indent}    add_event_listener(${inputIdentifier}, 'sl-change', self.on_${parameterName}_change)\n\n`
      methodResult += `${indent}async def on_${parameterName}_change(self, event):\n`
      methodResult += `${indent}    files = event.target.files\n`
      methodResult += `${indent}    array_buffer = await files.item(0).arrayBuffer()\n`
      methodResult += `${indent}    ${parameterName}_str = array_buffer.to_string()\n`
      methodResult += `${indent}    ${parameterName}_value = json.loads(${parameterName}_str)\n`
      methodResult += `${indent}    self.model.${modelProperty}['${parameterName}'] = ${parameterName}_value\n`
      methodResult += `${indent}    ${parameterName}_element = js.document.getElementById("${functionName}-${parameterName}-details")\n`
      methodResult += `${indent}    ${parameterName}_element.innerHTML = f"<pre>{js.escapeHtml(js.JSON.stringify(${parameterName}_value), js.interfaceTypeJsonReplacer, 2)}}</pre>"\n`
      methodResult += `${indent}    ${parameterName}_element.disabled = False\n\n`
      break
    case 'INPUT_IMAGE':
      // todo
      result += `${indent}const ${inputIdentifier} = document.querySelector('#${functionName}Inputs input[name=${parameter.name}-file]')\n`
      result += `${indent}${inputIdentifier}.addEventListener('change', async (event) => {\n`
      result += `${indent}${indent}const dataTransfer = event.dataTransfer\n`
      result += `${indent}${indent}const files = event.target.files || dataTransfer.files\n\n`
      result += `${indent}${indent}const { image, webWorker } = await readImageFile(null, files[0])\n`
      result += `${indent}${indent}webWorker.terminate()\n`
      result += `${indent}${indent}model.${modelProperty}.set("${parameterName}", image)\n`
      result += `${indent}${indent}const details = document.getElementById("${functionName}-${parameter.name}-details")\n`
      result += `${indent}${indent}details.innerHTML = \`<pre>$\{globalThis.escapeHtml(JSON.stringify(image, globalThis.interfaceTypeJsonReplacer, 2))}</pre>\`\n`
      result += `${indent}${indent}details.disabled = false\n`
      result += `${indent}})\n\n`
      break
    case 'INPUT_MESH':
      // todo
      result += `${indent}const ${inputIdentifier} = document.querySelector('#${functionName}Inputs input[name=${parameter.name}-file]')\n`
      result += `${indent}${inputIdentifier}.addEventListener('change', async (event) => {\n`
      result += `${indent}${indent}const dataTransfer = event.dataTransfer\n`
      result += `${indent}${indent}const files = event.target.files || dataTransfer.files\n\n`
      result += `${indent}${indent}const { mesh, webWorker } = await readMeshFile(null, files[0])\n`
      result += `${indent}${indent}webWorker.terminate()\n`
      result += `${indent}${indent}model.${modelProperty}.set("${parameterName}", mesh)\n`
      result += `${indent}${indent}const details = document.getElementById("${functionName}-${parameter.name}-details")\n`
      result += `${indent}${indent}details.innerHTML = \`<pre>$\{globalThis.escapeHtml(JSON.stringify(mesh, globalThis.interfaceTypeJsonReplacer, 2))}</pre>\`\n`
      result += `${indent}${indent}details.disabled = false\n`
      result += `${indent}})\n\n`
      break
    default:
      console.error(`Unexpected interface type: ${parameter.type}`)
      process.exit(1)
  }
  return { init: initResult, method: methodResult }
}

export default inputParametersPython
