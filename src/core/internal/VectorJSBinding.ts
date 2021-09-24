interface VectorJSBinding<TValue> {
  size(): number
  get(index: number): TValue
  push_back(value: TValue): void
}

export default VectorJSBinding
