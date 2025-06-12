#!/usr/bin/env deno run --allow-read --allow-write

import { parseArgs } from "jsr:@std/cli/parse-args";

import { readImageNode, writeImageNode } from "@itk-wasm/image-io";
import {
  readMeshNode,
  writeMeshNode,
  extensionToMeshIo,
} from "@itk-wasm/mesh-io";
import { getFileExtension } from "itk-wasm";

const args = parseArgs(Deno.args, {
  boolean: ["help"],
  alias: { h: "help" },
});

if (args.help || args._.length < 2) {
  console.log("Convert images or meshes files from one format to another.");
  console.log("\nUsage: itk-convert <inputFile> <outputFile>");
  console.log("\nOptions:");
  console.log("  -h, --help    Show this help message");
  Deno.exit(args.help ? 0 : 1);
}

const inputFile = args._[0] as string;
const outputFile = args._[1] as string;

const extension = getFileExtension(inputFile).toLowerCase();
const isMesh = extensionToMeshIo.has(extension);

try {
  if (isMesh) {
    const mesh = await readMeshNode(inputFile);
    await writeMeshNode(mesh, outputFile);
  } else {
    const image = await readImageNode(inputFile);
    await writeImageNode(image, outputFile);
  }
} catch (error) {
  console.error("Error during conversion:\n");
  console.error(error);
}
