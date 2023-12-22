import { demoServer, verifyMesh } from './common.ts'

describe('read-mesh', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    const testImageFiles = [
      'cow.vtk'
    ]
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName)
    })
  })

  it('Reads an mesh File in the demo', function () {
    cy.get('sl-tab[panel="readMesh-panel"]').click()

    const testFile = { contents: new Uint8Array(this['cow.vtk']), fileName: 'cow.vtk' }
    cy.get('#readMeshInputs input[name="serialized-mesh-file"]').selectFile([testFile,], { force: true })
    cy.get('#readMesh-serialized-mesh-details').should('contain', '35,32')

    cy.get('#readMeshInputs sl-button[name="run"]').click()

    cy.get('#readMesh-mesh-details').should('contain', 'meshType')
  })

  it('Reads an mesh BinaryFile', function () {
    cy.window().then(async (win) => {
      const arrayBuffer = new Uint8Array(this['cow.vtk']).buffer
      const { mesh, webWorker } = await win.meshIo.readMesh({ data: new Uint8Array(arrayBuffer), path: 'cow.vtk' })
      webWorker.terminate()
      verifyMesh(mesh)
    })
  })

  it('Reads an mesh File', function () {
    cy.window().then(async (win) => {
      const arrayBuffer = new Uint8Array(this['cow.vtk']).buffer
      const cowFile = new win.File([arrayBuffer], 'cow.vtk')
      const { mesh, webWorker } = await win.meshIo.readMesh(cowFile)
      webWorker.terminate()
      verifyMesh(mesh)
    })
  })

  it('Reads re-uses a WebWorker', function () {
    cy.window().then(async (win) => {
      const arrayBuffer = new Uint8Array(this['cow.vtk']).buffer
      const cowFile = new win.File([arrayBuffer], 'cow.vtk')
      const { webWorker } = await win.meshIo.readMesh(cowFile)
      const { mesh } = await win.meshIo.readMesh(cowFile, { webWorker })
      webWorker.terminate()
      verifyMesh(mesh)
    })
  })

  it('Throws a catchable error for an invalid file', { defaultCommandTimeout: 120000 }, function () {
    cy.window().then(async (win) => {
      const invalidArray = new Uint8Array([21, 4, 4, 4, 4, 9, 5, 0, 82, 42])
      const invalidBlob = new win.Blob([invalidArray])
      const invalidFile = new win.File([invalidBlob], 'invalid.file')
      try {
        const { webWorker, mesh } = await win.meshIo.readMesh(invalidFile)
        webWorker.terminate()
      } catch (error) {
        cy.expect(error.message).to.equal('Could not find IO for: invalid.file')
      }
    })
  })
})
