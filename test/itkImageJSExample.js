
if(process.argv.length < 4){
	console.error("itkImageJS example, set random pixels to the image.");
	console.error("Use mode: .nrrd or .nii files");
	console.error(process.argv[0], process.argv[1], " inputImage outputImage");
	return;
}

var Module = require("../examples/js/itkImageJS.js");

var imagejs = new Module.itkImageJS();

var inputImage = process.argv[2];
var outputImage = process.argv[3];

console.log("Input image: ", inputImage);
console.log("Output image: ", outputImage);


console.log("Reading image...");
imagejs.MountDirectory(inputImage);
imagejs.ReadImage(inputImage);

var dim = imagejs.GetDimensions();
var dimensions = Module.HEAP32.subarray(dim, dim + 3);

console.log("Random pixels every 2 slices...");
for(var i = 0; i < dimensions[0]; i+=2){
	for(var j = 0; j < dimensions[1]; j++){
		for(var k = 0; k < dimensions[2]; k++){
			imagejs.SetPixel(i, j, k, Math.random()*255);
		}
	}
}
console.log("Writing image...");
imagejs.MountDirectory(outputImage);
imagejs.WriteImage(outputImage);