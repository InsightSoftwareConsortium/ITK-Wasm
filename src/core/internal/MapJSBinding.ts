import VectorJSBinding from './VectorJSBinding.js'

interface MapJSBinding<TKey, TValue> {
  size: () => number
  get: (key: TKey) => TValue
  keys: () => VectorJSBinding<TValue>
}

export default MapJSBinding
