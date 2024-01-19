# Constituent Parts

ITK-Wasm's goal is **to work harmoniously with WebAssembly (wasm) community standards to make the new stack for scientific computing a reality**.

ITK-Wasm adds the glue that enables *simple, performant, easy-to-reason about, composable, interoperable, and universally deployable* wasm modules to be created by your average [research software engineer](https://ukrse.github.io/who.html). This includes the ability to operate performantly on scientific datasets, with an emphasis on multi-dimensional spatial data.

Towards that end, ITK-Wasm provides powerful, joyful tooling for scientific computation in wasm through a number of distinct but related parts.

1. C++ core tooling
2. Build environment Docker images
3. A Node.js CLI to build wasm, generate language bindings, etc.
4. Small, language-specific libraries that facilicate idiomatic integration
5. Example packages built with ITK-Wasm
6. File format support

This section provides a high level overview of these constituent parts.

(cxx-core)=
## C++ core

ITK-Wasm's C++ core tooling provides:

1. Fundamental numerical methods and multidimensional scientific data structures
2. An elegant, modern interface to create processing pipelines
3. A bridge to interoperable web techologies
4. A bridge to Web3 and traditional desktop computing

These are embodied in the C++ core with:

1. [ITK]
2. [CLI11]
3. [RapidJSON]
4. [libcbor]

The Insight Toolkit ([ITK]) is an open-source, cross-platform library that provides developers with an extensive suite of software tools based on a proven, spatially-oriented architecture for processing scientific data in two, three, or more dimensions.
ITK includes fundamental numerical libraries, such as [Eigen](https://eigen.tuxfamily.org/index.php?title=Main_Page).
ITK's C++ template-based architecture inherently helps keep wasm modules small while enabling the compiler to add extensive performance optimizations.
The *itk-wasm* GitHub repository is also an [ITK Remote Module](https://github.com/InsightSoftwareConsortium/ITKModuleTemplate), `WebAssemblyInterface`, that implements wasm-interface specific functionality.

Wasm module C++ processing pipelines are written with [CLI11]'s simple and intuitive interface.

[RapidJSON] provides [JSON](https://json.org)-related functionality since it is not only [extremely fast](https://github.com/miloyip/nativejson-benchmark?tab=readme-ov-file#parsing-time) but also [extremely small](https://github.com/miloyip/nativejson-benchmark?tab=readme-ov-file#code-size), which is critical for WebAssembly.

The ability to read and write to files, providing a bridge to [Web3] and traditional desktop computing, is built on [libcbor], which is another tiny footprint library.

(docker)=
## Build environment Docker images

Build environment Docker images encapsulate

1. The ITK-Wasm C++ core
2. An [Emscripten] or [WASI] toolchain
3. Additional wasm tools and configurations

These [`itkwasm/emscripten`] and  [`itkwasm/wasi`] Docker images are [dockcross] images -- Docker images with pre-configured C++ cross-compiling toolchains that enable easy-application, reproducible builds, and a clean separation of the build environment, source tree, and build artifacts.

These images include not only the CMake pre-configured toolchains, but pre-built versions of the ITK-Wasm C++ core. Moreover, wasm tools for optimization, debugging, emulation and system execution, testing, are bundled. A number of build and system configurations are included to make optimized and debuggable builds for scientific codebases a breeze.

(cli)=
## Command line interface (CLI)

An `itk-wasm` *command line interface (CLI)* drives

- builds,
- generation of language bindings and language package configuration,
- and testing for wasm binaries.

The CLI can be installed via
[Node.js / NPM](https://nodejs.org/en/download/)

```sh
npm install -g itk-wasm
```

(language-libraries)=
## Language-specific libraries

Small, language-specific libraries are used by generated bindings to provide simple, clean, performant, and idiomatic interfaces in the host languages.

In TypeScript / JavaScript, this is the NPM [itk-wasm](https://www.npmjs.com/search?q=itk-wasm) package and in Python this is the PyPI [itkwasm](https://pypi.org/project/itkwasm/) package.

(packages)=
## Example packages

While most ITK-Wasm packages are not developed in the `InsightSoftwareConsortium/itk-wasm` repository -- a package built with ITK-Wasm can be developed by anyone and maintained in any repository -- there are a number of packages developed in the `itk-wasm` repository. These packages

- provide common functionality for other packages, such as testing and IO functionality,
- demonstrate capabilities,
- and continuously exercise and test the base functionality.

Descriptions of these packages can be found in the [package listing page](./packages.md).

(file-format)=
## File format support

Assistance for handling data serialized in file formats plays a crucial role in enabling comprehensive analysis using a variety of software tools.

ITK-Wasm offers IO modules designed to interact with various standard scientific image and mesh file formats. These modules allow for the loading of data into language-native interface types through bindings like TypeScript and Python.

In addition to supporting external file formats, ITK-Wasm also introduces its own file formats. These ITK-Wasm file formats are optimized and offer a direct correspondence to spatial interface types, utilizing a straightforward JSON + binary array buffer format.

More information can be found in the [File Format Section](./file_formats/index.md).

[ITK]: https://docs.itk.org
[CLI11]: https://github.com/CLIUtils/CLI11
[RapidJSON]: https://rapidjson.org/
[libcbor]: https://libcbor.readthedocs.io/
[Emscripten]: https://emscripten.org/
[WASI]: https://wasi.dev
[`itkwasm/emscripten`]: https://hub.docker.com/r/itkwasm/emscripten
[`itkwasm/wasi`]: https://hub.docker.com/r/itkwasm/wasi
[Web3]: https://en.wikipedia.org/wiki/Web3
[dockcross]: https://github.com/dockcross/dockcross
[CMake]: https://cmake.org