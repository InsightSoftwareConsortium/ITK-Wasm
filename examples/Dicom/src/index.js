import readImageDICOMFileSeries from 'itk/readImageDICOMFileSeries'
import curry from 'curry'

import setupDicomForm from './dicomForm'
import parseDicomFiles from './parseDicomFiles'

const outputFileInformation = curry(async function outputFileInformation (outputTextArea, event) {

  function replacer (key, value) {
    if (!!value && value.byteLength !== undefined) {
      return String(value.slice(0, 6)) + '...'
    }
    return value
  }

  function startChrono(message) {
    outputTextArea.textContent += `-- ${message}... `
    return start = window.performance.now()
  }

  function endChrono(start) {
    let end = window.performance.now()
    let time = end - start
    let timeStr = `${time.toFixed(2)} ms`
    outputTextArea.textContent += `${timeStr}\n`
    return time
  }

  outputTextArea.textContent = ""

  // Get files
  const dataTransfer = event.dataTransfer
  const files = event.target.files || dataTransfer.files

  // Parse DICOM metadata
  let start = startChrono("Parsing + organising all files using javascript")
  const { patients, failures } = await parseDicomFiles(files, true)
  const parseTime = endChrono(start)

  // Select DICOM series
  setupDicomForm(patients, async (serie) => {
    // Read image data with javascript code
    start = startChrono("Loading image data using javascript")
    const image1 = serie.getImageData()
    const loadTime = endChrono(start)
    outputTextArea.textContent += JSON.stringify(image1, replacer, 4)
    outputTextArea.textContent += '\n'

    // Read image data with itk
    start = startChrono("Parsing selected series files + loading image data using itk")
    const files = Object.values(serie.images).map((image) => image.file)
    const { image, webWorker } = await readImageDICOMFileSeries(null, files)
    webWorker.terminate()
    const itkTime = endChrono(start)
    outputTextArea.textContent += JSON.stringify(image, replacer, 4)
    outputTextArea.textContent += '\n'

    // Time compare
    let ratio = (itkTime / (parseTime + loadTime)).toFixed(2)
    outputTextArea.textContent += `-- js code was about ${ratio}x faster than itk's webassembly dicom reader\n`

    // Image compare
    outputTextArea.textContent += "-- Comparing pixel data..."
    if (image1.data.length !== image.data.length) {
      let msg = 'Pixel data size differ 𐄂'
      outputTextArea.textContent += ` ${msg}\n`
      throw Error(msg)
    }
    for (let i = 0; i < image.data.length; i++) {
      if (image1.data[i] !== image.data[i]) {
        let msg = `Element ${i} differs: ${image1.data[i]} !== ${image.data[i]}`
        outputTextArea.textContent += ` ${msg}\n`
        throw Error(msg)
      }
    }
    outputTextArea.textContent += ' they match ✓'
  })
})

export { outputFileInformation }
