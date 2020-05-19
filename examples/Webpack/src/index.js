import readFile from 'itk/readFile'
import curry from 'curry'

const outputFileInformation = curry(function outputFileInformation (outputTextArea, event) {
  outputTextArea.textContent = 'Loading...'

  const dataTransfer = event.dataTransfer
  const files = event.target.files || dataTransfer.files

  const viewerElement = document.getElementById('viewer')
  !!viewerElement && itkVtkViewer.createViewerFromFiles(viewerElement, files)

  return readFile(null, files[0])
    .then(function ({ image, mesh, polyData, webWorker }) {
      webWorker.terminate()
      const imageOrMeshOrPolyData = image || mesh || polyData

      function replacer (key, value) {
        if (!!value && value.byteLength !== undefined) {
          return String(value.slice(0, 6)) + '...'
        }
        return value
      }
      outputTextArea.textContent = JSON.stringify(imageOrMeshOrPolyData, replacer, 4)
    })
})

export { outputFileInformation }
