
function setupDicomForm(patientDict, callback) {
  const patientSelect = document.getElementById("patientSelect")
  const studySelect = document.getElementById("studySelect")
  const serieSelect = document.getElementById("serieSelect")

  patientSelect.length = 1; // remove all options bar first
  const patients = Array.from(patientDict.values())
  patientDict.forEach((patient) => {
    const value = patient.name + " - " + patient.dateOfBirth
    patientSelect.options[patientSelect.options.length] = new Option(value, value);
  })

  patientSelect.onchange = function () {
    studySelect.length = 1; // remove all options bar first
    serieSelect.length = 1; // remove all options bar first
    if (this.selectedIndex < 1) return; // done
    const patientId = this.selectedIndex - 1
    const patient = patients[patientId]
    patient.studyDict.forEach((study) => {
      const value = study.description + " - " + study.date
      studySelect.options[studySelect.options.length] = new Option(value, value);
    })
  }
  patientSelect.onchange(); // reset in case page is reloaded

  studySelect.onchange = function () {
    serieSelect.length = 1; // remove all options bar first
    if (this.selectedIndex < 1) return; // done
    const patientId = patientSelect.selectedIndex - 1
    const patient = patients[patientId]
    const studies = Array.from(patient.studyDict.values())
    const studyId = this.selectedIndex - 1
    const study = studies[studyId]
    study.serieDict.forEach((serie) => {
      const value = serie.description + " - " + serie.modality
      serieSelect.options[serieSelect.options.length] = new Option(value, value);
    })
  }

  serieSelect.onchange = function () {
    if (this.selectedIndex < 1) return; // done
    const patientId = patientSelect.selectedIndex - 1
    const patient = patients[patientId]
    const studies = Array.from(patient.studyDict.values())
    const studyId = studySelect.selectedIndex - 1
    const study = studies[studyId]
    const series = Array.from(study.serieDict.values())
    const serieId = this.selectedIndex - 1
    const serie = series[serieId]
    callback(serie.files)
  }
}

export default setupDicomForm;