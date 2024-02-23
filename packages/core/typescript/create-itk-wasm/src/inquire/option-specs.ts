import inquirer from 'inquirer'
import chalk from 'chalk'

import OptionSpec from '../option-spec.js'
import isValidPackageName from '../is-valid-package-name.js'
import OptionType from '../option-type.js'

async function editIndexOptionSpecs(
  optionName: string,
  options: OptionSpec[],
  index: number
): Promise<OptionSpec[]> {
  const askAnswered = true
  const option = options[index]
  if (!askAnswered && option.name) {
    const indent = '    '
    console.log(
      `${indent}${chalk.green('Option name')}: ${chalk.yellow(option.name)}`
    )
  }
  const prefix = `    ${chalk.green('?')}`
  const questions = [
    {
      type: 'input',
      name: 'name',
      message: 'Name:',
      default: option.name,
      prefix,
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
      message: 'Description:',
      default: option.description,
      prefix,
      askAnswered,
      validate: (input: string) => {
        if (input.length > 0) {
          return true
        }
        return 'Description cannot be empty.'
      }
    },
    {
      type: 'list',
      name: 'type',
      message: 'Type',
      choices: Object.values(OptionType),
      prefix,
      askAnswered,
      default: option.type || 'string'
    },
    {
      type: 'input',
      name: 'defaultValue',
      message: 'Default value:',
      prefix,
      askAnswered,
      default: option.defaultValue
    }
  ]
  if (optionName === 'parameters') {
    questions.push(
      {
        type: 'confirm',
        name: 'required',
        message: 'Required:',
        prefix,
        askAnswered,
        // @ts-ignore
        default: option.required || false
      },
      {
        type: 'number',
        name: 'itemsExpectedMin',
        message: 'Items expected min:',
        prefix,
        askAnswered,
        default: option.itemsExpectedMin || 1
      },
      {
        type: 'number',
        name: 'itemsExpectedMax',
        message: 'Items expected max:',
        prefix,
        askAnswered,
        default: option.itemsExpectedMax || 1
      }
    )
  }
  const answers = await inquirer.prompt(questions, option)
  if (optionName !== 'parameters') {
    answers.required = true
    answers.itemsExpectedMin = 1
    answers.itemsExpectedMax = 1
  }

  options[index] = answers
  return inquireOptionSpecs(optionName, options)
}

async function inquireRemoveOptionSpecs(
  optionName: string,
  options: OptionSpec[]
): Promise<OptionSpec[]> {
  const choices = options.map((option) => {
    return option.name
  })
  const { toRemove } = await inquirer.prompt([
    {
      type: 'list',
      name: 'toRemove',
      message: 'Remove:',
      choices
    }
  ])
  const index = options.findIndex((option) => {
    return option.name === toRemove
  })
  options.splice(index, 1)

  return inquireOptionSpecs(optionName, options)
}

async function inquireEditOptionSpecs(
  optionName: string,
  options: OptionSpec[]
): Promise<OptionSpec[]> {
  const choices = options.map((option) => {
    return option.name
  })
  const { toEdit } = await inquirer.prompt([
    {
      type: 'list',
      name: 'toEdit',
      message: 'Edit:',
      choices
    }
  ])
  const index = options.findIndex((option) => {
    return option.name === toEdit
  })
  return editIndexOptionSpecs(optionName, options, index)
}

async function inquireAddOptionSpecs(
  optionName: string,
  options: OptionSpec[]
): Promise<OptionSpec[]> {
  const required = optionName !== 'parameters'
  const newOption = {
    name: '',
    type: OptionType.string,
    description: '',
    defaultValue: '',
    required,
    itemsExpectedMin: 1,
    itemsExpectedMax: 1
  }
  options.push(newOption)
  return editIndexOptionSpecs(optionName, options, options.length - 1)
}

async function inquireOptionSpecs(
  optionName: string,
  options: OptionSpec[]
): Promise<OptionSpec[]> {
  let emoji = ''
  if (optionName === 'inputs') {
    emoji = '📥'
  } else if (optionName === 'outputs') {
    emoji = '📤'
  } else if (optionName === 'parameters') {
    emoji = '🛠'
  }
  const currentOptions = options.map((option) => {
    return option.name
  })
  console.log(
    chalk.bold(
      chalk.cyan(
        `\n${emoji}  ${optionName.charAt(0).toUpperCase()}${optionName.slice(1)}: `
      )
    ) +
      currentOptions.join(', ') +
      '\n'
  )
  const choices = ['Finished', 'Add']
  if (options.length > 0) {
    choices.push('Remove')
    choices.push('Edit')
  }
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: `Modify ${optionName}?`,
      choices
    }
  ])
  switch (action) {
    case 'Finished':
      return options
    case 'Add':
      return inquireAddOptionSpecs(optionName, options)
    case 'Remove':
      return inquireRemoveOptionSpecs(optionName, options)
    case 'Edit':
      return inquireEditOptionSpecs(optionName, options)
    default:
      throw new Error('Unrecognized action')
  }
}

export default inquireOptionSpecs
