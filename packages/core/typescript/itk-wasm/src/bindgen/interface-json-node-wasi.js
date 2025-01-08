import { readFile } from 'node:fs/promises'
import { WASI } from 'wasi'

const wasi = new WASI({
  version: 'preview1',
  args: ['--interface-json'],
  env: process.env,
  preopens: {}
})

const importObject = { wasi_snapshot_preview1: wasi.wasiImport }

const wasm = await WebAssembly.compile(
  // await readFile(new URL(process.argv[2], import.meta.url))
  await readFile(process.argv[2])
)
const instance = await WebAssembly.instantiate(wasm, importObject)

wasi.initialize(instance)
instance.exports['']()
