import { runPipelineNode } from "itk-wasm";

// Run the hello pipeline with default message
console.log("Running hello pipeline with default message:");
const defaultResult = await runPipelineNode("emscripten-build/hello", [
  "output.txt",
]);
console.log(`Exit code: ${defaultResult.returnValue}`);
console.log(`Output: ${defaultResult.stdout}`);

// Run with custom message
console.log("\nRunning hello pipeline with custom message:");
const customResult = await runPipelineNode("emscripten-build/hello", [
  "--message",
  "Hello from Node.js!",
  "output.txt",
]);
console.log(`Exit code: ${customResult.returnValue}`);
console.log(`Output: ${customResult.stdout}`);
