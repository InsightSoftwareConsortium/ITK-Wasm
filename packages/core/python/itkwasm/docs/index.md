itkwasm
=======

> Universal spatial analysis and visualization.

<div align="center">

![itk-wasm](_static/itk-webassembly.png)

[![Examples](https://github.com/InsightSoftwareConsortium/itk-wasm/actions/workflows/examples.yml/badge.svg)](https://github.com/InsightSoftwareConsortium/itk-wasm/actions/workflows/examples.yml) [![Toolchains](https://github.com/InsightSoftwareConsortium/itk-wasm/actions/workflows/toolchains.yml/badge.svg)](https://github.com/InsightSoftwareConsortium/itk-wasm/actions/workflows/toolchains.yml) [![JavaScript,TypeScript](https://github.com/InsightSoftwareConsortium/itk-wasm/actions/workflows/javascript-typescript.yml/badge.svg)](https://github.com/InsightSoftwareConsortium/itk-wasm/actions/workflows/javascript-typescript.yml) [![Python WASM](https://github.com/InsightSoftwareConsortium/itk-wasm/actions/workflows/python-wasm.yml/badge.svg)](https://github.com/InsightSoftwareConsortium/itk-wasm/actions/workflows/python-wasm.yml) [![C++,Native Python](https://github.com/InsightSoftwareConsortium/itk-wasm/actions/workflows/cxx-python.yml/badge.svg)](https://github.com/InsightSoftwareConsortium/itk-wasm/actions/workflows/cxx-python.yml) [![WASI](https://github.com/InsightSoftwareConsortium/itk-wasm/actions/workflows/wasi.yml/badge.svg)](https://github.com/InsightSoftwareConsortium/itk-wasm/actions/workflows/wasi.yml)

[![itkwasm version](https://badge.fury.io/py/itkwasm.svg)](https://pypi.org/project/itkwasm/)

[![DOI](https://zenodo.org/badge/45812381.svg)](https://zenodo.org/badge/latestdoi/45812381)

![License](https://img.shields.io/github/license/InsightSoftwareConsortium/itk-wasm) ![GitHub commit activity](https://img.shields.io/github/commit-activity/y/InsightSoftwareConsortium/itk-wasm)
</div>

*itk-wasm* combines [ITK](https://www.itk.org/) and [WebAssembly](https://webassembly.org/) to enable high-performance spatial analysis in a web browser or system-level environments and reproducible execution across programming languages and hardware architectures.

The project provides tools to

- build C/C++ code to [WebAssembly](https://webassembly.org/).
- bridge local filesystems, JavaScript/TypeScript/Python data structures, and traditional file formats.
- transfer data efficiently in and out of the WebAssembly runtime.
- perform asynchronous, parallel execution of processing pipelines in a worker pool.

*itk-wasm* can be used to execute [ITK](https://www.itk.org/) or arbitrary C++ codes in the browser, on the command line, and in languages like Python via [WASI](https://wasi.dev/) and [Emscripten](https://emscripten.org) runtimes.

This site provides the Python documentation. There is also [C++ and JavaScript/TypeScript documentation](https://wasm.itk.org/).

```{toctree}
:hidden:
introduction.md
numpy.md
itk_python.md
```

```{toctree}
:hidden:
:maxdepth: 3
:caption: 📖 Reference

apidocs/index.rst
C++/JavaScript Docs <https://wasm.itk.org/>
```