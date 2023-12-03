import interfaceJsonTypeToInterfaceType from "../../interface-json-type-to-interface-type.js"

function ioPackagesNeeded(interfaceJson) {
  let needReadMesh = false
  let needReadImage = false
  const pipelineComponents = ['inputs', 'parameters']
  pipelineComponents.forEach((pipelineComponent) => {
    needReadMesh = needReadMesh || interfaceJson[pipelineComponent].filter((value) => interfaceJsonTypeToInterfaceType.get(value.type) === 'Mesh').length > 0
    needReadImage = needReadImage || interfaceJson[pipelineComponent].filter((value) => interfaceJsonTypeToInterfaceType.get(value.type) === 'Image').length > 0
  })
  const needWriteMesh = interfaceJson.outputs.filter((value) => interfaceJsonTypeToInterfaceType.get(value.type) === 'Mesh').length > 0
  const needWriteImage = interfaceJson.outputs.filter((value) => interfaceJsonTypeToInterfaceType.get(value.type) === 'Image').length > 0
  return { needReadImage, needReadMesh, needWriteImage, needWriteMesh}
}

export default ioPackagesNeeded
