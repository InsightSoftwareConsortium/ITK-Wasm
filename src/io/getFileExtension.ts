function getFileExtension (filePath: string): string {
  let extension = filePath.slice((filePath.lastIndexOf('.') - 1 >>> 0) + 2)
  if (extension.toLowerCase() === 'gz') {
    const index = filePath.slice(0, -3).lastIndexOf('.')
    extension = filePath.slice((index - 1 >>> 0) + 2)
  } else if (extension.toLowerCase() === 'zip') {
    const index = filePath.slice(0, -4).lastIndexOf('.')
    extension = filePath.slice((index - 1 >>> 0) + 2)
  }
  return extension
}

export default getFileExtension
