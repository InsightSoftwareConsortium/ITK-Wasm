import { setup, sendTo, assign, fromPromise, MachineContext } from 'xstate'
import chalk from 'chalk'

import ProjectSpec from '../project-spec.js'
import PipelineSpec from '../pipeline-spec.js'
import OptionSpec from '../option-spec.js'
import Dispatch from '../dispatch.js'

import inquireProjectSpec from './project-spec.js'
import inquireEditWantedMachine from './edit-wanted-machine.js'
import inquirePipelineSpec from './pipeline-spec.js'
import inquireOptionSpec from './option-specs.js'

interface PipelineSpecEvent {
  type: 'input_pipeline_spec'
  spec: PipelineSpec
}

interface InquireMachineContext extends MachineContext {
  project: ProjectSpec
  useProjectAnswers: boolean
  pipelines: PipelineSpec[]
  usePipelineAnswers: boolean
  editOption?: 'inputs' | 'parameters' | 'outputs'
}

const inquireMachine = setup({
  types: {
    context: {} as InquireMachineContext,
    events: {} as
      | { type: 'edit' }
      | { type: 'cancel' }
      | { type: 'confirm' }
      | { type: 'editFinished' }
      | { type: 'editPrimary' }
      | { type: 'editInputs' }
      | { type: 'editParameters' }
      | { type: 'editOutputs' }
      | { type: 'complete_package' }
      | PipelineSpecEvent
  },
  actions: {},
  actors: {
    inquireProjectSpec: fromPromise(async ({ input }) => {
      // @ts-ignore
      let project = input.project
      // @ts-ignore
      const useAnswers = input.useAnswers
      project = await inquireProjectSpec(project, !useAnswers)
      return project
    }),
    inquireEditWantedMachine,
    inquirePipelineSpec: fromPromise(async ({ input }) => {
      // @ts-ignore
      let pipeline = input.pipeline
      // @ts-ignore
      const useAnswers = input.useAnswers
      pipeline = await inquirePipelineSpec(pipeline, !useAnswers)
      return pipeline
    }),
    inquireOptionSpec: fromPromise(async ({ input }) => {
      // @ts-ignore
      let option = input.option
      // @ts-ignore
      const optionName = input.editOption as string
      // const useAnswers = false
      // option = await inquireOptionSpec(optionName, option, !useAnswers)
      option = await inquireOptionSpec(optionName, option)
      return option
    })
  },
  guards: {
    haveOption: ({ context }) => {
      const newPipeline = context.pipelines[context.pipelines.length - 1]
      const invalidPipeline =
        newPipeline.inputs?.length === 0 &&
        newPipeline.outputs?.length === 0 &&
        newPipeline.parameters?.length === 0
      return invalidPipeline
    }
  },
  delays: {}
}).createMachine({
  context: ({ input }) => {
    const inputPipelines = (input as InquireMachineContext).pipelines
    const pipelines = inputPipelines.length
      ? inputPipelines
      : [{} as PipelineSpec]
    return {
      project: (input as InquireMachineContext).project,
      useProjectAnswers: true,
      pipelines,
      usePipelineAnswers: true
    }
  },
  id: 'inquire',
  initial: 'Awaiting Project Specification',
  states: {
    'Awaiting Project Specification': {
      description:
        'The state where the machine is waiting for the user to input the base details of the package, such as the name, description, and author.',
      invoke: {
        id: 'getProjectSpec',
        src: 'inquireProjectSpec',
        input: ({ context }) => {
          return {
            project: context.project,
            useAnswers: context.useProjectAnswers
          }
        },
        onDone: {
          target: 'Confirming Project Specification',
          actions: assign({
            project: ({ event }) => event.output as ProjectSpec
          })
        },
        onError: {
          target: 'Awaiting Project Specification'
        }
      }
    },
    'Confirming Project Specification': {
      description:
        'The state where the machine has received the package details and is waiting for the user to confirm these details or to edit them.',
      on: {
        confirm: {
          target: 'Awaiting Pipeline Primary Specification',
          actions: () => console.log('\n')
        },
        edit: {
          target: 'Awaiting Project Specification',
          actions: [() => console.log(''), assign({ useProjectAnswers: false })]
        }
      },
      invoke: {
        id: 'confirmProjectSpec',
        src: 'inquireEditWantedMachine',
        // @ts-ignore
        input: ({ context }) => {
          return { specName: '⚙️  Project', spec: context.project }
        }
      },
      entry: sendTo('confirmProjectSpec', ({ self }) => ({
        type: 'inquire',
        sender: self
      }))
    },
    'Awaiting Pipeline Primary Specification': {
      description:
        'The state where the machine is waiting for the user to input details for the primary description of a pipeline.',
      invoke: {
        id: 'getPipelinePrimarySpec',
        src: 'inquirePipelineSpec',
        input: ({ context }) => {
          const pipeline = context.pipelines[context.pipelines.length - 1]
          return {
            pipeline,
            useAnswers: context.usePipelineAnswers
          }
        },
        onDone: {
          target: 'Confirming Pipeline Specification',
          actions: assign({
            pipelines: ({ context, event }) => {
              const primary = event.output as PipelineSpec
              const updatedPipeline =
                context.pipelines[context.pipelines.length - 1]
              updatedPipeline.name = primary.name
              updatedPipeline.description = primary.description
              updatedPipeline.dispatch = primary.dispatch
              updatedPipeline.dispatchPixels = primary.dispatchPixels
              updatedPipeline.dispatchDimensions = primary.dispatchDimensions
              return [
                ...context.pipelines.slice(0, context.pipelines.length - 1),
                updatedPipeline
              ]
            }
          })
        },
        onError: {
          target: 'Awaiting Pipeline Primary Specification'
        }
      }
    },
    'Awaiting Pipeline Option Specification': {
      description:
        "The state where the machine is waiting for the user to input details for a pipeline's inputs, parameters, or outputs.",
      invoke: {
        id: 'getPipelineOptionSpec',
        src: 'inquireOptionSpec',
        input: ({ context }) => {
          const pipeline = context.pipelines[context.pipelines.length - 1]
          const option = pipeline[context.editOption]
          return {
            editOption: context.editOption,
            option,
            useAnswers: context.usePipelineAnswers
          }
        },
        onDone: {
          target: 'Confirming Pipeline Specification',
          actions: assign({
            pipelines: ({ context, event }) => {
              const option = event.output as PipelineSpec
              const updatedPipeline =
                context.pipelines[context.pipelines.length - 1]
              // @ts-ignore
              updatedPipeline[context.editOption] = option
              return [
                ...context.pipelines.slice(0, context.pipelines.length - 1),
                updatedPipeline
              ]
            }
          })
        },
        onError: {
          target: 'Awaiting Pipeline Primary Specification'
        }
      }
    },
    'Confirming Pipeline Specification': {
      description:
        'The state where the machine has received details for a pipeline and is waiting for the user to confirm these details or to edit them.',
      on: {
        editFinished: [
          {
            target: 'Awaiting Pipeline Primary Specification',
            guard: 'haveOption',
            actions: () =>
              console.log(
                chalk.red(
                  'At least one input, parameter, or output must be specified.'
                )
              )
          },
          {
            target: 'Confirm Add Another Pipeline Specification'
          }
        ],
        editPrimary: {
          target: 'Awaiting Pipeline Primary Specification',
          actions: [
            () => console.log(''),
            assign({ usePipelineAnswers: false })
          ]
        },
        editInputs: {
          target: 'Awaiting Pipeline Option Specification',
          actions: [assign({ editOption: 'inputs' })]
        },
        editParameters: {
          target: 'Awaiting Pipeline Option Specification',
          actions: [assign({ editOption: 'parameters' })]
        },
        editOutputs: {
          target: 'Awaiting Pipeline Option Specification',
          actions: [assign({ editOption: 'outputs' })]
        }
      },
      invoke: {
        id: 'confirmPipelineSpec',
        src: 'inquireEditWantedMachine',
        // @ts-ignore
        input: ({ context }) => {
          return {
            specName: '🧪  Pipeline',
            spec: context.pipelines[context.pipelines.length - 1]
          }
        }
      },
      entry: sendTo('confirmPipelineSpec', ({ self }) => ({
        type: 'inquire',
        sender: self
      }))
    },
    'Confirm Add Another Pipeline Specification': {
      description:
        'The state where the machine has is waiting for the user to confirm whether they want to add another pipeline.',
      on: {
        confirm: {
          target: 'Project Creation Complete'
        },
        edit: {
          target: 'Awaiting Pipeline Primary Specification',
          actions: [
            () => console.log('\n'),
            assign({
              pipelines: ({ context }) => {
                return [
                  ...context.pipelines,
                  {
                    name: '',
                    description: '',
                    dispatch: Dispatch.None,
                    inputs: [] as OptionSpec[],
                    parameters: [] as OptionSpec[],
                    outputs: [] as OptionSpec[]
                  }
                ]
              },
              usePipelineAnswers: false
            })
          ]
        }
      },
      invoke: {
        id: 'confirmAddAnotherPipelineSpec',
        src: 'inquireEditWantedMachine',
        // @ts-ignore
        input: ({ context }) => {
          return {
            specName: 'Add another pipeline?',
            spec: ''
          }
        }
      },
      entry: sendTo('confirmAddAnotherPipelineSpec', ({ self }) => ({
        type: 'inquire',
        sender: self
      }))
    },
    'Project Creation Complete': {
      description:
        'The state where the package creation process has been completed.',
      type: 'final'
    }
  },
  on: {
    cancel: {}
  },
  output: ({ context }) => ({
    project: context.project,
    pipelines: context.pipelines
  })
})

export default inquireMachine
