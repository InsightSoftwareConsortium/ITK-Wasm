function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader()
    reader.onload = function(e) { resolve(e.target.result) }
    reader.onerror = function(e) { reject(new Error(`Error reading ${file.name}: ${e.target.result?.toString()}`)) }
    reader.readAsArrayBuffer(file)
  })
}

export default fileToArrayBuffer