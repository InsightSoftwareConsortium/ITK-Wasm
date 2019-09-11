import PromiseFileReader from 'promise-file-reader'
import dicomParser from 'dicom-parser'

import "regenerator-runtime/runtime";

import DICOM_TAG_DICT from './dicomTags'

class DICOMEntity {
  constructor() {
    this.metaData = {}
  }

  extractTags(metaData) {
    this.constructor.tags.forEach((tag) => {
      if (tag in metaData) {
        this.metaData[tag] = metaData[tag]
      }
    })
  }
}

class DICOMPatient extends DICOMEntity {
  static get primaryTag() {
    return 'PatientID'
  }

  static get tags() {
    return [
      'PatientID',
      'PatientName',
      'PatientBirthDate',
      'PatientSex',
      ]
    }

  constructor(metaData, file) {
    super()
    this.studies = {}
    this.extractTags(metaData)
    this.addMetaData(metaData, file)
  }

  addMetaData(metaData, file) {
    const studyId = metaData[DICOMStudy.primaryTag]
    let study = this.studies[studyId]
    if (study === undefined) {
      study = new DICOMStudy(metaData, file)
      this.studies[studyId] = study
    } else {
      study.addMetaData(metaData, file)
    }
  }
}

class DICOMStudy extends DICOMEntity {
  static get primaryTag() {
    return 'StudyID'
  }

  static get tags() {
    return [
      'StudyID',
      'StudyInstanceUID',
      'StudyDate',
      'StudyTime',
      'AccessionNumber',
      'StudyDescription',
      ]
    }

  constructor(metaData, file) {
    super()
    this.series = {}
    this.extractTags(metaData)
    this.addMetaData(metaData, file)
  }

  addMetaData(metaData, file) {
    const serieNumber = metaData[DICOMSeries.primaryTag]
    let serie = this.series[serieNumber]
    if (serie === undefined) {
      serie = new DICOMSeries(metaData, file)
      this.series[serieNumber] = serie
    } else {
      serie.addMetaData(metaData, file)
    }
  }
}

class DICOMSeries extends DICOMEntity {
  static get primaryTag() {
    return 'SeriesNumber'
  }

  static get tags() {
    return [
      'SeriesNumber',
      'SeriesInstanceUID',
      'SeriesDate',
      'SeriesTime',
      'Modality',
      'SeriesDescription',
      'ProtocolName',
      'FrameOfReferenceUID',
      ]
    }

  constructor(metaData, file) {
    super()
    this.images = {}
    this.extractTags(metaData)
    this.addMetaData(metaData, file)
  }

  addMetaData(metaData, file) {
    const imageNumber = metaData[DICOMImage.primaryTag]
    if (imageNumber in this.images) {
      const id = metaData[DICOMSeries.primaryTag]
      throw Error(`Image ${imageNumber} already added to serie ${id}.`)
    }
    this.images[imageNumber] = new DICOMImage(metaData, file)
  }
}

class DICOMImage extends DICOMEntity {
  static get primaryTag() {
    return 'InstanceNumber'
  }

  static get tags() {
    return [
      'InstanceNumber',
      'SOPInstanceUID',
      'PatientPosition',
      'PatientOrientation',
      'ImagePositionPatient',
      'ImageOrientationPatient',
      'PixelSpacing',
      'SliceThickness',
      'SliceLocation',
      'SamplesPerPixel',
      'PlanarConfiguration',
      'PhotometricInterpretation',
      'Rows',
      'Columns',
      'BitsAllocated',
      'BitsStored',
      'HighBit',
      'PixelRepresentation',
      ]
    }

  constructor(metaData, file) {
    super()
    this.file = file
    this.extractTags(metaData)
  }
}

const allTagNames = Object.values(DICOM_TAG_DICT).map((tag) => tag.name)
function checkTagsValidity(klass) {
  const name = klass.name
  const tags = klass.tags
  const primaryTag = klass.primaryTag
  if (!tags.includes(primaryTag)) {
    throw Error(`The primary tag of the ${name} class ("${primaryTag}") is not included in its list of tags ([${tags}]).`)
  }
  tags.forEach((tag) => {
    if (!allTagNames.includes(tag)) {
      throw Error(`The tag "${tag}" associated with the ${name} class is not defined in DICOM_DICTIONARY.`)
    }
  })
}
checkTagsValidity(DICOMPatient)
checkTagsValidity(DICOMStudy)
checkTagsValidity(DICOMSeries)
checkTagsValidity(DICOMImage)

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

async function parseDicomFiles(fileList, ignoreFailedFiles = false) {
  const patients = {}
  const failures = []

  async function parseFile(file) {
    // Read
    const arrayBuffer = await PromiseFileReader.readAsArrayBuffer(file)

    // Parse
    const byteArray = new Uint8Array(arrayBuffer)
    const dataSet = dicomParser.parseDicom(byteArray)

    // Read metadata (recursive)
    async function readTags(dataSet) {
      const metaData = {}

      // Read value for a single tag
      async function readTag(tag) {
        const tagGroup = tag.substring(1,5)
        const tagElement = tag.substring(5,9)
        const tagKey = ("("+tagGroup+","+tagElement+")").toUpperCase();
        const tagInfo = DICOM_TAG_DICT[tagKey];
        const tagName = (tagInfo === undefined) ? tagKey : tagInfo.name
        const element = dataSet.elements[tag]

        if (element.items) {
          metaData[tagName] = []
          const readTagsOfItems = element.items.map(async (item) => {
            const itemMetaData = await readTags(item.dataSet)
            metaData[tagName].push(itemMetaData)
          })
          await Promise.all(readTagsOfItems)
          return
        }

        if (element.fragments) {
          console.warn(`${tagName} contains fragments which isn't supported`)
          return
        }

        let vr = element.vr
        if (vr === undefined) {
          if (tagInfo === undefined || tagInfo.vr === undefined) {
            console.warn(`${tagName} vr is unknown, skipping`)
          }
          vr = tagInfo.vr
        }

        let value = undefined
        switch (vr) {
          case 'US':
            value = dataSet.uint16(tag)
            break
          case 'SS':
            value = dataSet.int16(tag)
            break
          case 'UL':
            value = dataSet.uint32(tag)
            break
          case 'US':
            value = dataSet.int32(tag)
            break
          case 'FD':
            value = dataSet.double(tag)
            break
          case 'FL':
            value = dataSet.float(tag)
            break
          case 'AT':
            value = `(${dataSet.uint16(tag, 0)},${dataSet.uint16(tag, 1)})`
            break
          case 'OB':
          case 'OW':
          case 'UN':
          case 'OF':
          case 'UT':
            // TODO: binary data? is this correct?
            if (element.length === 2) {
              value = dataSet.uint16(tag)
            } else if (element.length === 4) {
              value = dataSet.uint32(tag)
            } else {
              // don't store binary data, only meta data
              return
            }
            break
          default: //string
            value = dataSet.string(tag)
            break
        }

        metaData[tagName] = value
      }

      // Set up promises for all tags
      const tags = Object.keys(dataSet.elements)
      const readAllTags = tags.map(readTag)

      // Read all tags
      await Promise.all(readAllTags)
      return metaData
    }
    const metaData = await readTags(dataSet)

    // Organize metadata
    const patientId = metaData[DICOMPatient.primaryTag]
    let patient = patients[patientId]
    if (patient === undefined) {
      patient = new DICOMPatient(metaData, file)
      patients[patientId] = patient
    } else {
      patient.addMetaData(metaData, file)
    }
  }

  // Set up promises
  const parseFiles = [...fileList].map((file) => {
    const promise = parseFile(file)
    return promise.catch((error) => {
      failures.push({ file, error })
    })
  })

  // Parse all files and populate patients
  const logName = `Parsed ${fileList.length} DICOM files in`
  console.time(logName)
  await Promise.all(parseFiles).then(() => {
    if (!ignoreFailedFiles && failures.length > 0) {
      throw new ParseDicomError(failures)
    }
  })
  console.timeEnd(logName)
  return { patients, failures }
}

export default parseDicomFiles