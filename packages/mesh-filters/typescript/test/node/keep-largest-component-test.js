import test from "ava";

import { keepLargestComponentNode } from "../../dist/index-node.js";

import { readMeshNode } from "@itk-wasm/mesh-io";
import { compareMeshesNode } from "@itk-wasm/compare-meshes";

import { testInputPath, testBaselinePath } from "./common.js";

test("keepLargestComponentNode keeps the largest component", async (t) => {
  const inputMeshPath = `${testInputPath}/suzanne.off`;
  const inputMesh = await readMeshNode(inputMeshPath);

  const { outputMesh } = await keepLargestComponentNode(inputMesh);

  const baselineMeshPath = `${testBaselinePath}/suzanne-keep-largest-component.iwm.cbor`;
  const baselineMesh = await readMeshNode(baselineMeshPath);

  const { metrics } = await compareMeshesNode(outputMesh, {
    baselineMeshes: [baselineMesh],
  });
  t.assert(metrics.almostEqual);
});
