import { readFile } from 'node:fs/promises';
import { WASI } from 'wasi';
import { argv, env } from 'node:process';

const wasi = new WASI({
  args: ['--interface-json'],
  env,
  preopens: {
  },
});

const importObject = { wasi_snapshot_preview1: wasi.wasiImport };

const wasm = await WebAssembly.compile(
  await readFile(new URL(process.argv[2], import.meta.url)),
);
const instance = await WebAssembly.instantiate(wasm, importObject);

wasi.initialize(instance);
instance.exports['']()