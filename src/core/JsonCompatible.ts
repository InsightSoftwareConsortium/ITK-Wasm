type JsonCompatible =
    | string
    | number
    | boolean
    | { [x: string]: JsonCompatible }
    | JsonCompatible[]

export default JsonCompatible
