/*
 *  Copyright Insight Software Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License")
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

const assert = require('assert')

if (process.argv.length < 4) {
  console.error('Usage: ', process.argv[0], process.argv[1], ' moduleDir inputImage outputImage')
  process.exit(1)
}
var moduleDir = process.argv[2]
var inputImage = process.argv[3]
var outputImage = process.argv[4]
console.log('Input image: ', inputImage)
console.log('Output image: ', outputImage)

var path = require('path')
var modulePath = path.join(moduleDir, 'itkPNGImageIOJSBinding.js')

var Module = require(modulePath)
var imageio = new Module.ITKImageIO()

console.log('Reading image...')
Module.mountContainingDirectory(inputImage)

imageio.SetFileName(inputImage)
assert.equal(imageio.GetFileName(), inputImage)
console.log(imageio.GetFileName())

assert(imageio.CanReadFile(inputImage), 'Could not read the file')
imageio.ReadImageInformation()

var dimension = 2
assert.equal(imageio.GetNumberOfDimensions(), dimension)
assert.equal(imageio.GetDimensions(0), 256)
assert.equal(imageio.GetDimensions(1), 256)

assert.equal(imageio.GetOrigin(0), 0.0)
assert.equal(imageio.GetOrigin(1), 0.0)

assert.equal(imageio.GetSpacing(0), 1.0)
assert.equal(imageio.GetSpacing(1), 1.0)

var axisDirection = new Module.AxisDirectionType()
axisDirection.resize(dimension, 0.2)
axisDirection.set(0, 0.707)
imageio.SetDirection(0, axisDirection)
var retrievedAxisDirection = imageio.GetDirection(0)
assert.equal(retrievedAxisDirection.get(0), 0.707)
assert.equal(retrievedAxisDirection.get(1), 0.2)

var pixelType = imageio.GetPixelType()
console.log('Pixel type:     ' + Module.ITKImageIO.GetPixelTypeAsString(pixelType))
assert.equal(pixelType, Module.IOPixelType.RGB)
imageio.SetPixelType(pixelType)

var componentType = imageio.GetComponentType()
console.log('Component type: ' + Module.ITKImageIO.GetComponentTypeAsString(componentType))
assert.equal(componentType, Module.IOComponentType.UCHAR)
imageio.SetComponentType(componentType)

console.log('\nPixels:     ' + imageio.GetImageSizeInPixels())
assert.equal(imageio.GetImageSizeInPixels(), 65536)
console.log('Bytes:      ' + imageio.GetImageSizeInBytes())
assert.equal(imageio.GetImageSizeInBytes(), 196608)
console.log('Component size: ' + imageio.GetImageSizeInComponents())
assert.equal(imageio.GetImageSizeInComponents(), 196608)
console.log('Components: ' + imageio.GetNumberOfComponents())
assert.equal(imageio.GetNumberOfComponents(), 3)

var pixelBuffer = imageio.Read()
assert.equal(pixelBuffer.length, 196608)

Module.unmountContainingDirectory(inputImage)
