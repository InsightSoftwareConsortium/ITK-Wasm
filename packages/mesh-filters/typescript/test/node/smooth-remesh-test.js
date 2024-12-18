import test from "ava";

import { smoothRemeshNode } from "../../dist/index-node.js";

import { readMeshNode, writeMeshNode } from "@itk-wasm/mesh-io";
import { compareMeshesNode } from "@itk-wasm/compare-meshes";

import { testBaselinePath } from "./common.js";

test("repair makes the mesh manifold", async (t) => {
  const inputMeshPath = `${testBaselinePath}/suzanne-repair.off`;
  const inputMesh = await readMeshNode(inputMeshPath);

  const { outputMesh } = await smoothRemeshNode(inputMesh);
  writeMeshNode(outputMesh, `/tmp/suzanne-smooth-remesh.off`);
  writeMeshNode(outputMesh, `/tmp/suzanne-smooth-remesh.iwm.cbor`);

  const baselineMeshPath = `${testBaselinePath}/suzanne-smooth-remesh.iwm.cbor`;
  const baselineMesh = await readMeshNode(baselineMeshPath);

  const { metrics } = await compareMeshesNode(outputMesh, {
    baselineMeshes: [baselineMesh],
  });
  t.assert(metrics.almostEqual);
});
