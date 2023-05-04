from pathlib import Path 
import numpy as np
import json

def test_apply_presentation_state_to_dicom_image():
    from itkwasm_dicom_wasi import apply_presentation_state_to_image

    input_file = 'gsps-pstate-test-input-image.dcm'
    input_file_path = Path('..', '..', 'test', 'data', 'input', input_file)

    p_state_file = 'gsps-pstate-test-input-pstate.dcm'
    p_state_file_path = Path('..', '..', 'test', 'data', 'input', p_state_file)

    p_state_json_out, output_image = apply_presentation_state_to_image(input_file_path, p_state_file_path)

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
    baseline_json_file_path = Path('..', '..', 'test', 'data', 'baseline', baseline_json_file)
    with open(baseline_json_file_path, 'r') as fp:
        # the slice operation removes the last EOF char from the baseline file.
        buffer = fp.read()[:-1]
    baseline_json_object = json.loads(buffer)
    assert baseline_json_object['PresentationLabel'] == p_state_json_out['PresentationLabel']
    assert baseline_json_object['PresentationSizeMode'] == p_state_json_out['PresentationSizeMode']
    assert str(baseline_json_object) == str(p_state_json_out)

    baseline_image = 'gsps-pstate-image-baseline.pgm'
    baseline_image_file_path = Path('..', '..', 'test', 'data', 'baseline', baseline_image)
    with open(baseline_image_file_path, 'rb') as fp:
        baseline_buffer = fp.read()
    # slice to get only the pixel buffer from the baseline image (pgm file)
    baseline_pixels = baseline_buffer[15:]
    assert np.array_equal(np.frombuffer(baseline_pixels, dtype=np.uint8), output_image.data.ravel())
