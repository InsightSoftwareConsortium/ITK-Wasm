import fs from 'fs-extra'
import path from 'path'

import mkdirP from '../mkdir-p.js'

function dispatchTestModule(packageDir, pypackage) {
  const testDir = path.join(packageDir, 'tests')
  mkdirP(testDir)

  const initPath = path.join(testDir, '__init__.py')
  if (!fs.existsSync(initPath)) {
    fs.writeFileSync(initPath, '')
  }

  const fixturesContent = `import pytest
import sys
import glob

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide

from ${pypackage} import __version__ as test_package_version

@pytest.fixture
def package_wheel():
    return f"${pypackage}-{test_package_version}-py3-none-any.whl"

@pytest.fixture
def emscripten_package_wheel():
    return f"${pypackage}_emscripten-{test_package_version}-py3-none-any.whl"

@pytest.fixture
def input_data():
    from pathlib import Path
    input_base_path = Path(__file__).parent.parent / 'test' / 'data'
    test_files = list(input_base_path.glob('*'))
    data = {}
    for test_file in test_files:
        with open(test_file, 'rb') as f:
            data[test_file.name] = f.read()
    return data
`
  const fixturesPath = path.join(testDir, 'fixtures.py')
  if (!fs.existsSync(fixturesPath)) {
    fs.writeFileSync(fixturesPath, fixturesContent)
  }
}

export default dispatchTestModule
