import { outputFileInformation } from './outputFileInformation'

const outputTextArea = document.querySelector('textarea')
const handleFile = outputFileInformation(outputTextArea)
const fileInput = document.querySelector('input')
fileInput.addEventListener('change', handleFile)
