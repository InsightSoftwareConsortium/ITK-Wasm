export default async function gaussianKernelRadiusLoadSampleInputs (model, preRun=false) {

  model.options.set('size', [64, 64])
  model.options.set('sigma', [2, 2])

  if (!preRun) {
    const sizeElement = document.querySelector('#gaussianKernelRadiusInputs sl-input[name=size]')
    sizeElement.value = JSON.stringify(model.options.get('size'))
    const sigmaElement = document.querySelector('#gaussianKernelRadiusInputs sl-input[name=sigma]')
    sigmaElement.value = JSON.stringify(model.options.get('sigma'))
  }

  return model
}

// Use this function to run the pipeline when this tab group is select.
// This will load the web worker if it is not already loaded, download the wasm module, and allocate memory in the wasm model.
// Set this to `false` if sample inputs are very large or sample pipeline computation is long.
export const usePreRun = true
