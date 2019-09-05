import readImageDICOMFileSeries from 'itk/readImageDICOMFileSeries'
import PromiseFileReader from 'promise-file-reader'
import curry from 'curry'
import dicomParser from 'dicom-parser'

import setupDicomForm from './dicomForm'
import "regenerator-runtime/runtime";

const DICOM_DICTIONARY = {
  patientId: 'x00100020',
  patientName: 'x00100010',
  patientDateOfBirth: 'x00100030',
  patientSex: 'x00100040',
  studyID: 'x00200010',
  studyUID: 'x0020000d',
  studyDate: 'x00080020',
  studyTime: 'x00080030',
  studyAccessionNumber: 'x00080050',
  studyDescription: 'x00081030',
  seriesNumber: 'x00200011',
  seriesUid: 'x0020000e',
  seriesDate: 'x00080021',
  seriesTime: 'x00080031',
  seriesModality: 'x00080060',
  seriesDescription: 'x0008103e',
  seriesProtocolName: 'x00181030',
  seriesBodyPart: 'x00180015',
}

const parseDICOMFiles = async (fileList) => {
  var patientDict = new Map()

  const parseFile = async (file) => {
    // Read
    const arrayBuffer = await PromiseFileReader.readAsArrayBuffer(file)

    // Parse
    const byteArray = new Uint8Array(arrayBuffer)
    const dicomMetaData = dicomParser.parseDicom(byteArray)

    // Add to patientDict
    const tag = DICOMPatient.primaryTag
    const patientId = dicomMetaData.string(DICOM_DICTIONARY[tag])
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

class DICOMEntity {
  constructor() {
    this.checkTagsValidity() // could it be a static assertion instead?
  }

  checkTagsValidity() {
    const tags = this.constructor.tags
    const primaryTag = this.constructor.primaryTag
    console.assert(
      tags.includes(primaryTag),
      `The primary tag ${primaryTag} is not listed in ${tags}`
      )
    tags.forEach((tag) => {
      console.assert(
        tag in DICOM_DICTIONARY,
        `The tag ${tag} is not defined in DICOM_DICTIONARY`
        )
    })
  }

  extractTags(dicomMetaData) {
    const tags = this.constructor.tags
    const primaryTag = this.constructor.primaryTag
    tags.forEach((tag) => {
      const value = dicomMetaData.string(DICOM_DICTIONARY[tag])
      if (this[tag] === undefined) {
        this[tag] = value
      } else if (value != undefined) {
        console.assert(this[tag] === value, `Inconsistent value for ${tag} property of ${this[primaryTag]}`)
      }
    })
  }
}

class DICOMPatient extends DICOMEntity {
  static get primaryTag() {
    return 'patientId'
  }

  static get tags() {
    return [
      'patientId',
      'patientName',
      'patientDateOfBirth',
      'patientSex',
      ]
    }

  constructor() {
    super()
    this.studyDict = new Map()
  }

  parseMetaData(dicomMetaData, file) {
    this.extractTags(dicomMetaData)


    const tag = DICOMStudy.primaryTag
    const studyId = dicomMetaData.string(DICOM_DICTIONARY[tag])
    var study = this.studyDict.get(studyId)
    if (study === undefined) {
      console.log(`new study ${studyId}`)
      study = new DICOMStudy()
      this.studyDict.set(studyId, study)
    }
    study.parseMetaData(dicomMetaData, file)
  }
}


class DICOMStudy extends DICOMEntity {
  static get primaryTag() {
    return 'studyID'
  }

  static get tags() {
    return [
      'studyID',
      'studyUID',
      'studyDate',
      'studyTime',
      'studyAccessionNumber',
      'studyDescription',
      ]
    }

  constructor() {
    super()
    this.serieDict = new Map()
  }

  parseMetaData(dicomMetaData, file) {
    this.extractTags(dicomMetaData)

    const tag = DICOMSerie.primaryTag
    const serieNumber = dicomMetaData.string(DICOM_DICTIONARY[tag])
    var serie = this.serieDict.get(serieNumber)
    if (serie === undefined) {
      console.log(`new serie ${serieNumber}`)
      serie = new DICOMSerie()
      this.serieDict.set(serieNumber, serie)
    }
    serie.parseMetaData(dicomMetaData, file)
  }
}

class DICOMSerie extends DICOMEntity {
  static get primaryTag() {
    return 'seriesNumber'
  }

  static get tags() {
    return [
      'seriesNumber',
      'seriesUid',
      'seriesDate',
      'seriesTime',
      'seriesModality',
      'seriesDescription',
      'seriesProtocolName',
      'seriesBodyPart',
      ]
    }

  constructor() {
    super()
    this.files = []
  }

  parseMetaData(dicomMetaData, file) {
    this.extractTags(dicomMetaData)

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
