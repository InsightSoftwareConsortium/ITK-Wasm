const extensionToIO = new Map([
  ['bmp', 'itkBMPImageIO'],
  ['BMP', 'itkBMPImageIO'],

  ['dcm', 'itkGDCMImageIO'],
  ['DCM', 'itkGDCMImageIO'],

  ['gipl', 'itkGiplImageIO'],
  ['gipl.gz', 'itkGiplImageIO'],

  ['hdf5', 'itkHDF5ImageIO'],

  ['jpg', 'itkJPEGImageIO'],
  ['JPG', 'itkJPEGImageIO'],
  ['jpeg', 'itkJPEGImageIO'],
  ['JPEG', 'itkJPEGImageIO'],

  ['iwi', 'itkWASMImageIO'],
  ['iwi.cbor', 'itkWASMImageIO'],

  ['lsm', 'itkLSMImageIO'],

  ['mnc', 'itkMINCImageIO'],
  ['MNC', 'itkMINCImageIO'],
  ['mnc.gz', 'itkMINCImageIO'],
  ['MNC.GZ', 'itkMINCImageIO'],
  ['mnc2', 'itkMINCImageIO'],
  ['MNC2', 'itkMINCImageIO'],

  ['mgh', 'itkMGHImageIO'],
  ['mgz', 'itkMGHImageIO'],
  ['mgh.gz', 'itkMGHImageIO'],

  ['mha', 'itkMetaImageIO'],
  ['mhd', 'itkMetaImageIO'],

  ['mrc', 'itkMRCImageIO'],

  ['nia', 'itkNiftiImageIO'],
  ['nii', 'itkNiftiImageIO'],
  ['nii.gz', 'itkNiftiImageIO'],
  ['hdr', 'itkNiftiImageIO'],

  ['nrrd', 'itkNrrdImageIO'],
  ['NRRD', 'itkNrrdImageIO'],
  ['nhdr', 'itkNrrdImageIO'],
  ['NHDR', 'itkNrrdImageIO'],

  ['png', 'itkPNGImageIO'],
  ['PNG', 'itkPNGImageIO'],

  ['pic', 'itkBioRadImageIO'],
  ['PIC', 'itkBioRadImageIO'],

  ['tif', 'itkTIFFImageIO'],
  ['TIF', 'itkTIFFImageIO'],
  ['tiff', 'itkTIFFImageIO'],
  ['TIFF', 'itkTIFFImageIO'],

  ['vtk', 'itkVTKImageIO'],
  ['VTK', 'itkVTKImageIO'],

  ['isq', 'itkScancoImageIO'],
  ['ISQ', 'itkScancoImageIO'],

  ['fdf', 'itkFDFImageIO'],
  ['FDF', 'itkFDFImageIO']
])

export default extensionToIO
