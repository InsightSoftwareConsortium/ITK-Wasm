import { demoServer, pipelineBaseUrl, pipelineWorkerUrl } from '../common'

describe('pthreadSupportAvailable', () => {
  beforeEach(() => {
    cy.visit(demoServer)
    cy.window().then(async (win) => {
      const itk = win.itk
      itk.setPipelineWorkerUrl(pipelineWorkerUrl)
      itk.setPipelinesBaseUrl(pipelineBaseUrl)
    })
  })

  it('reports whether pthread support is available', () => {
    cy.window().then(async (win) => {
      const itk = win.itk

      const pthreadSupportAvailable = itk.pthreadSupportAvailable()
      expect(pthreadSupportAvailable).to.equal(false)
    })
  })
})
