import fs from 'fs-extra'
import path from 'path'

import mkdirP from '../../mkdir-p.js'

function emscriptenTestModule(packageDir, pypackage) {
  mkdirP(path.join(packageDir, 'test'))

  let moduleContent = `import pytest
import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide

from ${pypackage} import __version__ as test_package_version

@pytest.fixture
def package_wheel():
    return f"${pypackage}-{test_package_version}-py3-none-any.whl"

@run_in_pyodide(packages=['micropip'])
async def test_example(selenium, package_wheel):
    import micropip
    await micropip.install(package_wheel)

    # Write your test code here
`

  const modulePath = path.join(packageDir, 'test', `test_${pypackage.replace('_emscripten', '')}.py`)
  if (!fs.existsSync(modulePath)) {
    fs.writeFileSync(modulePath, moduleContent)
  }
}

export default emscriptenTestModule
