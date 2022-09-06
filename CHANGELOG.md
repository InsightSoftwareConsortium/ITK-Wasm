[itk-wasm](https://wasm.itk.org) combines [ITK](https://itk.org) and [WebAssembly](https://webassembly.org/) to enable high-performance, multi-dimensional spatial analysis and visualization.

# [1.0.0-b.24](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.23...itk-wasm-v1.0.0-b.24) (2022-09-06)


### Features

* **structured-report-to-text:** Initial pipeline addition ([b961063](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/b961063d503d5a15d4df0cf973466161fd6e72c2))

# [1.0.0-b.23](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.22...itk-wasm-v1.0.0-b.23) (2022-09-06)


### Bug Fixes

* Segfault in read-image-dicom-file-series ([ed689d7](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/ed689d7ed0ac0f8c88a335419c00c8e1a0f47ef8))

# [1.0.0-b.22](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.21...itk-wasm-v1.0.0-b.22) (2022-08-31)


### Bug Fixes

* **runPipelineEmscripten:** Copy args before passing to callMain ([6f0a85f](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/6f0a85f292014a1b4b9fad85dc37e26282257e01))


### Features

* **itk-wasm-cli:** Update default Docker image for kebab modules ([c6182e5](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/c6182e526a70c3bf30023e0d5e2a86fda106107c))
* **Pipeline:** Add interface_json() ([24bbeb7](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/24bbeb774cff51fffd075fe88d96d4563e85954c))

# [1.0.0-b.21](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.20...itk-wasm-v1.0.0-b.21) (2022-08-25)


### Features

* **itk-wasm-cli:** Update default Docker image for DCMTK support ([9fa8bd9](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/9fa8bd99ac0695601092e61b05922dad54627795))

# [1.0.0-b.20](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.19...itk-wasm-v1.0.0-b.20) (2022-08-25)


### Features

* **dcmtk:** add ITKDCMTK to image-io pipelines ([820bccc](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/820bccc1dd842230cf164e34b9699e1695495c91))

# [1.0.0-b.19](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.18...itk-wasm-v1.0.0-b.19) (2022-08-16)


### Bug Fixes

* **docs:** Fix typo ([dd9d18d](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/dd9d18dfd88f2f6711808c433493da3c6950bb65))
* **Python:** add name entry to Python itkwasm Image ([cf08600](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/cf086002350a2c8b0837cf2f8fc63732bff6613e))
* **readDICOMTags:** Allow webWorker to be null ([9e5b242](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/9e5b242702f48f8468eba51fdff7d6b953ef80c4))
* **worker:** Ensure worker promises are reused ([6075dd2](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/6075dd2993fe82b74bd47276aa0dc2644734c2f7))

# [1.0.0-b.18](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.17...itk-wasm-v1.0.0-b.18) (2022-08-16)


### Bug Fixes

* **Python:** add name entry to Python itkwasm Image ([cf08600](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/cf086002350a2c8b0837cf2f8fc63732bff6613e))
* **readDICOMTags:** Allow webWorker to be null ([9e5b242](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/9e5b242702f48f8468eba51fdff7d6b953ef80c4))
* **worker:** Ensure worker promises are reused ([6075dd2](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/6075dd2993fe82b74bd47276aa0dc2644734c2f7))


### Features

* **itk-wasm-cli:** update default Docker image for 1.0.0-b.18 ([f99c8e0](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/f99c8e086a33f3fb51c6d84f9433d8830306dd16))
* **version:** bump version to 1.0.0-b.18 ([e37e225](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/e37e225bf187288d9b47ac616d09ea3af16d909e))

# [1.0.0-b.18](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.17...itk-wasm-v1.0.0-b.18) (2022-08-15)


### Bug Fixes

* **Python:** add name entry to Python itkwasm Image ([cf08600](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/cf086002350a2c8b0837cf2f8fc63732bff6613e))
* **readDICOMTags:** Allow webWorker to be null ([9e5b242](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/9e5b242702f48f8468eba51fdff7d6b953ef80c4))


### Features

* **itk-wasm-cli:** update default Docker image for 1.0.0-b.18 ([f99c8e0](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/f99c8e086a33f3fb51c6d84f9433d8830306dd16))
* **version:** bump version to 1.0.0-b.18 ([e37e225](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/e37e225bf187288d9b47ac616d09ea3af16d909e))

# [1.0.0-b.18](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.17...itk-wasm-v1.0.0-b.18) (2022-08-15)


### Bug Fixes

* **Python:** add name entry to Python itkwasm Image ([cf08600](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/cf086002350a2c8b0837cf2f8fc63732bff6613e))
* **readDICOMTags:** Allow webWorker to be null ([9e5b242](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/9e5b242702f48f8468eba51fdff7d6b953ef80c4))


### Features

* **itk-wasm-cli:** update default Docker image for 1.0.0-b.18 ([f99c8e0](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/f99c8e086a33f3fb51c6d84f9433d8830306dd16))
* **version:** bump version to 1.0.0-b.18 ([e37e225](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/e37e225bf187288d9b47ac616d09ea3af16d909e))

# [1.0.0-b.18](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.17...itk-wasm-v1.0.0-b.18) (2022-07-11)


### Bug Fixes

* **Python:** add name entry to Python itkwasm Image ([cf08600](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/cf086002350a2c8b0837cf2f8fc63732bff6613e))


### Features

* **itk-wasm-cli:** update default Docker image for 1.0.0-b.18 ([f99c8e0](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/f99c8e086a33f3fb51c6d84f9433d8830306dd16))
* **version:** bump version to 1.0.0-b.18 ([e37e225](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/e37e225bf187288d9b47ac616d09ea3af16d909e))

# [1.0.0-b.18](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.17...itk-wasm-v1.0.0-b.18) (2022-07-10)


### Bug Fixes

* **Python:** add name entry to Python itkwasm Image ([cf08600](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/cf086002350a2c8b0837cf2f8fc63732bff6613e))


### Features

* **itk-wasm-cli:** update default Docker image for 1.0.0-b.18 ([f99c8e0](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/f99c8e086a33f3fb51c6d84f9433d8830306dd16))
* **version:** bump version to 1.0.0-b.18 ([e37e225](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/e37e225bf187288d9b47ac616d09ea3af16d909e))

# [1.0.0-b.18](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.17...itk-wasm-v1.0.0-b.18) (2022-07-08)


### Bug Fixes

* **Python:** add name entry to Python itkwasm Image ([cf08600](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/cf086002350a2c8b0837cf2f8fc63732bff6613e))


### Features

* **itk-wasm-cli:** update default Docker image for 1.0.0-b.18 ([f99c8e0](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/f99c8e086a33f3fb51c6d84f9433d8830306dd16))
* **version:** bump version to 1.0.0-b.18 ([e37e225](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/e37e225bf187288d9b47ac616d09ea3af16d909e))

# [1.0.0-b.18](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.17...itk-wasm-v1.0.0-b.18) (2022-07-08)


### Features

* **itk-wasm-cli:** update default Docker image for 1.0.0-b.18 ([f99c8e0](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/f99c8e086a33f3fb51c6d84f9433d8830306dd16))
* **version:** bump version to 1.0.0-b.18 ([e37e225](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/e37e225bf187288d9b47ac616d09ea3af16d909e))
