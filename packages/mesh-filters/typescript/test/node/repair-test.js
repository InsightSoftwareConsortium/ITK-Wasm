import test from "ava";

import { repairNode } from "../../dist/index-node.js";

import { readMeshNode } from "@itk-wasm/mesh-io";
import { compareMeshesNode } from "@itk-wasm/compare-meshes";

import { testInputPath, testBaselinePath } from "./common.js";

test("repair makes the mesh manifold", async (t) => {
  const inputMeshPath = `${testInputPath}/suzanne.off`;
  const inputMesh = await readMeshNode(inputMeshPath);

  const { outputMesh } = await repairNode(inputMesh);

  const baselineMeshPath = `${testBaselinePath}/suzanne-repair.iwm.cbor`;
  const baselineMesh = await readMeshNode(baselineMeshPath);

  const { metrics } = await compareMeshesNode(outputMesh, {
    baselineMeshes: [baselineMesh],
  });
  t.assert(metrics.almostEqual);
});
