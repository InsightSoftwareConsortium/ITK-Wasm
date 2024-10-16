
export default async function writeOverlappingSegmentationLoadSampleInputs (model, preRun=false) {
  const segImageFileButton = document.querySelector('#writeOverlappingSegmentationInputs sl-button[name=seg-image-file-button]')
  const metaInfoFileButton = document.querySelector('#writeOverlappingSegmentationInputs sl-button[name=meta-info-file-button]')
  const refDicomSeriesFileButton = document.querySelector('#writeOverlappingSegmentationInputs sl-button[name=ref-dicom-series-file-button]')

  if (!preRun) {
    segImageFileButton.loading = true
    metaInfoFileButton.loading = true
    refDicomSeriesFileButton.loading = true
  }

  // Set Inputs
  const segImageInput = await globalThis.fetchToBinaryFile('input.nrrd', 'https://data.kitware.com/api/v1/file/66c613aaaf422925a42121a4/download')
  const segImage = await globalThis.readImage( segImageInput )
  const segImageCast = globalThis.castImage(segImage.image, {pixelType: 'VariableLengthVector'})
  model.inputs.set('segImage', segImageCast)

  const metaInfoInput = await globalThis.fetchToBinaryFile('input.json', 'https://data.kitware.com/api/v1/file/66c613a6af422925a42121a1/download')
  const metaInfoJson = JSON.parse(new TextDecoder().decode(metaInfoInput.data))
  model.inputs.set('metaInfo', metaInfoJson)

  model.inputs.set('outputDicomFile', 'write-segmentation-output.dcm')

  // Set Options
  const refDicomSeriesInput = [
    await globalThis.fetchToBinaryFile('ref0.dcm', 'https://data.kitware.com/api/v1/item/66c040c7af422925a420eb43/download'),
    await globalThis.fetchToBinaryFile('ref1.dcm', 'https://data.kitware.com/api/v1/item/66c040c7af422925a420eb46/download'),
    await globalThis.fetchToBinaryFile('ref2.dcm', 'https://data.kitware.com/api/v1/item/66c040c6af422925a420eb40/download'),
  ]

  model.options.set('refDicomSeries', refDicomSeriesInput)
  model.options.set('skipEmptySlices', false)
  model.options.set('useLabelidAsSegmentnumber', false)

  if (!preRun) {
    const segImageDetailsElement = document.getElementById('writeOverlappingSegmentation-seg-image-details')
    if (segImageDetailsElement ) {
      segImageDetailsElement.innerHTML = `<pre>${globalThis.escapeHtml(segImageInput.path.toString())}</pre>`
      segImageDetailsElement.disabled = false
      segImageFileButton.loading = false
    }

    const metaInfoDetailsElement = document.getElementById('writeOverlappingSegmentation-meta-info-details')
    if (metaInfoDetailsElement) {
      //metaInfoDetailsElement.innerHTML = `<pre>${globalThis.escapeHtml(metaInfoInput.data.toString())}</pre>`
      metaInfoDetailsElement.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(metaInfoJson, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
      metaInfoDetailsElement.disabled = false
      metaInfoFileButton.loading = false
    }

    const refDicomSeriesElement = document.getElementById('writeOverlappingSegmentation-ref-dicom-series-details')
    if (refDicomSeriesElement) {
      //refDicomSeriesElement.innerHTML = `<pre>${globalThis.escapeHtml(refDicomSeriesInput[0].path.toString())}</pre>`
      refDicomSeriesElement.innerHTML = `<pre>${globalThis.escapeHtml(refDicomSeriesInput.map((file) => file.path).toString())}</pre>`
      refDicomSeriesElement.disabled = false
      refDicomSeriesFileButton.loading = false
    }

    const outputDicomFileElement = document.querySelector('#writeOverlappingSegmentationInputs sl-input[name=output-dicom-file]')
    outputDicomFileElement.value = 'write-overlapping-segmentation-output.dcm'
  }

  return model
}

export const usePreRun = true
