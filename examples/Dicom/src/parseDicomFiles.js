import PromiseFileReader from 'promise-file-reader'
import dicomParser from 'dicom-parser'

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

class DICOMEntity {
  extractTags(dicomMetaData) {
    const name = this.constructor.name
    const tags = this.constructor.tags
    const primaryTag = this.constructor.primaryTag
    tags.forEach((tag) => {
      const value = dicomMetaData.string(DICOM_DICTIONARY[tag])
      if (this[tag] === undefined) {
        this[tag] = value
      } else if (value !== undefined && this[tag] !== value) {
        throw new Error(`Inconsistent value for the "${tag}" property of ${name} "${this[primaryTag]}": received "${this[tag]}" but already had "${value}".`)
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
    this.studyDict = {}
  }

  parseMetaData(dicomMetaData, file) {
    this.extractTags(dicomMetaData)

    const tag = DICOMStudy.primaryTag
    const studyId = dicomMetaData.string(DICOM_DICTIONARY[tag])
    var study = this.studyDict[studyId]
    if (study === undefined) {
      study = new DICOMStudy()
      this.studyDict[studyId] = study
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
    this.serieDict = {}
  }

  parseMetaData(dicomMetaData, file) {
    this.extractTags(dicomMetaData)

    const tag = DICOMSerie.primaryTag
    const serieNumber = dicomMetaData.string(DICOM_DICTIONARY[tag])
    var serie = this.serieDict[serieNumber]
    if (serie === undefined) {
      serie = new DICOMSerie()
      this.serieDict[serieNumber] = serie
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

function checkTagsValidity(klass) {
  const name = klass.name
  const tags = klass.tags
  const primaryTag = klass.primaryTag
  if (!tags.includes(primaryTag)) {
    throw Error(`The primary tag of the ${name} class ("${primaryTag}") is not included in its list of tags ([${tags}]).`)
  }
  tags.forEach((tag) => {
    if (!(tag in DICOM_DICTIONARY)) {
      throw Error(`The tag "${tag}" associated with the ${name} class is not defined in DICOM_DICTIONARY.`)
    }
  })
}
checkTagsValidity(DICOMPatient)
checkTagsValidity(DICOMStudy)
checkTagsValidity(DICOMSerie)

class ParseDicomError extends Error {
  constructor(failures) {
    const message =
      `Failed at parsing ${failures.length} DICOM file(s). ` +
      `Find the list of files and associated errors in the ` +
      `"failures" property of the thrown error, or ignore the ` +
      `errors by calling "parseDicomFiles(fileList, true)".`
    super(message)
    this.failures = failures
  }
}

const parseDicomFiles = async (fileList, ignoreFailedFiles = false) => {
  const patientDict = {}
  const failures = []

  const parseFile = async (file) => {
    // Read
    const arrayBuffer = await PromiseFileReader.readAsArrayBuffer(file)

    // Parse
    const byteArray = new Uint8Array(arrayBuffer)
    const dicomMetaData = dicomParser.parseDicom(byteArray)

    // Add to patientDict
    const tag = DICOMPatient.primaryTag
    const patientId = dicomMetaData.string(DICOM_DICTIONARY[tag])
    var patient = patientDict[patientId]
    if (patient === undefined) {
      patient = new DICOMPatient()
      patientDict[patientId] = patient
    }
    patient.parseMetaData(dicomMetaData, file)
  }

  // Set up promises
  const parseFiles = [...fileList].map((file) => {
    const promise = parseFile(file)
    return promise.catch((error) => {
      failures.push({ file, error })
    })
  })

  // Parse all files and populate patientDict
  const logName = `Parsed ${fileList.length} DICOM files in`
  console.time(logName)
  await Promise.all(parseFiles).then(() => {
    if (!ignoreFailedFiles && failures.length > 0) {
      throw new ParseDicomError(failures)
    }
  })
  console.timeEnd(logName)
  return { patientDict, failures }
}

export default parseDicomFiles