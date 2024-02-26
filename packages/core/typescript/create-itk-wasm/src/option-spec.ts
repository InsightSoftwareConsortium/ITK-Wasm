import OptionType from './option-type.js'

interface OptionSpec {
  name: string
  type: OptionType
  description: string
  defaultValue?: string
  required?: boolean
  itemsExpectedMin?: number
  itemsExpectedMax?: number
}

export default OptionSpec
