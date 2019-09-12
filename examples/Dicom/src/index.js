import readImageDICOMFileSeries from 'itk/readImageDICOMFileSeries'
import curry from 'curry'

import setupDicomForm from './dicomForm'
import parseDicomFiles from './parseDicomFiles'

const outputFileInformation = curry(async function outputFileInformation (outputTextArea, event) {
  outputTextArea.textContent = "Parsing..."

  // Get files
  const dataTransfer = event.dataTransfer
  const files = event.target.files || dataTransfer.files

  // Parse DICOM metadata
  const { patients, failures } = await parseDicomFiles(files, true)

  // Select DICOM serie
  outputTextArea.textContent = "Please select serie..."
  setupDicomForm(patients, async (serie) => {
    console.time('customRead:')
    const image1 = serie.getImageData()
    console.log(image1)
    console.warn(image1.data.length)
    console.timeEnd('customRead:')
    outputTextArea.textContent = "Loading..."

    // Read DICOM serie
    console.time('itkRead:')
    const files = Object.values(serie.images).map((image) => image.file)
    const { image, webWorker } = await readImageDICOMFileSeries(null, files)
    webWorker.terminate()
    console.log(image)
    console.warn(image.data.length)
    console.timeEnd('itkRead:')

    // Display
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
