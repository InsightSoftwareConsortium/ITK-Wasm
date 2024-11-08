import TransformType from './transform-type.js'
import type TypedArray from '../typed-array.js'

class Transform {
  transformType: TransformType
  numberOfFixedParameters: number
  numberOfParameters: number

  name: string = 'Transform'

  inputSpaceName: string
  outputSpaceName: string

  parameters: TypedArray
  fixedParameters: TypedArray

  constructor (transformType = new TransformType()) {
    this.transformType = transformType
    this.numberOfFixedParameters = 0
    this.numberOfParameters = 0

    this.inputSpaceName = ''
    this.outputSpaceName = ''

    this.parameters = new Uint8Array(0)
    this.fixedParameters = new Uint8Array(0)
  }
}

export default Transform
