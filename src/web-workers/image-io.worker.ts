import registerWebworker from 'webworker-promise/lib/register.js'

import { ReadDICOMTagsInput, readDICOMTags } from "./image-io-operations.js"

registerWebworker(async function (input: ReadDICOMImageSeriesInput | ReadDICOMTagsInput) {
  if (input.operation === 'readDICOMTags') {
    return readDICOMTags(input as ReadDICOMTagsInput)
  } else {
    throw new Error('Unknown worker operation')
  }
})
