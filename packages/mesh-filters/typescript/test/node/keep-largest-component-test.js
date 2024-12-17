import test from "ava";

import {
  keepLargestComponentNode,
} from "../../dist/index-node.js";

import { readMeshNode } from "@itk-wasm/mesh-io"
import { compareMeshesNode } from "@itk-wasm/compare-meshes"

import { testInputPath, testBaselinePath, testOutputPath } from "./common.js";

test("keepLargestComponentNode keeps the largest component", async (t) => {
  const inputMeshPath = `${testInputPath}/suzanne.off`;
  const inputMesh = await readMeshNode(inputMeshPath);

  const { outputMesh } = await keepLargestComponentNode(inputMesh);

  const baselineMeshPath = `${testBaselinePath}/suzanne-keep-largest-component.off`;
  const baselineMesh = await readMeshNode(baselineMeshPath);

  const result = await compareMeshesNode(outputMesh, { baselineMeshes: [baselineMesh,] });
  console.log(result)



  // const data = new Uint8Array([222, 173, 190, 239]);
  // const { output: compressedData } = await compressStringifyNode(data, {
  //   compressionLevel: 8,
  // });
  // const { output: decompressedData } =
  //   await parseStringDecompressNode(compressedData);

  // t.is(decompressedData[0], 222);
  // t.is(decompressedData[1], 173);
  // t.is(decompressedData[2], 190);
  // t.is(decompressedData[3], 239);
});