# Python, NumPy interop

`itkwasm` interface types, used in function calls, are standard [Python `dataclasses`](https://docs.python.org/3/library/dataclasses.html). These interface types are composed of standard Python datatypes, `dict`, `list`, `float`, `int`, and [NumPy](https://numpy.org/) arrays.

## Convert from `itkwasm` to `dict`

To convert from an `itkwasm` dataclass interface type to a Python dictionary, use [`asdict`](https://docs.python.org/3/library/dataclasses.html#dataclasses.asdict) from the Python standard library.

An example with [`itkwasm.Image`](#itkwasm.image.Image):

```python
from itkwasm import Image
image = Image()

from dataclasses import asdict
image_dict = asdict(image)
```

## Convert from `dict` to `itkwasm`

To convert back to an `itkwasm` interface type, use the `**` Python operator to expand the dictionary into keyword arguments for the dataclass constructor.

```python
from itkwasm import Image
image = Image(**image_dict)
```