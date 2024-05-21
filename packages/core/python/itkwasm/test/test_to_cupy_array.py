import numpy as np

import pytest

from itkwasm import array_like_to_cupy_array

pytest.importorskip("cupy")


def test_array_like_to_numpy_array():
    import cupy as cp

    arr = np.array([1, 2, 3])
    result = array_like_to_cupy_array(arr)
    assert isinstance(result, cp.ndarray)
    assert np.array_equal(result.get(), arr)

    arr = cp.array([1, 2, 3])
    result = array_like_to_cupy_array(arr)
    assert isinstance(result, cp.ndarray)
    assert np.array_equal(result.get(), arr.get())
