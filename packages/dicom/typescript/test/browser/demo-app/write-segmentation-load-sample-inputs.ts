
export default async function writeSegmentationLoadSampleInputs (model, preRun=false) {
  const segImageFileButton = document.querySelector('#writeSegmentationInputs sl-button[name=seg-image-file-button]')
  const metaInfoFileButton = document.querySelector('#writeSegmentationInputs sl-button[name=meta-info-file-button]')
  const refDicomSeriesFileButton = document.querySelector('#writeSegmentationInputs sl-button[name=ref-dicom-series-file-button]')

  if (!preRun) {
    segImageFileButton.loading = true
    metaInfoFileButton.loading = true
    refDicomSeriesFileButton.loading = true
  }

  // Set Inputs
 const segImageInput = await globalThis.fetchToBinaryFile('input.nrrd', 'https://data.kitware.com/api/v1/item/66be921cf87a980650f422a9/download')
  const segImage = await globalThis.readImage( segImageInput )
  model.inputs.set('segImage', segImage.image)

  const metaInfoInput = await globalThis.fetchToBinaryFile('input.json', 'https://data.kitware.com/api/v1/item/66be9341f87a980650f422ac/download')
  const metaInfoJson = JSON.parse(new TextDecoder().decode(metaInfoInput.data))
  model.inputs.set('metaInfo', metaInfoJson)
  //const metaInfoJson = await fetchToJSON('https://data.kitware.com/api/v1/item/66be9341f87a980650f422ac/download')
  //model.inputs.set('metaInfo', metaInfoJson)

  model.inputs.set('outputDicomFile', 'write-segmentation-output.dcm')

  // Set Options
  const refDicomSeriesInput = [
    await globalThis.fetchToBinaryFile('ref0.dcm', 'https://data.kitware.com/api/v1/item/66be9dfff87a980650f422b3/download'),
    await globalThis.fetchToBinaryFile('ref1.dcm', 'https://data.kitware.com/api/v1/item/66be9dfff87a980650f422b6/download'),
    await globalThis.fetchToBinaryFile('ref2.dcm', 'https://data.kitware.com/api/v1/item/66be9dfff87a980650f422b9/download'),
  ]

  model.options.set('refDicomSeries', refDicomSeriesInput)
  model.options.set('skipEmptySlices', false)
  model.options.set('useLabelidAsSegmentnumber', false)

  if (!preRun) {
    const segImageDetailsElement = document.getElementById('writeSegmentation-seg-image-details')
    if (segImageDetailsElement ) {
      segImageDetailsElement.innerHTML = `<pre>${globalThis.escapeHtml(segImageInput.path.toString())}</pre>`
      segImageDetailsElement.disabled = false
      segImageFileButton.loading = false
    }

    const metaInfoDetailsElement = document.getElementById('writeSegmentation-meta-info-details')
    if (metaInfoDetailsElement) {
      //metaInfoDetailsElement.innerHTML = `<pre>${globalThis.escapeHtml(metaInfoInput.data.toString())}</pre>`
      metaInfoDetailsElement.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(metaInfoJson, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
      metaInfoDetailsElement.disabled = false
      metaInfoFileButton.loading = false
    }

    const refDicomSeriesElement = document.getElementById('writeSegmentation-ref-dicom-series-details')
    if (refDicomSeriesElement) {
      //refDicomSeriesElement.innerHTML = `<pre>${globalThis.escapeHtml(refDicomSeriesInput[0].path.toString())}</pre>`
      refDicomSeriesElement.innerHTML = `<pre>${globalThis.escapeHtml(refDicomSeriesInput.map((file) => file.path).toString())}</pre>`
      refDicomSeriesElement.disabled = false
      refDicomSeriesFileButton.loading = false
    }

    const outputDicomFileElement = document.querySelector('#writeSegmentationInputs sl-input[name=output-dicom-file]')
    outputDicomFileElement.value = 'write-segmentation-output.dcm'
  }

  return model
}

export const usePreRun = true
