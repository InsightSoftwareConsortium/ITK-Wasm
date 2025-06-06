ITK-Wasm
========

> Universal spatial analysis and visualization.

<div align="center">

![itk-wasm](_static/itk-webassembly.png)

[![Examples](https://github.com/InsightSoftwareConsortium/ITK-Wasm/actions/workflows/examples.yml/badge.svg)](https://github.com/InsightSoftwareConsortium/ITK-Wasm/actions/workflows/examples.yml) [![Toolchains](https://github.com/InsightSoftwareConsortium/ITK-Wasm/actions/workflows/toolchains.yml/badge.svg)](https://github.com/InsightSoftwareConsortium/ITK-Wasm/actions/workflows/toolchains.yml) [![JavaScript, TypeScript](https://github.com/InsightSoftwareConsortium/ITK-Wasm/actions/workflows/javascript-typescript.yml/badge.svg)](https://github.com/InsightSoftwareConsortium/ITK-Wasm/actions/workflows/javascript-typescript.yml) [![Python WASM](https://github.com/InsightSoftwareConsortium/ITK-Wasm/actions/workflows/python-wasm.yml/badge.svg)](https://github.com/InsightSoftwareConsortium/ITK-Wasm/actions/workflows/python-wasm.yml) [![C++,Native Python](https://github.com/InsightSoftwareConsortium/ITK-Wasm/actions/workflows/cxx-python.yml/badge.svg)](https://github.com/InsightSoftwareConsortium/ITK-Wasm/actions/workflows/cxx-python.yml) [![WASI](https://github.com/InsightSoftwareConsortium/ITK-Wasm/actions/workflows/wasi.yml/badge.svg)](https://github.com/InsightSoftwareConsortium/ITK-Wasm/actions/workflows/wasi.yml) [![Documentation](https://github.com/InsightSoftwareConsortium/ITK-Wasm/actions/workflows/documentation.yml/badge.svg)](https://github.com/InsightSoftwareConsortium/ITK-Wasm/actions/workflows/documentation.yml)

[![npm version](https://badge.fury.io/js/itk-wasm.svg)](https://www.npmjs.com/package/itk-wasm)
[![itkwasm version](https://badge.fury.io/py/itkwasm.svg)](https://pypi.org/project/itkwasm/)

[![DOI](https://zenodo.org/badge/45812381.svg)](https://zenodo.org/badge/latestdoi/45812381)
[![Give it a star!](https://img.shields.io/github/stars/InsightSoftwareConsortium/ITK-Wasm?style=social)](https://github.com/InsightSoftwareConsortium/ITK-Wasm)

![License](https://img.shields.io/github/license/InsightSoftwareConsortium/ITK-Wasm) ![GitHub commit activity](https://img.shields.io/github/commit-activity/y/InsightSoftwareConsortium/ITK-Wasm)
</div>

*ITK-Wasm* combines [ITK](https://www.itk.org/) and [WebAssembly](https://webassembly.org/) to enable high-performance spatial analysis in a web browser or system-level environments and reproducible execution across programming languages and hardware architectures.

The project provides tools to

- build C/C++ code to [WebAssembly](https://webassembly.org/).
- bridge local filesystems, JavaScript/TypeScript/Python data structures, and traditional file formats.
- transfer data efficiently in and out of the WebAssembly runtime.
- perform asynchronous, parallel execution of processing pipelines in a worker pool.

*ITK-Wasm* can be used to execute [ITK](https://www.itk.org/) or arbitrary C++ codes in the browser, on the command line, and in languages like Python via [WASI](https://wasi.dev/) and [Emscripten](https://emscripten.org) runtimes.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Ixz4NDk9kqU?si=uxWdjC7uebzv2RSK" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

If you use ITK-Wasm in your research, please cite [the following paper](https://doi.org/10.25080/TCFJ5130):

> McCormick, M., Elliott, P. (2024).
  ITK-Wasm: High-Performance Spatial Analysis Across Programming Languages and Hardware Architectures.
  Proceedings of the 23rd Python in Science Conference (SciPy 2024), 268-279.
  Published July 10, 2024. https://doi.org/10.25080/TCFJ5130

```{toctree}
:hidden:
:maxdepth: 3
:caption: 👋 Introduction

introduction/packages.md
introduction/parts.md
introduction/file_formats/index.md
```

```{toctree}
:hidden:
:maxdepth: 3
:caption: 🌐 JavaScript/TypeScript

typescript/interface_types/index.md
typescript/distribution/index.md
```

```{toctree}
:hidden:
:maxdepth: 3
:caption: 🐍 Python

python/introduction.md
python/numpy.md
python/itk_python.md
apidocs/index.rst
```

```{toctree}
:hidden:
:maxdepth: 3
:caption: 🧑‍💻 C++

cxx/installation.md
cxx/tutorial/index.md
cxx/interface_types.md
```

```{toctree}
:hidden:
:maxdepth: 3
:caption: 🔨 ITK-Wasm Development

model/index.md
development/hacking_itk_wasm.md
development/itk_js_to_itk_wasm_migration_guide.md
```
