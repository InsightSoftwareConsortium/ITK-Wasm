#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import { WASI } from 'wasi'
import { WASIThreads } from '@emnapi/wasi-threads'

const wasi = new WASI({
  version: 'preview1',
  returnOnExit: true,
  args: ['--interface-json'],
  env: process.env,
  preopens: {}
})

const wasiThreads = new WASIThreads({
    wasi
});

const memory = new WebAssembly.Memory({
  initial: 128,
  maximum: 0x10000,
  shared: true
})

const importObject = {
  env: {
    memory
  },
  wasi_snapshot_preview1: wasi.wasiImport,
  ...wasiThreads.getImportObject()
}

try {
  const wasm = await WebAssembly.compile(
    // await readFile(new URL(process.argv[2], import.meta.url))
    await readFile(process.argv[2])
  )
  const instance = await WebAssembly.instantiate(wasm, importObject)

  wasiThreads.setup(instance, wasm, memory);
  await wasiThreads.preloadWorkers();

  wasi.initialize(instance)
  instance.exports['']()
} catch (error) {
  if (error.toString() !== Symbol('kExitCode').toString()) {
    console.error('Error: ', error)
  }
}