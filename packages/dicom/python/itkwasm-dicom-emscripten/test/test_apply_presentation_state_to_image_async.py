import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide
from .fixtures import package_wheel, input_data

@run_in_pyodide(packages=['micropip'])
async def test_apply_presentation_state_to_dicom_image(selenium, package_wheel, input_data):
    import json

    import micropip
    await micropip.install(package_wheel)
    def write_input_data_to_fs(input_data, filename):
        with open(filename, 'wb') as fp:
            fp.write(input_data[filename])

    from itkwasm_dicom_emscripten import apply_presentation_state_to_image_async
    import numpy as np

    input_file = 'gsps-pstate-test-input-image.dcm'
    write_input_data_to_fs(input_data, input_file)

    p_state_file = 'gsps-pstate-test-input-pstate.dcm'
    write_input_data_to_fs(input_data, p_state_file)

    from itkwasm.pyodide import to_js
    p_state_json_out, output_image = await apply_presentation_state_to_image_async(input_file, p_state_file)

    assert p_state_json_out != None
    assert output_image != None

    assert output_image.imageType.dimension == 2
    assert output_image.imageType.componentType == 'uint8'
    assert output_image.imageType.pixelType == 'Scalar'
    assert output_image.imageType.components == 1

    assert np.array_equal(output_image.origin, [0, 0])
    assert np.array_equal(output_image.spacing, [0.683, 0.683])
    assert np.array_equal(output_image.direction, [[1, 0], [0, 1]])
    assert np.array_equal(output_image.size, [512, 512])

    baseline_json_file = 'gsps-pstate-baseline.json'
    write_input_data_to_fs(input_data, baseline_json_file)
    with open(baseline_json_file, 'r') as fp:
        # the slice operation removes the last EOF char from the baseline file.
        buffer = fp.read()[:-1]
    baseline_json_object = json.loads(buffer)
    assert baseline_json_object['PresentationLabel'] == p_state_json_out['PresentationLabel']
    assert baseline_json_object['PresentationSizeMode'] == p_state_json_out['PresentationSizeMode']

    baseline_image = 'gsps-pstate-image-baseline.pgm'
    baseline_buffer = input_data[baseline_image]
    # slice to get only the pixel buffer from the baseline image (pgm file)
    baseline_pixels = baseline_buffer[15:]
    assert np.array_equal(np.frombuffer(baseline_pixels, dtype=np.uint8), output_image.data.ravel())