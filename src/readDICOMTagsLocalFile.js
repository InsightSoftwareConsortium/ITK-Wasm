const readDICOMTagsLocalFileSync = require('./readDICOMTagsLocalFileSync.js')

const readDICOMTagsLocalFile = (filename, tags = null) => {
  return new Promise(function (resolve, reject) {
    try {
      resolve(readDICOMTagsLocalFileSync(filename, tags))
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = readDICOMTagsLocalFile
