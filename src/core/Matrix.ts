class Matrix {
  public data: number[]
  public readonly rows: number
  public readonly columns: number

  constructor (rows: number | typeof Matrix, columns: number) {
    if (rows instanceof Matrix) {
      const other = rows
      this.rows = other.rows
      this.columns = other.columns
      this.data = other.data.slice()
    } else {
      this.rows = rows as number
      this.columns = columns
      this.data = new Array(rows as number * columns)
      this.data.fill(0.0)
    }
  }

  setIdentity () {
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

  setElement (row: number, column: number, value: number): void {
    this.data[column + row * this.columns] = value
  }

  getElement (row: number, column: number): number {
    return this.data[column + row * this.columns]
  }
}

export default Matrix
