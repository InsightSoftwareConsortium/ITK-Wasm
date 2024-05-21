import sys

if sys.version_info < (3, 10):
    from importlib_metadata import distribution
else:
    from importlib.metadata import distribution

from numpy.typing import ArrayLike

try:
    import cupy

    _CUPY_AVAILABLE = True
except:
    _CUPY_AVAILABLE = False

try:
    distribution("dask")
    _DASK_AVAILABLE = True
except:
    _DASK_AVAILABLE = False


def is_cupy_array(arr: ArrayLike) -> bool:
    """Check if the input is a CuPy array.

    :param arr: Input array
    :type  arr: ArrayLike

    :return: True if the input is a CuPy array
    :rtype:  bool
    """
    if not _CUPY_AVAILABLE:
        return False
    import cupy as cp

    return isinstance(arr, cp.ndarray)


def array_like_to_cupy_array(arr: ArrayLike) -> "cp.ndarray":
    """Convert a numpy array-like to a cupy ndarray.

    :param arr: numpy ndarray like
    :type  arr: ArrayLike

    :return: cupy array
    :rtype:  cp.ndarray
    """
    import cupy as cp

    if isinstance(arr, cp.ndarray):
        return arr
    if _DASK_AVAILABLE:
        import dask.array as da

        if isinstance(arr, da.Array):
            arr = arr.compute()
        if isinstance(arr, cp.ndarray):
            return arr
    return cp.array(arr)
