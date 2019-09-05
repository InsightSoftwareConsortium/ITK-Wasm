import readImageDICOMFileSeries from 'itk/readImageDICOMFileSeries'
import PromiseFileReader from 'promise-file-reader'
import curry from 'curry'
import dicomParser from 'dicom-parser'

import setupDicomForm from './dicomForm'
import "regenerator-runtime/runtime";

const parseDICOMFiles = async (fileList) => {
  var patientDict = new Map()

  const parseFile = async (file) => {
    // Read
    const arrayBuffer = await PromiseFileReader.readAsArrayBuffer(file)

    // Parse
    const byteArray = new Uint8Array(arrayBuffer)
    const dicomMetaData = dicomParser.parseDicom(byteArray)

    // Add to patientDict
    const patientId = dicomMetaData.string('x00100020')
    var patient = patientDict.get(patientId)
    if (patient === undefined) {
      console.log(`New patient ${patientId}`)
      patient = new DICOMPatient()
      patientDict.set(patientId, patient)
    }
    patient.parseMetaData(dicomMetaData, file)
  }

  // Parse all files and populate patientDict
  const parseFiles = [...fileList].map(parseFile)
  await Promise.all(parseFiles)
  return patientDict
}

class DICOMPatient {
  constructor() {
    this.id = undefined           // x00100020
    this.name = undefined         // x00100010
    this.dateOfBirth = undefined  // x00100030
    this.sex = undefined          // x00100040
    this.studyDict = new Map()
  }

  parseMetaData(dicomMetaData, file) {
    const id = dicomMetaData.string('x00100020')
    if (this.id === undefined) {
      this.id = id
    } else {
      console.assert(this.id === id, "Inconsistent id")
    }

    const name = dicomMetaData.string('x00100010')
    if (this.name === undefined) {
      this.name = name
    } else {
      console.assert(this.name === name, "Inconsistent name")
    }

    const dob = dicomMetaData.string('x00100030')
    if (this.dateOfBirth === undefined) {
      this.dateOfBirth = dob
    } else {
      console.assert(this.dateOfBirth === dob, "Inconsistent date of birth")
    }

    const sex = dicomMetaData.string('x00100040')
    if (this.sex === undefined) {
      this.sex = sex
    } else {
      console.assert(this.sex === sex, "Inconsistent sex")
    }

    const studyId = dicomMetaData.string('x00200010')
    var study = this.studyDict.get(studyId)
    if (study === undefined) {
      console.log(`new study ${studyId}`)
      study = new DICOMStudy()
      this.studyDict.set(studyId, study)
    }
    study.parseMetaData(dicomMetaData, file)
  }
}

class DICOMStudy {
  constructor() {
    this.id = undefined               // x00200010
    this.uid = undefined              // x0020000d
    this.date = undefined             // x00080020
    this.time = undefined             // x00080030
    this.accessionNumber = undefined  // x00080050
    this.description = undefined      // x00081030
    this.serieDict = new Map()
  }

  parseMetaData(dicomMetaData, file) {
    const id = dicomMetaData.string('x00200010')
    if (this.id === undefined) {
      this.id = id
    } else {
      console.assert(this.id === id, "Inconsistent id")
    }

    const uid = dicomMetaData.string('x0020000d')
    if (this.uid === undefined) {
      this.uid = uid
    } else {
      console.assert(this.uid === uid, "Inconsistent uid")
    }

    const date = dicomMetaData.string('x00080020')
    if (this.date === undefined) {
      this.date = date
    } else {
      console.assert(this.date === date, "Inconsistent date")
    }

    const time = dicomMetaData.string('x00080030')
    if (this.time === undefined) {
      this.time = time
    } else {
      console.assert(this.time === time, "Inconsistent time")
    }

    const nbr = dicomMetaData.string('x00080050')
    if (this.accessionNumber === undefined) {
      this.accessionNumber = nbr
    } else {
      console.assert(this.accessionNumber === nbr, "Inconsistent accession number")
    }

    const description = dicomMetaData.string('x00081030')
    if (this.description === undefined) {
      this.description = description
    } else {
      console.assert(this.description === description, "Inconsistent description")
    }

    const serieNumber = dicomMetaData.string('x00200011')
    var serie = this.serieDict.get(serieNumber)
    if (serie === undefined) {
      console.log(`new serie ${serieNumber}`)
      serie = new DICOMSerie()
      this.serieDict.set(serieNumber, serie)
    }
    serie.parseMetaData(dicomMetaData, file)
  }
}

class DICOMSerie {
  constructor() {
    this.number = undefined       // x00200011
    this.uid = undefined          // x0020000e
    this.date = undefined         // x00080021
    this.time = undefined         // x00080031
    this.modality = undefined     // x00080060
    this.description = undefined  // x0008103e
    this.protocolName = undefined // x00181030
    this.bodyPart = undefined     // x00180015
    this.files = []
  }

  parseMetaData(dicomMetaData, file) {
    const number = dicomMetaData.string('x00200011')
    if (this.number === undefined) {
      this.number = number
    } else {
      console.assert(this.number === number, "Inconsistent number")
    }

    const uid = dicomMetaData.string('x0020000e')
    if (this.uid === undefined) {
      this.uid = uid
    } else {
      console.assert(this.uid === uid, "Inconsistent number")
    }

    const date = dicomMetaData.string('x00080021')
    if (this.date === undefined) {
      this.date = date
    } else {
      console.assert(this.date === date, "Inconsistent date")
    }

    const time = dicomMetaData.string('x00080031')
    if (this.time === undefined) {
      this.time = time
    } else {
      console.assert(this.time === time, "Inconsistent time")
    }

    const modality = dicomMetaData.string('x00080060')
    if (this.modality === undefined) {
      this.modality = modality
    } else {
      console.assert(this.modality === modality, "Inconsistent modality")
    }

    const description = dicomMetaData.string('x0008103e')
    if (this.description === undefined) {
      this.description = description
    } else {
      console.assert(this.description === description, "Inconsistent description")
    }

    const bodyPart = dicomMetaData.string('x00180015')
    if (this.bodyPart === undefined) {
      this.bodyPart = bodyPart
    } else {
      console.assert(this.bodyPart === bodyPart, "Inconsistent body part")
    }

    const protocolName = dicomMetaData.string('x00181030')
    if (this.protocolName === undefined) {
      this.protocolName = protocolName
    } else {
      console.assert(this.protocolName === protocolName, "Inconsistent protocol name")
    }

    this.files.push(file)
  }
}

const outputFileInformation = curry(async function outputFileInformation (outputTextArea, event) {
  outputTextArea.textContent = "Parsing..."

  // Get files
  const dataTransfer = event.dataTransfer
  const files = event.target.files || dataTransfer.files

  // Parse DICOM metadata
  const patientDict = await parseDICOMFiles(files)

  // Select DICOM serie
  outputTextArea.textContent = "Please select serie..."
  setupDicomForm(patientDict, async (files) => {
    outputTextArea.textContent = "Loading..."

    // Read DICOM serie
    const { image, webWorker } = await readImageDICOMFileSeries(null, files)
    webWorker.terminate()

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
