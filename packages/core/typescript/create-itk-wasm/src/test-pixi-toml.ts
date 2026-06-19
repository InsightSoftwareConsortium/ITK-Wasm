// Regression test for the generated pixi.toml task commands.
//
// Recent pixi (>= 0.70) parses multi-line `cmd` strings with deno_task_shell,
// where a bare newline terminates a command. A multi-line `cmd` must therefore
// continue each line explicitly (e.g. with a trailing `\` or `&&`); otherwise
// the trailing lines run as separate, bogus commands and the task fails with
// "command not found" (exit code 127). See the `configure-itk*` cmake tasks.
//
// This test generates a pixi.toml with the real generator and asserts that no
// multi-line command relies on a bare newline as a separator.

import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import generatePixiToml from './generate/pixi-toml.js'
import type ProjectSpec from './project-spec.js'

// Shell tokens that legitimately continue a command onto the next line.
const CONTINUATIONS = ['\\', '&&', '||', '|', '&']

function endsWithContinuation(line: string): boolean {
  const trimmed = line.trimEnd()
  return CONTINUATIONS.some((token) => trimmed.endsWith(token))
}

function generateSampleToml(): string {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'create-itk-wasm-test-')
  )
  try {
    const project: ProjectSpec = {
      name: 'test-pipeline',
      directory,
      packageDescription: 'A test pipeline',
      author: 'Test Author',
      repositoryUrl: 'https://example.com/repo'
    }
    generatePixiToml(project)
    return fs.readFileSync(path.join(directory, 'pixi.toml'), 'utf8')
  } finally {
    fs.rmSync(directory, { recursive: true, force: true })
  }
}

function run(): void {
  const toml = generateSampleToml()

  // Every triple-quoted (multi-line) command in the manifest.
  const multilineCmd = /cmd = '''([\s\S]*?)'''/g
  const blocks = [...toml.matchAll(multilineCmd)].map((match) => match[1])

  assert.ok(
    blocks.length > 0,
    'Expected the generated pixi.toml to contain multi-line commands; the test fixture may be stale.'
  )

  const offenders: string[] = []
  for (const block of blocks) {
    const lines = block.split('\n')
    // Every line except the last must continue onto the next one.
    lines.slice(0, -1).forEach((line) => {
      if (line.trim() !== '' && !endsWithContinuation(line)) {
        offenders.push(line.trim())
      }
    })
  }

  assert.deepEqual(
    offenders,
    [],
    `Generated pixi.toml has multi-line cmd line(s) without a continuation token ` +
      `(${CONTINUATIONS.join(' ')}); pixi >= 0.70 would run these as separate commands:\n` +
      offenders.map((line) => `  - ${line}`).join('\n')
  )

  // Sanity check: the cmake configure tasks that originally regressed are
  // present and use backslash continuation on their opening line.
  for (const task of [
    'configure-itk',
    'configure-itk-wasm',
    'configure-native'
  ]) {
    const header = `[feature.native.tasks.${task}]`
    assert.ok(
      toml.includes(header),
      `Expected generated pixi.toml to define ${header}`
    )
  }
  assert.match(
    toml,
    /cmd = '''cmake -B\$ITK_WASM_ITK_BUILD_DIR -S\$ITK_WASM_ITK_SOURCE_DIR -GNinja \\\n/,
    'Expected configure-itk to continue its first line with a trailing backslash'
  )

  console.log(
    `pixi.toml generation test passed (${blocks.length} multi-line commands checked).`
  )
}

run()
