import inquirer from 'inquirer'
import chalk from 'chalk'

import PipelineSpec from '../pipeline-spec.js'
import isValidPackageName from '../is-valid-package-name.js'
import Dispatch from '../dispatch.js'
import DispatchPixels from '../dispatch-pixels.js'

async function inquirePipelineSpec(
  pipeline: PipelineSpec,
  askAnswered: boolean
): Promise<PipelineSpec> {
  if (!askAnswered && pipeline.name) {
    const indent = '  '
    console.log(
      `${indent}${chalk.green('Pipeline name')}: ${chalk.yellow(pipeline.name)}`
    )
  }
  const questions = [
    {
      type: 'input',
      name: 'name',
      message: 'Pipeline name:',
      default: pipeline.name,
      askAnswered,
      validate: (input: string) => {
        if (isValidPackageName(input)) {
          return true
        }
        return 'Invalid pipeline name. Must be kebab case (lowercase and hyphens).'
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'Pipeline description:',
      askAnswered,
      default: pipeline.description,
      validate: (input: string) => {
        if (input.length > 0) {
          return true
        }
        return 'Description cannot be empty.'
      }
    },
    {
      type: 'list',
      name: 'dispatch',
      message: 'Dispatch:',
      choices: Object.values(Dispatch),
      askAnswered,
      default: pipeline.dispatch || Dispatch.None
    }
  ]
  const answers = await inquirer.prompt(questions, pipeline)
  if (answers.dispatch !== Dispatch.None) {
    const followupQuestions = [
      {
        type: 'checkbox',
        name: 'dispatchPixels',
        message: 'Supported pixel or data attribute types:',
        choices: Object.values(DispatchPixels),
        askAnswered,
        default: pipeline.dispatchPixels || [
          DispatchPixels.Uint8,
          DispatchPixels.Float32
        ]
      },
      {
        type: 'checkbox',
        name: 'dispatchDimensions',
        message: 'Supported dimensions:',
        choices: [2, 3, 4, 5, 6],
        askAnswered,
        default: pipeline.dispatchDimensions || [2, 3]
      }
    ]
    const followupAnswers = await inquirer.prompt(followupQuestions, pipeline)
    answers.dispatchPixels = followupAnswers.dispatchPixels
    answers.dispatchDimensions = followupAnswers.dispatchDimensions
  }
  return answers
}

export default inquirePipelineSpec
