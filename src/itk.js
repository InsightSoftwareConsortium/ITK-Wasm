const SystemRegisterLoader = require('system-register-loader');

const loader = new SystemRegisterLoader();

const Image = require('./itkImage.js');

exports.Image = Image;

//require.ensure(["../build/itk-imageio/itkPNGImageIOJSBinding.js"], function(require) {
      //var a = require("../build/itk-imageio/itkPNGImageIOJSBinding.js");
      //imageio = new a.itkPNGImageIO();
      //console.log(imageio);
      //imageio.SetFileName('myfile.png');
      //console.log(imageio.GetFileName());
//});
