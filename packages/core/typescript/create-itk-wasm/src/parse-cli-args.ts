import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { Command, Option } from '@commander-js/extra-typings'
import chalk from 'chalk'

import ProjectSpec from './project-spec.js'
import PipelineSpec from './pipeline-spec.js'
import Dispatch from './dispatch.js'
import OptionSpec from './option-spec.js'
import OptionType from './option-type.js'
import die from './die.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
)

const optionSpecForm =
  '<name>:<type>:<description>:[default]:[required]:[min-items]:[max-items]'

function optionSpecParser(
  optionSpec: string,
  previous: OptionSpec[]
): OptionSpec[] {
  const spec = optionSpec.split(':')
  if (spec.length < 3) {
    throw new Error(
      `Invalid option spec: ${optionSpec}. Must be in the form ${optionSpecForm}. name:type:description missing.`
    )
  }

  const optionType = spec[1]
  if (!Object.values(OptionType).includes(optionType as OptionType)) {
    die(
      `Invalid option type: ${optionType}. Must be one of ${Object.values(OptionType).join(', ')}.`
    )
  }

  const result = {
    name: spec[0],
    type: optionType,
    description: spec[2]
  } as OptionSpec

  if (spec.length > 3) {
    result.defaultValue = spec[3]
  } else {
    result.defaultValue = ''
  }

  if (spec.length > 4) {
    result.required = spec[4] === 'true'
  } else {
    result.required = false
  }

  if (spec.length > 5) {
    result.itemsExpectedMin = parseInt(spec[5])
  } else {
    result.itemsExpectedMin = 1
  }

  if (spec.length > 6) {
    result.itemsExpectedMax = parseInt(spec[6])
  } else {
    result.itemsExpectedMax = 1
  }

  return previous.concat(result)
}

function parseCliArgs(): {
  noInput: boolean
  doBuildAndTest: boolean
  project: ProjectSpec
  pipeline: PipelineSpec | undefined
} {
  const program = new Command()
    .version(chalk.blue(packageJson.version))
    .description(
      `${chalk.green(packageJson.description)}


Pipeline inputs, parameters, and outputs are specified using the following format:

  ${optionSpecForm}

where:

  - <name>: must be kebab-case.
  - <type>: is one of ${Object.values(OptionType).join(', ')}.
  - <description>: is a one-line description.
  - [default]: is the default value. For multiple items, separate with commas.
  - [required]: is a boolean. Defaults to false. Only used for parameters.
  - [items]: is the number of items expected. Defaults to 1.
  - [min-items]: is the minimum number of items expected. Defaults to the value of items, if specified.
  - [max-items]: is the maximum number of items expected. Defaults to min-items if specified or -1 (unlimited) a default sequence provided.
`
    )
    .option('-n, --name <name>', 'project name')
    .option(
      '-o, --directory <output-dir>',
      'output directory. Defaults to the project name.'
    )
    .option('--no-input', 'no interactive input mode')
    .option('-a, --author <author>', 'project author')
    .option('-d, --description <description>', 'package description')
    .option('-r, --repository <repository>', 'repository URL')
    .option(
      '--typescript-package-name <typescript-package-name>',
      'typeScript package name'
    )
    .option(
      '--python-package-name <python-package-name>',
      'python package name'
    )
    .option('--pipeline-name <pipeline-name>', 'pipeline name')
    .option(
      '--pipeline-description <pipeline-description>',
      'pipeline description'
    )
    .addOption(
      new Option(
        '--pipeline-dispatch <pipeline-dispatch>',
        'dispatch the pipeline based on the specified input type.'
      )
        .default('None')
        .choices(Object.values(Dispatch))
    )
    .addOption(
      new Option(
        '--pipeline-dispatch-pixels <pipeline-dispatch-pixels>',
        'semicolon delimited of supported pixel or data attribute type.'
      ).default('uint8_t:float')
    )
    .addOption(
      new Option(
        '--pipeline-dispatch-dimensions <pipeline-dispatch-dimensions>',
        'semicolon delimited supported dimensions.'
      ).default('2:3')
    )
    .addOption(
      new Option('--pipeline-inputs [inputs...]', 'pipeline inputs')
        .argParser(optionSpecParser)
        .default([])
    )
    .addOption(
      new Option('--pipeline-parameters [parameters...]', 'pipeline parameters')
        .argParser(optionSpecParser)
        .default([])
    )
    .addOption(
      new Option('--pipeline-outputs [outputs...]', 'pipeline outputs')
        .argParser(optionSpecParser)
        .default([])
    )
    .option(
      '--build-and-test',
      'build and test the project after generating it. Requires Docker.'
    )
    .parse(process.argv)
  const options = program.opts()

  const project: ProjectSpec = {
    name: options.name,
    directory: options.directory,
    packageDescription: options.description,
    author: options.author,
    repositoryUrl: options.repository,
    typescriptPackageName: options.typescriptPackageName,
    pythonPackageName: options.pythonPackageName
  }

  let pipeline: PipelineSpec | undefined
  if (options.pipelineName) {
    pipeline = {
      name: options.pipelineName,
      description: options.pipelineDescription,
      dispatch: options.pipelineDispatch,
      // @ts-ignore
      dispatchPixels: options.pipelineDispatchPixels.split(':'),
      // @ts-ignore
      dispatchDimensions: options.pipelineDispatchDimensions.split(':'),
      // @ts-ignore
      inputs: options.pipelineInputs ?? [],
      // @ts-ignore
      parameters: options.pipelineParameters ?? [],
      // @ts-ignore
      outputs: options.pipelineOutputs ?? []
    }
  }

  return {
    noInput: !options.input,
    doBuildAndTest: !!options.buildAndTest,
    project,
    pipeline
  }
}

export default parseCliArgs
