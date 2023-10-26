type JsonCompatible =
    | null
    | string
    | number
    | boolean
    | { [key: string]: JsonCompatible }
    | JsonCompatible[]

export default JsonCompatible
