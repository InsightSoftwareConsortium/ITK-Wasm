const getFileExtension = (filePath) => {
  return filePath.slice((fname.lastIndexOf('.') - 1 >>> 0) + 2)
}

module.exports = getFileExtension
