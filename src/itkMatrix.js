function Matrix(rows, columns) {
  this.rows = rows;
  this.columns = columns;

  this.data = new Array(rows * columns);
  this.data.fill(0.0);
}

Matrix.prototype.setIdentity = function() {
  for(ii = 0; ii < this.rows; ++ii) {
    for(jj = 0; jj < this.columns; ++jj) {
      if(ii === jj) {
        this.data[jj + ii * this.columns] = 1.0;
      } else {
        this.data[jj + ii * this.columns] = 0.0;
      }
    }
  }
}

module.exports = Matrix;
