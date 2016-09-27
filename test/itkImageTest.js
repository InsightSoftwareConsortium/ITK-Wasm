const path = require('path');
const assert = require('assert');

const itk = require(path.resolve(__dirname, '..', 'dist', 'itk.js'));

describe('Image', function() {
  describe('#dimension', function() {
    it('should have the same dimension passed to the constructor', function() {
      let image = new itk.Image(2);
      assert(image.dimension === 2);

      image = new itk.Image(3);
      assert(image.dimension === 3);
    });
  });
});
