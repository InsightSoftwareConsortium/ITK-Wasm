function processFile(event) {
  const outputTextArea = document.querySelector("textarea");
  outputTextArea.textContent = "Loading...";

  const dataTransfer = event.dataTransfer;
  const files = event.target.files || dataTransfer.files;

  return itk.readFile(null, files[0]).then(function({ image, mesh, polyData, webWorker }) {
    webWorker.terminate();
    var imageOrMeshOrPolyData = image || mesh || polyData;

    function replacer(key, value) {
      if (!!value && value.byteLength !== undefined) {
        return String(value.slice(0, 6)) + "...";
      }
      return value;
    }
    outputTextArea.textContent = JSON.stringify(imageOrMeshOrPolyData, replacer, 4);
  });
}
