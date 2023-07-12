// Generated file. To retain edits, remove this comment.

function basename(path) {
  return path.replace(/.*\//, '');
}

async function savePythonScript(pyodide, scriptPath) {
  await pyodide.runPythonAsync(`
    from pyodide.http import pyfetch
    from pathlib import Path
    response = await pyfetch("${scriptPath}")
    with open(Path("${scriptPath}").name, "wb") as f:
        f.write(await response.bytes())
`)
  pyodide.pyimport(basename(scriptPath).replace('.py', ''))
}

async function main(){
  globalThis.disableInputs('compress_stringify-inputs')
  globalThis.disableInputs('parse_string_decompress-inputs')

  const pyodide = await loadPyodide()
  await pyodide.loadPackage("numpy")
  await pyodide.loadPackage("micropip")
  const micropip = pyodide.pyimport("micropip")
  await micropip.install("itkwasm-compress-stringify")

  await savePythonScript(pyodide, './compress_stringify_load_sample_inputs.py')
  await pyodide.runPythonAsync(await (await fetch("./compress_stringify.py")).text())
  await savePythonScript(pyodide, './parse_string_decompress_load_sample_inputs.py')
  await pyodide.runPythonAsync(await (await fetch("./parse_string_decompress.py")).text())

  globalThis.enableInputs('compress_stringify-inputs')
  globalThis.enableInputs('parse_string_decompress-inputs')

  globalThis.pyodide = pyodide
  return pyodide
}
const pyodideReady = main()
