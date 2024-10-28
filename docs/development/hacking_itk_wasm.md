# Hacking ITK-Wasm

## TLDR

Install [Podman] and [Pixi], and

```sh
npm i -g pnpm
pnpm install
pnpm build
pnpm test
```

and contribute the patch with standard GitHub best practices.

## Introduction

**Welcome to the ITK community! ☀️**

We are glad you are here and appreciate your contribution. Please keep in mind our [community participation guidelines](https://github.com/InsightSoftwareConsortium/ITK/blob/master/CODE_OF_CONDUCT.md).

We follow [standard GitHub contribution best practices]: pull requests made from forks are tested with continuous integration tests, and updates are made via code review before integration.

We use the [conventional commit] standard for our commit message format in the *itk-wasm* repository.

The C++ core and Docker build environment can be developed independently from the CLI, language-specific libraries, and example packages. The latter are developed as a [pnpm workspace]. Individual packages in the workspace can be developed independently after `pnpm install` is executed at the root.

The following sections describe how to contribute to [**ITK-Wasm's constituent parts**](../introduction/parts.md).

## C++ core

ITK-Wasm's [C++ core](../introduction/parts.md#cxx-core) can be developed with native toolchains. The steps are:

0. Install a [C++ compiler toolchain] and [CMake]
1. Build [ITK]
2. Build the `WebAssemblyInterface` module from this module against ITK
3. Run the tests

We recommend using [pixi](https://pixi.sh) with a bash shell (including on Windows).
The steps to build and test the C++ core with a native toolchain are:

1. Install pixi: `curl -fsSL https://pixi.sh/install.sh | bash`
2. Clone [the ITK-Wasm GitHub repository](https://github.com/InsightSoftwareConsortium/ITK-Wasm)
3. Run `pixi run test-itk-wasm`

For additional guidance on C++ development, see the [ITK Software Guide].

If changes are needed in the ITK repository, start from the [current repository and branch] where we store changes that are being pushed upstream.

### Testing data

To prevent Git repository bloat, we add testing data through [CMake content links](https://docs.itk.org/en/latest/contributing/upload_binary_data.html) of [Content Identifiers (CIDs)](https://proto.school/anatomy-of-a-cid). To add new test data,

1. Upload the data and download its content link *.cid* file with the [CMake w3 ExternalData Upload Tool](https://content-link-upload.itk.org/)
2. Move the *.cid* file to *itk-wasm/test/Input/*
3. Reference the content link with a `DATA{<path>}` call in *itk-wasm/test/CMakeLists.txt*.

## Build environment Docker images

Builds of the [wasm build environment Docker images](../introduction/parts.md#docker) or WebAssembly modules require [Podman].
*Note*: on Linux, ensure the [`vfs` podman storage driver is not used for best performance](https://github.com/containers/podman/issues/13226#issuecomment-1555872420).

To pull the `latest` the build environment Docker images,

```sh
./src/docker/pull.sh
```

To build the `latest` build environment Docker images from the Docker configuration and local C++ core,

```sh
pixi run build-docker-images --with-debug
```

The `--with-debug` flag will also build the `latest-debug` tagged images.

To use these locally built images in the pnpm build, remove (*clean*) the old build artifacts from the repository first.

```sh
# Remove old build artifacts
pnpm clean

pnpm install
pnpm build
```

## Command line interface (CLI)

The `itk-wasm` [command line interface (CLI)](../introduction/parts.md#cli) is a [Node.js / NPM] script developed with the [PNPM] package manager tool. This CLI is included with the [`itk-wasm` package].

Development requires:

1. [Node.js / NPM](https://nodejs.org/en/download/)
2. Bash, e.g. macOS or Linux terminal, [Windows Git Bash] or [WSL] terminal
3. [PNPM], which can be installed with `npm i -g pnpm`
4. Chrome and Firefox installed

To build and test the CLI,

```sh
git clone https://github.com/InsightSoftwareConsortium/ITK-Wasm
cd itk-wasm/packages/core/typescript/itk-wasm
pnpm install
pnpm build
pnpm test
```

## Language binding libraries

The [language binding libaries](../introduction/parts.md#language-libraries):

### JavaScript

The development of `itk-wasm` is described above in the Command line interface section.

### Python

To develop the `itkwasm` Python package, which configured with [hatch](https://hatch.pypa.io/latest/):

```sh
git clone https://github.com/InsightSoftwareConsortium/ITK-Wasm
cd itk-wasm/packages/core/python/itkwasm

pip install hatch
hatch run download-pyodide
hatch run test
```

## Example packages

[Example packages](../introduction/parts.md#example-packages) are maintained in the *itk-wasm/packages/* directory. These packages contain in the top level directory

1. their C++ pipelines,
2. CMake configuration code,
3. a NPM *package.json* file to drive the build with pnpm.

To develop these packages, at the top level, run:

```sh
npm i -g pnpm
pnpm install
pnpm build
pnpm test
```

This will build and test the packages in order, according to their dependency topology, and the packages will use local workspace dependencies, including the `itk-wasm` CLI.

The `build` and `test` targets are high-level targets that call other targets. They include targets for direct WebAssembly execution, TypeScript bindings, and Python bindings. These can be called individually either with [pnpm filters] or by changing into the package directory and calling the targets from there.

### Debug builds

In development, it often useful to [build the wasm in debug mode](../cxx/tutorial/debugging.md). To create a debug build, at the root level, clean the tree, call `build:emscripten:debug` and `build:wasi:debug`, then `build` and `test` as usual:

```sh
pnpm clean
pnpm build:emscripten:debug
pnpm build:wasi:debug
pnpm build
pnpm test
```

### Testing data

Testing data is stored in a package's *test/data* directory and shared across the direct wasm and language bindings tests. It is downloaded via the `test:data:download` target, which is called by the `test` target.

To add new or modify testing data, add new files into the *test/data/input/* or *test/data/baseline/* directory, then run:

```sh
pnpm test:data:pack
```

This will generate a new *test/data.tar.gz* tarball and output its CID.

Upload the tarball to a publicly hosted HTTP location. A few example free services that can serve files include [FileBase], [web3.storage], and [data.kitware.com].

Then, update the CID and HTTP URL in *package.json*.

## Documentation

The [wasm.itk.org](https://wasm.itk.org/) documentation sources are found at the *docs/* directory.

Documentation for individual packages's documentation can be found in the *typescript/README.md*, or *python/\<dispatch-package-name\>/docs* directory.

To preview wasm.itk.org documentation changes, three options are available.

### Option 0: Edit on GitHub, use the pull request preview

If files are edited with GitHub's web user interface, the pull request will
build a preview of changes with a pull request check called `docs/readthedocs.org:itkwasm`.
Click on the *Details* link to view the documentation build preview.

### Option 1: Build and serve locally

To compile the document locally create a python virtual environment and install the required packages.

For example in Linux / macOS:

```bash
cd itk-wasm/docs
python -m venv env
source env/bin/activate
pip install -r requirements.txt
```

Use `make html` in this directory to build the documentation.
Open `_build/html/index.html` in your browser to inspect the result.

### Option 2: Autobuild and serve locally

To automatically rebuild the website with any input markdown changes and serve
the result, use [sphinx-autobuild]

```bash
cd itk-wasm/docs
pip install -r requirements.txt
pip install sphinx-autobuild
```

```bash
sphinx-autobuild -a . _build/html
```

This will start a server at [http://127.0.0.1:8000](http://127.0.0.1:8000)
and rebuild whenever the documentation changes.

[C++ compiler toolchain]: https://docs.itk.org/en/latest/supported_compilers.html
[CMake]: https://cmake.org
[conventional commit]: https://www.conventionalcommits.org/en/v1.0.0/#summary
[current repository and branch]: https://github.com/InsightSoftwareConsortium/ITK-Wasm/blob/main/src/docker/itk-wasm-base/Dockerfile#L39-L41
[data.kitware.com]: https://data.kitware.com/
[FileBase]: https://filebase.com/
[hatch]: https://hatch.pypa.io/latest/
[`itk-wasm` package]: https://www.npmjs.com/package/itk-wasm
[`itkwasm` Python package]: https://pypi.org/project/itkwasm/
[ITK]: https://docs.itk.org
[ITK Software Guide]: https://itk.org/ItkSoftwareGuide.pdf
[Node.js / NPM]: https://nodejs.org/en/download/
[Podman]: https://podman.io/docs/installation
[Pixi]: https://pixi.sh/
[pnpm workspace]: https://pnpm.io/workspaces
[PNPM]: https://pnpm.io/
[pnpm filters]: https://pnpm.io/filtering
[sphinx-autobuild]: https://github.com/executablebooks/sphinx-autobuild
[standard GitHub contribution best practices]: https://docs.itk.org/en/latest/contributing/index.html
[web3.storage]: https://web3.storage/
[Windows Git Bash]: https://gitforwindows.org/
[WSL]: https://learn.microsoft.com/en-us/windows/wsl/install
