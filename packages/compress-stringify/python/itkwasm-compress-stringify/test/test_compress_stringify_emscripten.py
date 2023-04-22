import pytest
import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide

from itkwasm_compress_stringify import __version__ as test_package_version

@pytest.fixture
def package_wheel():
    return f"itkwasm_compress_stringify-{test_package_version}-py3-none-any.whl"

@run_in_pyodide(packages=['micropip'])
async def test_decompress_returns_what_was_compressed(selenium, package_wheel):
    import micropip
    await micropip.install([package_wheel])

    from itkwasm_compress_stringify import compress_stringify_async, parse_string_decompress_async

    data = bytes([222, 173, 190, 239])
    compressed_data = await compress_stringify_async(data, compression_level=8)
    decompressed_data = await parse_string_decompress_async(compressed_data)

    assert decompressed_data[0] == 222
    assert decompressed_data[1] == 173
    assert decompressed_data[2] == 190
    assert decompressed_data[3] == 239

@run_in_pyodide(packages=['micropip'])
async def test_we_can_stringify_during_compression(selenium, package_wheel):
    import micropip
    await micropip.install([package_wheel])

    from itkwasm_compress_stringify import compress_stringify_async, parse_string_decompress_async

    data = bytes([222, 173, 190, 239])
    compressed_data = await compress_stringify_async(data, compression_level=8, stringify=True)
    decoded = compressed_data.decode()
    assert decoded.lower() == 'data:base64,kluv/saeiqaa3q2+7w=='
    decompressed_data = await parse_string_decompress_async(compressed_data, parse_string=True)

    assert decompressed_data[0] == 222
    assert decompressed_data[1] == 173
    assert decompressed_data[2] == 190
    assert decompressed_data[3] == 239

@run_in_pyodide(packages=['micropip'])
async def test_we_can_use_a_custom_data_url_prefix(selenium, package_wheel):
    import micropip
    await micropip.install([package_wheel])

    from itkwasm_compress_stringify import compress_stringify_async, parse_string_decompress_async

    data = bytes([222, 173, 190, 239])
    compressed_data = await compress_stringify_async(data, compression_level=8, stringify=True, data_url_prefix='custom,')
    assert compressed_data.decode().lower() == 'custom,kluv/saeiqaa3q2+7w=='
    decompressed_data = await parse_string_decompress_async(compressed_data, parse_string=True)

    assert decompressed_data[0] == 222
    assert decompressed_data[1] == 173
    assert decompressed_data[2] == 190
    assert decompressed_data[3] == 239