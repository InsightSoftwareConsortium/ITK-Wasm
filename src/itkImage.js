const Matrix = require('./itkMatrix.js');

function Image(dimension) {
  this.dimension = dimension;

  this.origin = new Array(dimension);
  this.origin.fill(0.0);

  this.spacing = new Array(dimension);
  this.spacing.fill(1.0);
}

module.exports = Image;
