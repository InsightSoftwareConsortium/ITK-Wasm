# ITK-Wasm AI Agent Instructions

## Project Overview

ITK-Wasm compiles [ITK](https://itk.org/) C++ image processing to WebAssembly for browser, Node.js, and Python execution. The architecture spans:

- **C++ Core** (`include/`, `src/`): ITK pipeline interface with `itkPipeline.h` CLI parsing
- **Docker Build Images** (`src/docker/`): Emscripten and WASI toolchain containers
- **CLI** (`packages/core/typescript/itk-wasm/src/cli/`): `itk-wasm` build/bindgen commands
- **Language Bindings**: TypeScript (`packages/*/typescript/`) and Python (`packages/*/python/`)
- **Example Packages** (`packages/`): image-io, mesh-io, dicom, downsample, etc.

## Development Workflow

```bash
# Full build
pnpm install
pnpm build
pnpm test

# Individual package development
cd packages/<package-name>
pnpm build:emscripten  # or build:wasi
pnpm build:gen:typescript
pnpm build:gen:python
pnpm test
```

### Debug WebAssembly Builds

```bash
pixi shell
pnpm build:emscripten:debug && pnpm build:wasi:debug
pnpm build && pnpm test
```

### Docker Image Development

```bash
# Build with local ITK source for bug fixes
./src/docker/build.sh --local-itk /path/to/ITK
# Or via environment variable
export ITK_WASM_LOCAL_ITK_SOURCE=/path/to/ITK
./src/docker/build.sh
```

## Package Structure Convention

Each `packages/<name>/` contains:
- C++ pipelines (`.cxx` files) with `CMakeLists.txt`
- `package.json` with `itk-wasm` config section for test data, Docker images, package names
- `typescript/` and `python/` directories for generated bindings
- `test/data/` with input/baseline files (downloaded via `test:data:download`)

## Key Patterns

### C++ Pipeline Structure

Use `ITK_WASM_PARSE` macro and typed inputs/outputs from `include/`:
```cpp
#include "itkPipeline.h"
#include "itkInputImage.h"
#include "itkOutputImage.h"

int main(int argc, char * argv[]) {
  itk::wasm::Pipeline pipeline("operation-name", "Description", argc, argv);
  // Add options, parse with ITK_WASM_PARSE(pipeline), process, return
}
```

### Test Data Management

Test data uses content-addressed storage. To add/modify:
```bash
# In package directory
pnpm test:data:pack  # Creates test/data.tar.gz, outputs CID
# Ask user to upload to IPFS host, update package.json itk-wasm.test-data-hash and test-data-urls
```

### Binding Generation

The CLI generates TypeScript/Python bindings from WASI builds:
```bash
itk-wasm bindgen --interface typescript  # or python
```

## Environment Variables

Key variables in `itk_wasm_env.bash`:
- `ITK_WASM_ITK_REPOSITORY`, `ITK_WASM_ITK_BRANCH`: ITK source for Docker builds
- `ITK_WASM_LOCAL_ITK_SOURCE`: Use local ITK directory in Docker builds
- `ITK_WASM_*_TEST_DATA_HASH/URLS`: Per-package test data configuration

## Commit Convention

Uses [conventional commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, etc.
