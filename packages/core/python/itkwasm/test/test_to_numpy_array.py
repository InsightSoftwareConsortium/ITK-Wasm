import numpy as np

import pytest

from itkwasm import array_like_to_numpy_array

pytest.importorskip("cupy")


def test_array_like_to_numpy_array():
    arr = np.array([1, 2, 3])
    result = array_like_to_numpy_array(arr)
    assert isinstance(result, np.ndarray)
    assert np.array_equal(result, arr)

    import cupy as cp

    arr = cp.array([1, 2, 3])
    result = array_like_to_numpy_array(arr)
    assert isinstance(result, np.ndarray)
    assert np.array_equal(result, arr.get())
