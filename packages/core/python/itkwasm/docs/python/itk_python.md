# ITK Python interop

`itkwasm` can be used with native [`itk` Python bindings](https://itkpythonpackage.readthedocs.io/en/master/Quick_start_guide.html).

Both packages support common Python dictionary representations of the data structures used on interfaces. The non-dictionary types are more convenient to work with directly and provide strong typing for function calls.

## Convert from `itkwasm` to `itk`

To convert from an `itkwasm` dataclass interface type to a native `itk` Python type, first convert the `itkwasm` type to a dictionary, then use the `itk.<type>_from_dict` function. Example:

```python
from itkwasm import Image
from dataclasses import asdict
itkwasm_image = Image()
image_dict = asdict(itkwasm_image)

import itk
itk_image = itk.image_from_dict(image_dict)
```

## Convert from `itk` to `itkwasm`

To convert from a native `itk` Python type to an `itkwasm` dataclass interface type, first convert the `itkwasm` type to a dictionary the `itk.<type>_from_dict`, then pass the dictionary as keyword arguments to `itkwasm` constructor with the `**` operator. Example:


```python
import itk
# Create an itk.Image
itk_image = itk.Image.New()
itk_image.SetRegions([8,8])
itk_image.Allocate()
image_dict = itk.dict_from_image(itk_image)

from itkwasm import Image
itkwasm_image = Image(**image_dict)
```

## itkwasm file formats

`itkwasm` provides file formats corresponding to its interface types. These file formats keep wasm module sizes tiny, enable efficient and one-to-one serialization, assist with debugging, and bridge with [Web3 technologies](https://en.wikipedia.org/wiki/Web3).

The file extensions for these formats are `.iwi` and `.iwm` for images and mesh-like data, respectively. When written, these will output directories with an `index.json` file and raw binary files. When `.iwi.cbor` or `.iwm.cbor` extensions are used, a single [CBOR](https://en.wikipedia.org/wiki/CBOR) file is created.

These file formats can also be used with native ITK Python.

Install the binary Python package:

```shell
pip install itk-webassemblyinterface
```

Then use with `itk.imread`, `itk.imwrite`, `itk.meshread`, `itk.meshwrite`. Example:

```python
import itk

image = itk.imread('cthead1.png')
itk.imwrite(image, 'cthead1.iwi')
itk.imwrite(image, 'cthead1.iwi.cbor')

mesh = itk.meshread('cow.vtk')
itk.meshwrite(mesh, 'cow.iwm')
itk.meshwrite(mesh, 'cow.iwm.cbor')
```