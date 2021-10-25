import registerWebworker from 'webworker-promise/lib/register.js'

import { ReadImageInput, WriteImageInput, ReadDICOMImageSeriesInput, ReadDICOMTagsInput,
  readImage, writeImage, readDICOMImageSeries, readDICOMTags } from "./image-io-operations.js"

registerWebworker(async function (input: ReadImageInput | WriteImageInput | ReadDICOMImageSeriesInput | ReadDICOMTagsInput) {
  if (input.operation === 'readImage') {
    return readImage(input as ReadImageInput)
  } else if (input.operation === 'writeImage') {
    return writeImage(input as WriteImageInput)
  } else if (input.operation === 'readDICOMImageSeries') {
    return readDICOMImageSeries(input as ReadDICOMImageSeriesInput)
  } else if (input.operation === 'readDICOMTags') {
    return readDICOMTags(input as ReadDICOMTagsInput)
  } else {
    throw new Error('Unknown worker operation')
  }
})
