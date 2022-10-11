[itk-wasm](https://wasm.itk.org) combines [ITK](https://itk.org) and [WebAssembly](https://webassembly.org/) to enable high-performance, multi-dimensional spatial analysis and visualization.

# [1.0.0-b.39](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.38...itk-wasm-v1.0.0-b.39) (2022-10-11)


### Features

* **itk-wasm-cli:** Update default Docker image for 1.0.0-b.38 ([a6af973](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/a6af973aa855b854d1b51079aa435dd7cc2e020e))

# [1.0.0-b.38](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.37...itk-wasm-v1.0.0-b.38) (2022-10-06)


### Features

* **bindgen:** Add support for string and number arguments ([4220397](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/42203972bd582608e132a5abf3b62b4724c8cd04))
* **KOS:** Key object selection (KOS) structured report (SR) ([564255c](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/564255c1e05455bd71f817e8cd63208bfa32ebd6))
* **WASI:** Support itk_wasm_delayed_start ([a4609a6](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/a4609a6e7259d536d4b489bd836ec922ba395710)), closes [/docs.rs/wasmtime/0.17.0/src/wasmtime/linker.rs.html#685](https://github.com//docs.rs/wasmtime/0.17.0/src/wasmtime/linker.rs.html/issues/685)

# [1.0.0-b.37](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.36...itk-wasm-v1.0.0-b.37) (2022-09-30)


### Bug Fixes

* **itkConfig.ts:** Import from './browser/index.js' ([f6a125d](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/f6a125dea5fe4fb1662d576e16d0d753d9cae700)), closes [#654](https://github.com/InsightSoftwareConsortium/itk-wasm/issues/654)

# [1.0.0-b.36](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.35...itk-wasm-v1.0.0-b.36) (2022-09-29)


### Bug Fixes

* **SR-test-data:** switch to file-level CID values ([76cf561](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/76cf561992c83f04941350f80ac514bc4edec7b9))

# [1.0.0-b.35](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.34...itk-wasm-v1.0.0-b.35) (2022-09-28)


### Features

* **dcm2pdf:** add read-dicom-encapsulated-pdf operation to itk-dicom ([2a383c8](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/2a383c811ea0a29ed41c15937ec705ba74be5073))
* **dcm2pdf:** generate TS wrapper (bindgen) for read-dicom-encapsulated-pdf ([c2ef59f](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/c2ef59f9310c218a280588f4613fd22fbd00923e))
* **dcm2pdf:** modify dcm2pdf app for itk-wasm ([9cb3553](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/9cb35538ac7bc5e47c4689395a51fd1e8375b808))

# [1.0.0-b.34](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.33...itk-wasm-v1.0.0-b.34) (2022-09-27)


### Bug Fixes

* **itk-wasm-cli:** enforce alpha-numeric parameter names ([1be234a](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/1be234a4852e751f09df12f9c7c39b1957b9d738))


### Features

* **dsr2html:** add structured-report-to-html operation to itk-dicom ([4e35e07](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/4e35e0765c5436ace775ff50103d09d54b00d279))
* **dsr2html:** generate TS wrapper (bindgen) for structured-report-to-html ([f1fc133](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/f1fc1338660136f139c201552c4d9c2690b1e1f6))
* **dsr2html:** modify dsr2html app for itk-wasm ([ddec323](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/ddec323dce2dc1346718e42310272304f73ab101))

# [1.0.0-b.33](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.32...itk-wasm-v1.0.0-b.33) (2022-09-21)


### Features

* **itk-dicom:** Support loading multi-component dicom data with gdcm ([7db17a9](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/7db17a948c84bbadfcdb144cf06c95f8484d1679))

# [1.0.0-b.32](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.31...itk-wasm-v1.0.0-b.32) (2022-09-20)


### Bug Fixes

* import ([3e6d0a7](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/3e6d0a79c355d8dcb556364c5839e73c8effda88))


### Features

* expose version ([c51dcf5](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/c51dcf53bddc16588d4bc11f5469e0900bd78368))

# [1.0.0-b.31](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.30...itk-wasm-v1.0.0-b.31) (2022-09-13)


### Bug Fixes

* **bindings:** Pass pipeline path for generation ([e8cf50c](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/e8cf50cf314a3f0efba43bcc739ea3cdae7ca691))
* **runPipelineEmscript:** Lower mesh cellData ([50185ca](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/50185ca59a8a974fc2d898dd9f3e853af93504cd))

# [1.0.0-b.30](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.29...itk-wasm-v1.0.0-b.30) (2022-09-09)


### Features

* **python:** Execute with stdout / stderr ([29318f6](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/29318f6c2e8d2d396ca9fc0931e613352c74108b))

# [1.0.0-b.29](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.28...itk-wasm-v1.0.0-b.29) (2022-09-09)


### Features

* **itk-dicom:** Node.js bundling and interface ([3e5feb1](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/3e5feb18a5511b1991a107b13e8a885ef23691ae))

# [1.0.0-b.28](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.27...itk-wasm-v1.0.0-b.28) (2022-09-08)


### Features

* **itk-wasm-cli:** Update default Docker image for 1.0.0-b.7 ([84fb14b](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/84fb14be85a1e048beb39fcb968d18e2130c1528))
* **version:** Bump version to 1.0.0-b.7 ([91e1f6e](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/91e1f6eb540d69f17a11060badec35303c390886))

# [1.0.0-b.27](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.26...itk-wasm-v1.0.0-b.27) (2022-09-08)


### Features

* **itk-dicom:** Browser package configuration ([6cc2574](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/6cc2574c6712fc26e0f00fdc278b5bc4acf06489))

# [1.0.0-b.26](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.25...itk-wasm-v1.0.0-b.26) (2022-09-07)


### Bug Fixes

* **package.json:** Remove git+ protocol from repository url's ([e617cf2](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/e617cf21c77b4523f413c89a67281d9d5220eb09))

# [1.0.0-b.25](https://github.com/InsightSoftwareConsortium/itk-wasm/compare/itk-wasm-v1.0.0-b.24...itk-wasm-v1.0.0-b.25) (2022-09-07)


### Features

* **itk-wasm-cli:** Update default Docker image for Pipeline updates ([145308d](https://github.com/InsightSoftwareConsortium/itk-wasm/commit/145308d30711e4d39c828cc436f2e55fdce90485))

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
