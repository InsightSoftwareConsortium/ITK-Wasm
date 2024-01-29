export default async function downsampleSigmaLoadSampleInputs (model, preRun=false) {

  model.options.set('shrinkFactors', [2, 2])

  if (!preRun) {
    const shrinkFactorsElement = document.querySelector('#downsampleSigmaInputs sl-input[name=shrink-factors]')
    shrinkFactorsElement.value = JSON.stringify(model.options.get('shrinkFactors'))
  }

  return model
}

// Use this function to run the pipeline when this tab group is select.
// This will load the web worker if it is not already loaded, download the wasm module, and allocate memory in the wasm model.
// Set this to `false` if sample inputs are very large or sample pipeline computation is long.
export const usePreRun = true
