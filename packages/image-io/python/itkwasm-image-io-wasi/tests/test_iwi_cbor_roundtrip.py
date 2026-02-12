"""Cross-format round-trip tests through IWI CBOR format.

These tests verify that images can be:
1. Read from various formats (PNG, MHA, NRRD)
2. Written to .iwi.cbor
3. Read back from .iwi.cbor
4. Written to a target format
5. Read back and verified against the original

This covers the exact workflow from the reported issue where uint8 images
round-tripped through .iwi.cbor produced corrupted NRRD output.
"""

import numpy as np

from itkwasm_image_io_wasi import (
    png_read_image,
    png_write_image,
    meta_read_image,
    meta_write_image,
    nrrd_write_image,
    nrrd_read_image,
    wasm_read_image,
    wasm_write_image,
    read_image,
    write_image,
)

from .common import test_input_path, test_output_path


# ---------------------------------------------------------------------------
# uint8 RGB: PNG -> IWI CBOR -> PNG
# ---------------------------------------------------------------------------
def test_png_to_iwi_cbor_to_png_uint8():
    """Round-trip uint8 RGB image: PNG -> IWI CBOR -> PNG."""
    # Step 1: Read PNG (uint8 RGB)
    could_read, original = png_read_image(test_input_path / "cthead1.png")
    assert could_read
    assert original.imageType.componentType == "uint8"
    assert original.imageType.pixelType == "RGB"
    assert original.data.dtype == np.uint8

    # Step 2: Write to IWI CBOR
    cbor_path = test_output_path / "roundtrip-uint8-rgb.iwi.cbor"
    could_write = wasm_write_image(original, str(cbor_path))
    assert could_write

    # Step 3: Read back from IWI CBOR
    could_read, from_cbor = wasm_read_image(cbor_path)
    assert could_read
    assert from_cbor.imageType.componentType == "uint8"
    assert from_cbor.imageType.pixelType == "RGB"
    assert from_cbor.data.dtype == np.uint8

    # Step 4: Verify pixel data survives the round-trip
    np.testing.assert_array_equal(original.data, from_cbor.data)

    # Step 5: Write to PNG and read back to verify full cross-format integrity
    png_path = test_output_path / "roundtrip-uint8-rgb-from-cbor.png"
    could_write = png_write_image(from_cbor, png_path)
    assert could_write

    could_read, final = png_read_image(png_path)
    assert could_read
    assert final.imageType.componentType == "uint8"
    assert final.data.dtype == np.uint8
    np.testing.assert_array_equal(original.data, final.data)


# ---------------------------------------------------------------------------
# uint8 Scalar 3D: MHA -> IWI CBOR -> MHA
# ---------------------------------------------------------------------------
def test_mha_to_iwi_cbor_to_mha_uint8():
    """Round-trip uint8 Scalar 3D image: MHA -> IWI CBOR -> MHA."""
    # Step 1: Read MHA (uint8 Scalar, 3D)
    could_read, original = meta_read_image(test_input_path / "brainweb165a10f17.mha")
    assert could_read
    assert original.imageType.dimension == 3
    assert original.imageType.componentType == "uint8"
    assert original.imageType.pixelType == "Scalar"
    assert original.data.dtype == np.uint8

    # Step 2: Write to IWI CBOR
    cbor_path = test_output_path / "roundtrip-uint8-scalar-3d.iwi.cbor"
    could_write = wasm_write_image(original, str(cbor_path))
    assert could_write

    # Step 3: Read back from IWI CBOR
    could_read, from_cbor = wasm_read_image(cbor_path)
    assert could_read
    assert from_cbor.imageType.dimension == 3
    assert from_cbor.imageType.componentType == "uint8"
    assert from_cbor.imageType.pixelType == "Scalar"
    assert from_cbor.data.dtype == np.uint8

    # Step 4: Verify pixel data survives the round-trip
    np.testing.assert_array_equal(original.data, from_cbor.data)

    # Step 5: Write to MHA and read back for full cross-format verification
    mha_path = test_output_path / "roundtrip-uint8-scalar-3d-from-cbor.mha"
    could_write = meta_write_image(from_cbor, mha_path)
    assert could_write

    could_read, final = meta_read_image(mha_path)
    assert could_read
    assert final.imageType.componentType == "uint8"
    assert final.data.dtype == np.uint8
    np.testing.assert_array_equal(original.data, final.data)


# ---------------------------------------------------------------------------
# uint8 Scalar 3D: MHA -> IWI CBOR -> NRRD (the exact reported bug scenario)
# ---------------------------------------------------------------------------
def test_mha_to_iwi_cbor_to_nrrd_uint8():
    """Round-trip uint8 3D image: MHA -> IWI CBOR -> NRRD.

    This test covers the exact scenario from the bug report where uint8
    images written through IWI CBOR produce corrupted NRRD output with
    WASM binary strings in the pixel data.
    """
    # Step 1: Read MHA (uint8 Scalar, 3D)
    could_read, original = meta_read_image(test_input_path / "brainweb165a10f17.mha")
    assert could_read
    assert original.imageType.componentType == "uint8"
    assert original.data.dtype == np.uint8
    original_data_flat = original.data.ravel().copy()

    # Step 2: Write to IWI CBOR
    cbor_path = test_output_path / "roundtrip-uint8-to-nrrd.iwi.cbor"
    could_write = wasm_write_image(original, str(cbor_path))
    assert could_write

    # Step 3: Read back from IWI CBOR
    could_read, from_cbor = wasm_read_image(cbor_path)
    assert could_read
    assert from_cbor.imageType.componentType == "uint8"
    assert from_cbor.data.dtype == np.uint8

    # Verify data integrity after IWI CBOR round-trip
    np.testing.assert_array_equal(original_data_flat, from_cbor.data.ravel())

    # Step 4: Write to NRRD
    nrrd_path = test_output_path / "roundtrip-uint8-from-cbor.nrrd"
    could_write = nrrd_write_image(from_cbor, nrrd_path)
    assert could_write

    # Step 5: Read NRRD back and verify against original
    could_read, from_nrrd = nrrd_read_image(nrrd_path)
    assert could_read
    assert from_nrrd.imageType.componentType == "uint8"
    assert from_nrrd.data.dtype == np.uint8

    # This is the critical check: the NRRD pixel data must match the original
    np.testing.assert_array_equal(original_data_flat, from_nrrd.data.ravel())


# ---------------------------------------------------------------------------
# uint8 RGB 2D: PNG -> IWI CBOR -> NRRD (2D variant of the reported bug)
# ---------------------------------------------------------------------------
def test_png_to_iwi_cbor_to_nrrd_uint8():
    """Round-trip uint8 RGB 2D image: PNG -> IWI CBOR -> NRRD."""
    # Step 1: Read PNG (uint8 RGB)
    could_read, original = png_read_image(test_input_path / "cthead1.png")
    assert could_read
    assert original.imageType.componentType == "uint8"
    assert original.data.dtype == np.uint8
    original_data_flat = original.data.ravel().copy()

    # Step 2: Write to IWI CBOR
    cbor_path = test_output_path / "roundtrip-uint8-rgb-to-nrrd.iwi.cbor"
    could_write = wasm_write_image(original, str(cbor_path))
    assert could_write

    # Step 3: Read back from IWI CBOR
    could_read, from_cbor = wasm_read_image(cbor_path)
    assert could_read
    assert from_cbor.imageType.componentType == "uint8"
    assert from_cbor.data.dtype == np.uint8
    np.testing.assert_array_equal(original_data_flat, from_cbor.data.ravel())

    # Step 4: Write to NRRD and read back
    nrrd_path = test_output_path / "roundtrip-uint8-rgb-from-cbor.nrrd"
    could_write = nrrd_write_image(from_cbor, nrrd_path)
    assert could_write

    could_read, from_nrrd = nrrd_read_image(nrrd_path)
    assert could_read
    assert from_nrrd.imageType.componentType == "uint8"
    assert from_nrrd.data.dtype == np.uint8
    np.testing.assert_array_equal(original_data_flat, from_nrrd.data.ravel())


# ---------------------------------------------------------------------------
# High-level read_image/write_image dispatch: IWI CBOR round-trip
# ---------------------------------------------------------------------------
def test_dispatch_iwi_cbor_roundtrip_uint8():
    """Test using the high-level read_image/write_image with IWI CBOR (uint8)."""
    # Read PNG via dispatch
    original = read_image(test_input_path / "cthead1.png")
    assert original.imageType.componentType == "uint8"
    assert original.data.dtype == np.uint8
    original_data_flat = original.data.ravel().copy()

    # Write to IWI CBOR via dispatch
    cbor_path = test_output_path / "dispatch-roundtrip-uint8.iwi.cbor"
    write_image(original, cbor_path)

    # Read back via dispatch
    from_cbor = read_image(cbor_path)
    assert from_cbor.imageType.componentType == "uint8"
    assert from_cbor.data.dtype == np.uint8
    np.testing.assert_array_equal(original_data_flat, from_cbor.data.ravel())

    # Write to NRRD via dispatch
    nrrd_path = test_output_path / "dispatch-roundtrip-uint8-from-cbor.nrrd"
    write_image(from_cbor, nrrd_path)

    # Read NRRD back and verify
    from_nrrd = read_image(nrrd_path)
    assert from_nrrd.imageType.componentType == "uint8"
    assert from_nrrd.data.dtype == np.uint8
    np.testing.assert_array_equal(original_data_flat, from_nrrd.data.ravel())


# ---------------------------------------------------------------------------
# Float32: Verify float32 also works (control test)
# ---------------------------------------------------------------------------
def test_iwi_cbor_roundtrip_float32():
    """Round-trip float32 image through IWI CBOR as a control test.

    The reported issue claims float32 works but uint8 fails.
    This test confirms float32 continues to work correctly.
    """
    from itkwasm import Image, ImageType, FloatTypes, PixelTypes

    # Create a synthetic float32 image
    dimension = 3
    size = [5, 6, 7]
    data = np.arange(5 * 6 * 7, dtype=np.float32) * 0.1

    image = Image(
        imageType=ImageType(
            dimension=dimension,
            componentType=FloatTypes.Float32,
            pixelType=PixelTypes.Scalar,
            components=1,
        ),
        origin=[1.0, 2.0, 3.0],
        spacing=[0.5, 0.5, 0.5],
        size=size,
        data=data.reshape((7, 6, 5)),
    )

    # Write to IWI CBOR
    cbor_path = test_output_path / "roundtrip-float32.iwi.cbor"
    could_write = wasm_write_image(image, str(cbor_path))
    assert could_write

    # Read back
    could_read, from_cbor = wasm_read_image(cbor_path)
    assert could_read
    assert from_cbor.imageType.componentType == "float32"
    assert from_cbor.data.dtype == np.float32

    np.testing.assert_array_almost_equal(
        image.data.ravel(), from_cbor.data.ravel(), decimal=6
    )

    # Write to NRRD and verify
    nrrd_path = test_output_path / "roundtrip-float32-from-cbor.nrrd"
    could_write = nrrd_write_image(from_cbor, nrrd_path)
    assert could_write

    could_read, from_nrrd = nrrd_read_image(nrrd_path)
    assert could_read
    assert from_nrrd.imageType.componentType == "float32"
    assert from_nrrd.data.dtype == np.float32
    np.testing.assert_array_almost_equal(
        image.data.ravel(), from_nrrd.data.ravel(), decimal=6
    )


# ---------------------------------------------------------------------------
# Multiple component types: Verify all common types work through IWI CBOR
# ---------------------------------------------------------------------------
def test_iwi_cbor_roundtrip_uint16():
    """Round-trip uint16 Scalar image through IWI CBOR."""
    from itkwasm import Image, ImageType, IntTypes, PixelTypes

    size = [4, 5, 3]
    data = np.arange(4 * 5 * 3, dtype=np.uint16) * 100

    image = Image(
        imageType=ImageType(
            dimension=3,
            componentType=IntTypes.UInt16,
            pixelType=PixelTypes.Scalar,
            components=1,
        ),
        size=size,
        data=data.reshape((3, 5, 4)),
    )

    cbor_path = test_output_path / "roundtrip-uint16.iwi.cbor"
    could_write = wasm_write_image(image, str(cbor_path))
    assert could_write

    could_read, from_cbor = wasm_read_image(cbor_path)
    assert could_read
    assert from_cbor.imageType.componentType == "uint16"
    assert from_cbor.data.dtype == np.uint16
    np.testing.assert_array_equal(image.data.ravel(), from_cbor.data.ravel())


def test_iwi_cbor_roundtrip_int16():
    """Round-trip int16 Scalar image through IWI CBOR."""
    from itkwasm import Image, ImageType, IntTypes, PixelTypes

    size = [4, 5, 3]
    data = (np.arange(4 * 5 * 3, dtype=np.int16) - 30) * 100

    image = Image(
        imageType=ImageType(
            dimension=3,
            componentType=IntTypes.Int16,
            pixelType=PixelTypes.Scalar,
            components=1,
        ),
        size=size,
        data=data.reshape((3, 5, 4)),
    )

    cbor_path = test_output_path / "roundtrip-int16.iwi.cbor"
    could_write = wasm_write_image(image, str(cbor_path))
    assert could_write

    could_read, from_cbor = wasm_read_image(cbor_path)
    assert could_read
    assert from_cbor.imageType.componentType == "int16"
    assert from_cbor.data.dtype == np.int16
    np.testing.assert_array_equal(image.data.ravel(), from_cbor.data.ravel())


def test_iwi_cbor_roundtrip_float64():
    """Round-trip float64 Scalar image through IWI CBOR."""
    from itkwasm import Image, ImageType, FloatTypes, PixelTypes

    size = [3, 4, 2]
    data = np.linspace(-1.0, 1.0, 3 * 4 * 2, dtype=np.float64)

    image = Image(
        imageType=ImageType(
            dimension=3,
            componentType=FloatTypes.Float64,
            pixelType=PixelTypes.Scalar,
            components=1,
        ),
        size=size,
        data=data.reshape((2, 4, 3)),
    )

    cbor_path = test_output_path / "roundtrip-float64.iwi.cbor"
    could_write = wasm_write_image(image, str(cbor_path))
    assert could_write

    could_read, from_cbor = wasm_read_image(cbor_path)
    assert could_read
    assert from_cbor.imageType.componentType == "float64"
    assert from_cbor.data.dtype == np.float64
    np.testing.assert_array_almost_equal(
        image.data.ravel(), from_cbor.data.ravel(), decimal=12
    )
