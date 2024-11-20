import fs from 'fs-extra'
import path from 'path'

function dispatchPipelineTest(packageDir, pypackage, functionName) {
  const testDir = path.join(packageDir, 'tests')
  const testModulePath = path.join(testDir, `test_${functionName}.py`)

  let moduleContent = `import pytest
import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide

from .fixtures import emscripten_package_wheel, package_wheel, input_data

@run_in_pyodide(packages=['micropip'])
async def test_${functionName}(selenium, package_wheel, emscripten_package_wheel):
    import micropip
    await micropip.install(emscripten_package_wheel)
    await micropip.install(package_wheel)

    from ${pypackage} import ${functionName}

    # Write your test code here
`

  if (!fs.existsSync(testModulePath)) {
    fs.writeFileSync(testModulePath, moduleContent)
  }
}

export default dispatchPipelineTest
