function Image(dimension) {
  this.dimension = dimension;
  this.origin = new Array(dimension);
  this.origin.fill(0.0);
}

module.exports = Image;
