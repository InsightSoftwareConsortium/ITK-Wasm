from collections import OrderedDict

extension_to_image_io = OrderedDict([
  ('.bmp', 'bmp'),

  ('.dcm', 'gdcm'),

  ('.gipl', 'gipl'),
  ('.gipl.gz', 'gipl'),

  ('.hdf5', 'hdf5'),

  ('.jpg', 'jpeg'),
  ('.jpeg', 'jpeg'),

  ('.iwi', 'wasm'),
  ('.iwi.cbor', 'wasm'),
  ('.iwi.cbor.zst', 'wasmZstd'),

  ('.lsm', 'lsm'),

  ('.mnc', 'mnc'),
  ('.mnc.gz', 'mnc'),
  ('.mnc2', 'mnc'),

  ('.mgh', 'mgh'),
  ('.mgz', 'mgh'),
  ('.mgh.gz', 'mgh'),

  ('.mha', 'meta'),
  ('.mhd', 'meta'),

  ('.mrc', 'mrc'),

  ('.nia', 'nifti'),
  ('.nii', 'nifti'),
  ('.nii.gz', 'nifti'),
  ('.hdr', 'nifti'),

  ('.nrrd', 'nrrd'),
  ('.nhdr', 'nrrd'),

  ('.png', 'png'),

  ('.pic', 'bioRad'),

  ('.tif', 'tiff'),
  ('.tiff', 'tiff'),

  ('.vtk', 'vtk'),

  ('.isq', 'scanco'),
  ('.aim', 'scanco'),

  ('.fdf', 'fdf'),
])
