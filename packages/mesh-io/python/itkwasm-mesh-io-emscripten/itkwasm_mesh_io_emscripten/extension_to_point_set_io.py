from collections import OrderedDict

extension_to_point_set_io = OrderedDict([
    ('.vtk', 'vtkPolyData'),
    ('.obj', 'obj'),
    ('.off', 'off'),
    ('.iwm', 'wasm'),
    ('.iwm.cbor', 'wasm'),
    ('.iwm.cbor.zst', 'wasmZstd'),
])
