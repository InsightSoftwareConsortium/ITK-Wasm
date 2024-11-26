from collections import OrderedDict

extension_to_transform_io = OrderedDict([
  ("h5", "hdf5"),
  ("hdf5", "hdf5"),
  ("txt", "txt"),
  ("mat", "mat"),
  ("xfm", "mnc"),
  ("iwt", "wasm"),
  ("iwt.cbor", "wasm"),
  ("iwt.cbor.zst", "wasm-zstd"),
])
