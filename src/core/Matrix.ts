class Matrix {
  public data: number[]

  constructor(public readonly rows: number, public readonly columns: number) {
    this.data = new Array(rows * columns)
    this.data.fill(0.0)
  }

  setIdentity() {
    for (let ii = 0; ii < this.rows; ++ii) {
      for (let jj = 0; jj < this.columns; ++jj) {
        if (ii === jj) {
          this.data[jj + ii * this.columns] = 1.0
        } else {
          this.data[jj + ii * this.columns] = 0.0
        }
      }
    }
  }

  setElement(row: number, column: number, value: number): void {
    this.data[column + row * this.columns] = value
  }

  getElement(row: number, column: number): number {
    return this.data[column + row * this.columns]
  }
}

export default Matrix
