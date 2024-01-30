# Packages

Example packages built with itk-wasm can be found below. If you created a
package, please [open a pull
request](https://github.com/InsightSoftwareConsortium/itk-wasm/compare) to add it to the table!

| <img width=100/> Repository | <img width=125/> Description <img width=125/> | <img width=200/> Links |
|-----------------------------|:---------------------------------------------:|:----------------------:|
| [@itk-wasm/compare-images][compare-images-repo] | [<img src="../_static/packages/compare-images.png" width="128" />][compare-images-demo-js] <br /> *Compare images with a tolerance for regression testing.* | ![js][js-logo] ![ts][ts-logo] <br/>[👨‍💻 Demo][compare-images-demo-js] <br/>[🕮 Docs][compare-images-docs-js] <br/>[📦 Package][compare-images-package-js] <br/> <br/> ![py][py-logo] <br/>[🕮 Docs][compare-images-docs-py] <br/>[📦 Package][compare-images-package-py] |
| [@itk-wasm/compress-stringify][compress-stringify-repo] | [<img src="../_static/packages/compress-stringify.png" width="128" />][compress-stringify-demo-js]<br />  *Zstandard compression and decompression and base64 encoding and decoding in WebAssembly.* | ![js][js-logo] ![ts][ts-logo] <br/>[👨‍💻 Demo][compress-stringify-demo-js] <br/>[🕮 Docs][compress-stringify-docs-js] <br/>[📦 Package][compress-stringify-package-js] <br/> <br/> ![py][py-logo] <br/>[👨‍💻 Demo][compress-stringify-demo-py] <br/>[🕮 Docs][compress-stringify-docs-py] <br/>[📦 Package][compress-stringify-package-py] |
| [@itk-wasm/dicom][dicom-repo] | [<img src="../_static/packages/dicom.png" width="128" />][dicom-demo-js] <br /> *Read files and images related to DICOM file format.* | ![js][js-logo] ![ts][ts-logo] <br/>[👨‍💻 Demo][dicom-demo-js] <br/>[🕮 Docs][dicom-docs-js] <br/>[📦 Package][dicom-package-js] <br/> <br/> ![py][py-logo] <br/>[🕮 Docs][dicom-docs-py] <br/>[📦 Package][dicom-package-py] |
| [@itk-wasm/downsample][downsample-repo] | [<img src="../_static/packages/downsample.png" width="128" />][downsample-demo-js] <br /> *Pipelines for downsampling images.* | ![js][js-logo] ![ts][ts-logo] <br/>[👨‍💻 Demo][downsample-demo-js] <br/>[🕮 Docs][downsample-docs-js] <br/>[📦 Package][downsample-package-js] <br/> <br/> ![py][py-logo] <br/>[🕮 Docs][downsample-docs-py] <br/>[📦 Package][downsample-package-py] |
| [@itk-wasm/elastix][elastix-repo] | [<img src="../_static/packages/elastix.png" width="128" />][elastix-demo-js] <br /> *A toolbox for rigid and nonrigid registration of images.* | ![js][js-logo] ![ts][ts-logo] <br/>[👨‍💻 Demo][elastix-demo-js] <br/>[🕮 Docs][elastix-docs-js] <br/>[📦 Package][elastix-package-js] <br/> <br/> ![py][py-logo] <br/>[🕮 Docs][elastix-docs-py] <br/>[📦 Package][elastix-package-py] |
| [@itk-wasm/htj2k][htj2k-repo] | [<img src="../_static/packages/htj2k.png" width="128" />][htj2k-demo-js] <br /> *Wasm-SIMD accelerated decoding and encoding High-throughput JPEG2000 (HTJ2K) images.* | ![js][js-logo] ![ts][ts-logo] <br/>[👨‍💻 Demo][htj2k-demo-js] <br/>[🕮 Docs][htj2k-docs-js] <br/>[📦 Package][htj2k-package-js] <br/> <br/> ![py][py-logo] <br/>[🕮 Docs][htj2k-docs-py] <br/>[📦 Package][htj2k-package-py] |
| [@itk-wasm/image-io][image-io-repo] | [<img src="../_static/packages/image-io.png" width="128" />][image-io-demo-js] <br /> *Input and output for scientific and medical image file formats.* | ![js][js-logo] ![ts][ts-logo] <br/>[👨‍💻 Demo][image-io-demo-js] <br/>[🕮 Docs][image-io-docs-js] <br/>[📦 Package][image-io-package-js] <br/> <br/> ![py][py-logo] <br/>[🕮 Docs][image-io-docs-py] <br/>[📦 Package][image-io-package-py] |

[js-logo]: /_static/javascript-logo.svg
[ts-logo]: /_static/typescript-logo.svg
[py-logo]: /_static/python.svg

[compare-images-repo]: https://github.com/InsightSoftwareConsortium/itk-wasm/tree/main/packages/compare-images
[compare-images-demo-js]: https://insightsoftwareconsortium.github.io/itk-wasm/compare-images/ts/app/
[compare-images-docs-js]: https://insightsoftwareconsortium.github.io/itk-wasm/compare-images/ts/docs/
[compare-images-package-js]: https://www.npmjs.com/package/@itk-wasm/compare-images
[compare-images-docs-py]: https://insightsoftwareconsortium.github.io/itk-wasm/compare-images/py/docs/
[compare-images-package-py]: https://pypi.org/project/itkwasm-compare-images/

[compress-stringify-repo]: https://github.com/InsightSoftwareConsortium/itk-wasm/tree/main/packages/compress-stringify
[compress-stringify-demo-js]: https://insightsoftwareconsortium.github.io/itk-wasm/compress-stringify/ts/app/
[compress-stringify-docs-js]: https://insightsoftwareconsortium.github.io/itk-wasm/compress-stringify/ts/docs/
[compress-stringify-package-js]: https://www.npmjs.com/package/@itk-wasm/compress-stringify
[compress-stringify-demo-py]: https://itk-compress-stringify-py-app.on.fleek.co/
[compress-stringify-docs-py]: https://insightsoftwareconsortium.github.io/itk-wasm/compress-stringify/py/docs/
[compress-stringify-package-py]: https://pypi.org/project/itkwasm-compress-stringify/

[elastix-repo]: https://github.com/InsightSoftwareConsortium/ITKElastix
[elastix-demo-js]: https://js.app.elastix.wasm.itk.eth.limo/
[elastix-docs-js]: https://js.docs.elastix.wasm.itk.eth.limo/
[elastix-package-js]: https://www.npmjs.com/package/@itk-wasm/elastix
[elastix-docs-py]: https://py.docs.elastix.wasm.itk.eth.limo/
[elastix-package-py]: https://pypi.org/project/itkwasm-elastix/

[dicom-repo]: https://github.com/InsightSoftwareConsortium/itk-wasm/tree/main/packages/dicom
[dicom-demo-js]: https://insightsoftwareconsortium.github.io/itk-wasm/dicom/ts/app/
[dicom-docs-js]: https://insightsoftwareconsortium.github.io/itk-wasm/dicom/ts/docs/
[dicom-package-js]: https://www.npmjs.com/package/@itk-wasm/dicom
[dicom-docs-py]: https://insightsoftwareconsortium.github.io/itk-wasm/dicom/py/docs/
[dicom-package-py]: https://pypi.org/project/itkwasm-dicom/

[htj2k-repo]: https://github.com/InsightSoftwareConsortium/ITKIOOpenJPH/tree/main/src/wasm
[htj2k-demo-js]: https://js.app.htj2k.wasm.itk.eth.limo/
[htj2k-docs-js]: https://js.docs.htj2k.wasm.itk.eth.limo/
[htj2k-package-js]: https://www.npmjs.com/package/@itk-wasm/htj2k
[htj2k-docs-py]: https://py.docs.htj2k.wasm.itk.eth.limo/
[htj2k-package-py]: https://pypi.org/project/itkwasm-htj2k/

[downsample-repo]: https://github.com/InsightSoftwareConsortium/itk-wasm/tree/main/packages/downsample
[downsample-demo-js]: https://insightsoftwareconsortium.github.io/itk-wasm/downsample/ts/app/
[downsample-docs-js]: https://insightsoftwareconsortium.github.io/itk-wasm/downsample/ts/docs/
[downsample-package-js]: https://www.npmjs.com/package/@itk-wasm/downsample
[downsample-docs-py]: https://insightsoftwareconsortium.github.io/itk-wasm/downsample/py/docs/
[downsample-package-py]: https://pypi.org/project/itkwasm-downsample/

[image-io-repo]: https://github.com/InsightSoftwareConsortium/itk-wasm/tree/main/packages/image-io
[image-io-demo-js]: https://insightsoftwareconsortium.github.io/itk-wasm/image-io/ts/app/
[image-io-docs-js]: https://insightsoftwareconsortium.github.io/itk-wasm/image-io/ts/docs/
[image-io-package-js]: https://www.npmjs.com/package/@itk-wasm/image-io
[image-io-docs-py]: https://insightsoftwareconsortium.github.io/itk-wasm/image-io/py/docs/
[image-io-package-py]: https://pypi.org/project/itkwasm-image-io/
