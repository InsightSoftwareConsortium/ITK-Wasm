const SystemRegisterLoader = require('system-register-loader');

const loader = new SystemRegisterLoader();

const Image = require('./itkImage.js');

exports.Image = Image;
