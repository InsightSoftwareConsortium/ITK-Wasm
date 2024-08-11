import TransformType from './transform-type.js'

class Transform {
  transformType: TransformType
  numberOfFixedParameters: number
  numberOfParameters: number

  name: string = 'Transform'

  inputSpaceName: string
  outputSpaceName: string

  parameters: number[]
  fixedParameters: number[]

  constructor(transformType = new TransformType()) {
    this.transformType = transformType
    this.numberOfFixedParameters = 0
    this.numberOfParameters = 0

    this.inputSpaceName = ''
    this.outputSpaceName = ''

    this.parameters = new Array(0)
    this.fixedParameters = new Array(0)
  }
}

export default Transform
