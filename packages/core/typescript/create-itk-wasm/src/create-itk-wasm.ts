#!/usr/bin/env node

import figlet from 'figlet'
import chalk from 'chalk'
import { createActor, waitFor } from 'xstate'

import die from './die.js'
import ProjectSpec from './project-spec.js'
import PipelineSpec from './pipeline-spec.js'
import parseCliArgs from './parse-cli-args.js'
import generateProject from './generate/project.js'
import readFilesystemDefaults from './read-filesystem-defaults.js'
import inquireMachine from './inquire/machine.js'
import buildAndTest from './build-and-test.js'

async function main() {
  let pipelines: PipelineSpec[] = []

  let { noInput, doBuildAndTest, project, pipeline } = parseCliArgs()
  if (pipeline) {
    pipelines.push(pipeline)
  }

  project = readFilesystemDefaults(project)

  if (project.name && !project.typescriptPackageName) {
    project.typescriptPackageName = project.name
  }
  if (project.name && !project.pythonPackageName) {
    project.pythonPackageName = project.name
  }
  if (!project.license) {
    project.license = 'Apache-2.0'
  }

  if (noInput) {
    if (pipelines.length === 0) {
      die('When using --no-input, at least one pipeline must be specified.')
    }
    generateProject(project, pipelines, true)
    if (doBuildAndTest) {
      buildAndTest(project.directory)
    }
    process.exit(0)
  }

  console.log(
    chalk.blueBright(figlet.textSync('ITK-Wasm', { horizontalLayout: 'full' }))
  )

  const inquireActor = createActor(inquireMachine, {
    input: { project, pipelines }
  })
  inquireActor.start()
  const snapshot = await waitFor(
    inquireActor,
    (snapshot) => {
      const complete = !!snapshot.output
      return complete
    },
    { timeout: 10e8 }
  )
  interface Output {
    project: ProjectSpec
    pipelines: PipelineSpec[]
  }
  const output = snapshot.output as Output
  project = output.project
  pipelines = output.pipelines

  generateProject(project, pipelines, true)
  if (doBuildAndTest) {
    buildAndTest(project.directory)
  }
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    die(error)
  })
