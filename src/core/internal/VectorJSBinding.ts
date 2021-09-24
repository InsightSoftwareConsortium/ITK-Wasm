interface VectorJSBinding<TValue> {
  size(): number
  get(index: number): TValue
}

export default VectorJSBinding
