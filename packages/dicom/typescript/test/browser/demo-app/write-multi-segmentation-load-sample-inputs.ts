export default async function writeMultiSegmentationLoadSampleInputs (model, preRun=false) {
  const segImagesFileButton = document.querySelector('#writeMultiSegmentationInputs sl-button[name=seg-images-file-button]')
  const metaInfoFileButton = document.querySelector('#writeMultiSegmentationInputs sl-button[name=meta-info-file-button]')
  const refDicomSeriesFileButton = document.querySelector('#writeMultiSegmentationInputs sl-button[name=ref-dicom-series-file-button]')

  if (!preRun) {
    segImagesFileButton.loading = true
    metaInfoFileButton.loading = true
    refDicomSeriesFileButton.loading = true
  }

  // Set Inputs
  const segImagesInput = [
    await globalThis.fetchToBinaryFile('partial_overlaps-1.nrrd', 'https://data.kitware.com/api/v1/file/66c543c7af422925a4211c07/download'),
    await globalThis.fetchToBinaryFile('partial_overlaps-2.nrrd', 'https://data.kitware.com/api/v1/file/66c543c7af422925a4211c0a/download'),
    await globalThis.fetchToBinaryFile('partial_overlaps-3.nrrd', 'https://data.kitware.com/api/v1/file/66c543c7af422925a4211c0d/download'),
  ]
  model.options.set("segImages", segImagesInput)

  const metaInfoInput = await globalThis.fetchToBinaryFile('seg-example_partial_overlaps.json', 'https://data.kitware.com/api/v1/file/66c543f2af422925a4211c10/download')
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
    const segImageDetailsElement = document.getElementById('writeMultiSegmentation-seg-images-details')
    if (segImageDetailsElement ) {
      segImageDetailsElement.innerHTML = `<pre>${globalThis.escapeHtml(segImagesInput.map((file) => file.path).toString())}</pre>`
      segImageDetailsElement.disabled = false
      segImagesFileButton.loading = false
    }

    const metaInfoDetailsElement = document.getElementById('writeMultiSegmentation-meta-info-details')
    if (metaInfoDetailsElement) {
      //metaInfoDetailsElement.innerHTML = `<pre>${globalThis.escapeHtml(metaInfoInput.data.toString())}</pre>`
      metaInfoDetailsElement.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(metaInfoJson, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
      metaInfoDetailsElement.disabled = false
      metaInfoFileButton.loading = false
    }

    const refDicomSeriesElement = document.getElementById('writeMultiSegmentation-ref-dicom-series-details')
    if (refDicomSeriesElement) {
      //refDicomSeriesElement.innerHTML = `<pre>${globalThis.escapeHtml(refDicomSeriesInput[0].path.toString())}</pre>`
      refDicomSeriesElement.innerHTML = `<pre>${globalThis.escapeHtml(refDicomSeriesInput.map((file) => file.path).toString())}</pre>`
      refDicomSeriesElement.disabled = false
      refDicomSeriesFileButton.loading = false
    }

    const outputDicomFileElement = document.querySelector('#writeMultiSegmentationInputs sl-input[name=output-dicom-file]')
    outputDicomFileElement.value = 'write-multi-segmentation-output.dcm'
  }

  return model
}

export const usePreRun = true
