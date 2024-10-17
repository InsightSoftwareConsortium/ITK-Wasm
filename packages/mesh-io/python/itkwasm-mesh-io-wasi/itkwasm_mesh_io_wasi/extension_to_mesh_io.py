from collections import OrderedDict

extension_to_mesh_io = OrderedDict([
    ('.vtk', 'vtk_poly_data'),
    ('.byu', 'byu'),
    ('.fsa', 'free_surfer_ascii'),
    ('.fsb', 'free_surfer_binary'),
    ('.obj', 'obj'),
    ('.off', 'off'),
    ('.stl', 'stl'),
    ('.swc', 'swc'),
    ('.iwm', 'wasm'),
    ('.iwm.cbor', 'wasm'),
    ('.iwm.cbor.zst', 'wasm_zstd'),
])
