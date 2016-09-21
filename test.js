const path = require('path');
const assert = require('assert');

const itk = require(path.resolve(__dirname, 'dist', 'itk.js'));

let image = new itk.Image(2);
assert(image.dimension === 2);

image = new itk.Image(3);
assert(image.dimension === 3);

//var NodeESModuleLoader = require('node-es-module-loader');

//var loader = new NodeESModuleLoader([> optional basePath <]);

//loader.import('./ITKBridgeJavaScript/dist/ImageIOs/itkPNGImageIOJSBinding.js').then(function(m) {
  ////console.log(m);
  //console.log(m.default);
  //var imageio = new m.default.itkPNGImageIO();
  //console.log(imageio);
  //console.log('setting');
  //imageio.SetFileName('myfile.png');
  //console.log(imageio.GetFileName());
    //// ...
//});
