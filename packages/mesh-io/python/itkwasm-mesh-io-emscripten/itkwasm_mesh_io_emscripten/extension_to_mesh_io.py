from collections import OrderedDict

extension_to_mesh_io = OrderedDict([
    ('.vtk', 'vtkPolyData'),
    ('.byu', 'byu'),
    ('.fsa', 'freeSurferAscii'),
    ('.fsb', 'freeSurferBinary'),
    ('.obj', 'obj'),
    ('.off', 'off'),
    ('.stl', 'stl'),
    ('.swc', 'swc'),
    ('.iwm', 'wasm'),
    ('.iwm.cbor', 'wasm'),
    ('.iwm.cbor.zst', 'wasmZstd'),
])
