# BinaryFile

A `BinaryFile` represents a binary file. For performance reasons, use [`BinaryStream`](./BinaryStream), when possible, instead. `BinaryFile` is a JavaScript object with the following properties:

- `data`: `Uint8Arrray` with the binary data.
- `path`: File path string.
