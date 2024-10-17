import interfaceJsonTypeToInterfaceType from '../../interface-json-type-to-interface-type.js'

function ioPackagesNeeded(interfaceJson) {
  let needReadMesh = false
  let needReadImage = false
  let needReadPointSet = false
  const pipelineComponents = ['inputs', 'parameters']
  pipelineComponents.forEach((pipelineComponent) => {
    needReadMesh =
      needReadMesh ||
      interfaceJson[pipelineComponent].filter(
        (value) => interfaceJsonTypeToInterfaceType.get(value.type) === 'Mesh'
      ).length > 0
    needReadPointSet =
      needReadPointSet ||
      interfaceJson[pipelineComponent].filter(
        (value) =>
          interfaceJsonTypeToInterfaceType.get(value.type) === 'PointSet'
      ).length > 0
    needReadImage =
      needReadImage ||
      interfaceJson[pipelineComponent].filter(
        (value) => interfaceJsonTypeToInterfaceType.get(value.type) === 'Image'
      ).length > 0
  })
  const needWriteMesh =
    interfaceJson.outputs.filter(
      (value) => interfaceJsonTypeToInterfaceType.get(value.type) === 'Mesh'
    ).length > 0
  const needWritePointSet =
    interfaceJson.outputs.filter(
      (value) => interfaceJsonTypeToInterfaceType.get(value.type) === 'PointSet'
    ).length > 0
  const needWriteImage =
    interfaceJson.outputs.filter(
      (value) => interfaceJsonTypeToInterfaceType.get(value.type) === 'Image'
    ).length > 0
  return {
    needReadImage,
    needReadMesh,
    needReadPointSet,
    needWriteImage,
    needWriteMesh,
    needWritePointSet
  }
}

export default ioPackagesNeeded
