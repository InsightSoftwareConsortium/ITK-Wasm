import test from "ava";
import { runPipelineNode } from "itk-wasm";

test("hello pipeline", async (t) => {
  const { returnValue, stdout, stderr } = await runPipelineNode(
    "emscripten-build/hello",
    ["--message", "Hello from test!", "test-output.txt"],
  );

  t.is(returnValue, 0, "Pipeline should exit successfully");
  t.truthy(
    stdout.includes("Hello from test!"),
    "Should output the custom message",
  );
  console.log("Pipeline output:", stdout);
});
