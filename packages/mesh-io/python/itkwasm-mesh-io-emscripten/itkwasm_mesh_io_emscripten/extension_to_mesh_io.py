from collections import OrderedDict

extension_to_mesh_io = OrderedDict([
    ('.vtk', 'vtkPolyData'),
    ('.byu', 'byu'),
    ('.fsa', 'freeSurferAscii'),
    ('.fsb', 'freeSurferBinary'),
    ('.mz3', 'mz3'),
    ('.obj', 'obj'),
    ('.off', 'off'),
    ('.stl', 'stl'),
    ('.swc', 'swc'),
    ('.iwm', 'wasm'),
    ('.iwm.cbor', 'wasm'),
    ('.iwm.cbor.zst', 'wasmZstd'),
])
