import readImageFile from 'itk/readImageFile'
import curry from 'curry'

const outputFileInformation = curry(function outputFileInformation (outputTextArea, event) {
  const dataTransfer = event.dataTransfer
  const files = event.target.files || dataTransfer.files
  return readImageFile(null, files[0])
    .then(function ({ image, webWorker }) {
      webWorker.terminate()
      function replacer (key, value) {
        if (!!value && value.byteLength !== undefined) {
          return String(value.slice(0, 6)) + '...'
        }
        return value
      }
      outputTextArea.textContent = JSON.stringify(image, replacer, 4)
    })
})

export { outputFileInformation }
