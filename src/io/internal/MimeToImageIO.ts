const mimeToIO = new Map([
  ['image/jpeg', 'itkJPEGImageIO'],
  ['image/png', 'itkPNGImageIO'],
  ['image/tiff', 'itkTIFFImageIO'],
  ['image/x-ms-bmp', 'itkBMPImageIO'],
  ['image/x-bmp', 'itkBMPImageIO'],
  ['image/bmp', 'itkBMPImageIO'],
  ['application/dicom', 'itkGDCMImageIO']
])

export default mimeToIO
