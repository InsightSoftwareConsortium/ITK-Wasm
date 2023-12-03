import interfaceJsonTypeToInterfaceType from "../interface-json-type-to-interface-type.js"

function functionModuleImports(interfaceJson) {
  let moduleContent = ""
  const usedInterfaceTypes = new Set()
  const pipelineComponents = ['inputs', 'outputs', 'parameters']
  pipelineComponents.forEach((pipelineComponent) => {
    interfaceJson[pipelineComponent].forEach((value) => {
      if (interfaceJsonTypeToInterfaceType.has(value.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(value.type)
        if (interfaceType !== 'JsonCompatible') {
          usedInterfaceTypes.add(interfaceType)
        }
      }
    })
  })
  usedInterfaceTypes.forEach((interfaceType) => {
    moduleContent += `\n    ${interfaceType},`
  })
  moduleContent += "\n)\n\n"

  return moduleContent
}

export default functionModuleImports
