interface VectorJSBinding<TValue> {
  size: () => number
  get: (index: number) => TValue
  set: (index: number, value: TValue) => void
  push_back: (value: TValue) => void
  resize: (size: number, defaultValue: TValue) => void
}

export default VectorJSBinding
