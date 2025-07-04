export const pipelineBaseUrl = '/pipelines'
export const pipelineWorkerUrl = '/itk-wasm-pipeline.worker.js'

export async function readIwi(baseUrl) {
  const imageResponse = await fetch(`${baseUrl}index.json`)
  const image = await imageResponse.json()
  const directionResponse = await fetch(`${baseUrl}data/direction.raw`)
  const directionBuffer = await directionResponse.arrayBuffer()
  const directionData = new Float64Array(directionBuffer)
  image.direction = directionData
  const dataResponse = await fetch(`${baseUrl}data/data.raw`)
  const dataBuffer = await dataResponse.arrayBuffer()
  const pixelData = new Uint8Array(dataBuffer)
  image.data = pixelData
  return image
}

export async function readIwm(baseUrl) {
  const meshResponse = await fetch(`${baseUrl}index.json`)
  const mesh = await meshResponse.json()
  const pointsResponse = await fetch(`${baseUrl}data/points.raw`)
  const pointsBuffer = await pointsResponse.arrayBuffer()
  const points = new Float32Array(pointsBuffer)
  mesh.points = points
  const cellsResponse = await fetch(`${baseUrl}data/cells.raw`)
  const cellsBuffer = await cellsResponse.arrayBuffer()
  const cells = new Float32Array(cellsBuffer)
  mesh.cells = cells
  // todo
  mesh.pointData = null
  mesh.cellData = null
  return mesh
}
