import fs from 'fs'
import path from 'path'

import { assign, setup, fromPromise, AnyActor } from 'xstate'
import inquirer from 'inquirer'
import chalk from 'chalk'

function printJustified(object: Record<string, unknown>, indent: string) {
  let newKeys = Object.keys(object).map((key) =>
    key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
  )
  let maxLength = Math.max(...newKeys.map((key) => key.length))
  newKeys = newKeys.map((key) => key.padStart(maxLength))
  const values = Object.values(object)
  for (let i = 0; i < newKeys.length; i++) {
    console.log(
      `${indent}${chalk.green(newKeys[i])}: ${chalk.yellow(values[i])}`
    )
  }
  console.log(`${indent}${chalk.gray(new inquirer.Separator())}`)
}

const inquireEditWantedMachine = setup({
  types: {
    context: {} as {
      sender?: AnyActor
      response?: boolean | string
      specName: string
      spec: Record<string, unknown>
    },
    input: {} as {
      spec?: Record<string, unknown>
      specName?: string
    },
    events: {} as {
      type: 'inquire'
      sender: AnyActor
      spec: Record<string, unknown>
    }
  },
  actions: {
    sendResponse: ({ context }) => {
      const edit = context.response
      switch (edit) {
        case 'Finished':
          context.sender.send({ type: 'editFinished' })
          break
        case 'Primary':
          context.sender.send({ type: 'editPrimary' })
          break
        case 'Inputs':
          context.sender.send({ type: 'editInputs' })
          break
        case 'Parameters':
          context.sender.send({ type: 'editParameters' })
          break
        case 'Outputs':
          context.sender.send({ type: 'editOutputs' })
          break
        case true:
          context.sender.send({ type: 'edit' })
          break
        default:
          context.sender.send({ type: 'confirm' })
      }
    }
  },
  actors: {
    printAndInquire: fromPromise(async ({ input }) => {
      // @ts-ignore
      const spec = input.spec
      // @ts-ignore
      const specName = input.specName

      if (specName === 'Add another pipeline?') {
        console.log('\n')
        const questions = [
          {
            type: 'confirm',
            name: 'edit',
            message: `🔢  ${specName}`,
            default: false
          }
        ]
        const { edit } = await inquirer.prompt(questions)
        return edit
      } else if (specName === '🧪  Pipeline') {
        const questions = [
          {
            type: 'list',
            name: 'edit',
            choices: ['Finished', 'Primary', 'Inputs', 'Parameters', 'Outputs'],
            message: `✔️  Edit pipeline interface?`,
            default: 'Finished'
          }
        ]
        const { edit } = await inquirer.prompt(questions)
        return edit
      }

      console.log(chalk.gray(new inquirer.Separator()))
      console.log(`${chalk.cyanBright(specName)}:`)

      let newKeys = Object.keys(spec).map((key) =>
        key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
      )
      let maxLength = Math.max(...newKeys.map((key) => key.length))
      newKeys = newKeys.map((key) => key.padStart(maxLength))
      const values = Object.values(spec)
      for (let i = 0; i < newKeys.length; i++) {
        if (Array.isArray(values[i])) {
          // @ts-ignore
          if (values[i].length === 0) {
            console.log(`${chalk.green(newKeys[i])}: ∅  (none)`)
          } else {
            console.log(`${chalk.green(newKeys[i])}:`)
          }
          // @ts-ignore
          for (let j = 0; j < values[i].length; j++) {
            // @ts-ignore
            printJustified(values[i][j], ' '.repeat(newKeys[i].length + 2))
          }
        } else {
          console.log(`${chalk.green(newKeys[i])}: ${chalk.yellow(values[i])}`)
        }
      }

      if (
        spec.directory &&
        fs.existsSync(path.join(spec.directory, 'package.json'))
      ) {
        return false
      }
      const questions = [
        {
          type: 'confirm',
          name: 'edit',
          message: '✔️  Edit?',
          default: false
        }
      ]
      const { edit } = await inquirer.prompt(questions)
      return edit
    })
  }
}).createMachine({
  id: 'inquireEditWanted',
  initial: 'idle',
  context: ({ input }) => {
    return {
      specName: input.specName,
      spec: input.spec
    }
  },
  states: {
    idle: {
      on: {
        inquire: {
          target: 'inquiring',
          actions: assign({
            sender: ({ event }) => event.sender
          })
        }
      }
    },
    inquiring: {
      invoke: {
        id: 'printAndInquire',
        src: 'printAndInquire',
        input: ({ context }) => {
          return { spec: context.spec, specName: context.specName }
        },
        onDone: {
          target: 'obtainedResponse',
          actions: [
            assign({ response: ({ event }) => event.output as boolean }),
            'sendResponse'
          ]
        }
      }
    },
    obtainedResponse: {
      type: 'final'
    }
  }
})

export default inquireEditWantedMachine
