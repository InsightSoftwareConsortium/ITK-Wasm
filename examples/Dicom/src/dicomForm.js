
function setupDicomForm(patientDict, callback) {
  const patientSelect = document.getElementById("patientSelect")
  const studySelect = document.getElementById("studySelect")
  const serieSelect = document.getElementById("serieSelect")

  // Remove options
  var patients = []
  var studies = []
  var series = []
  patientSelect.length = 1;

  // Add patients
  for (const key in patientDict) {
    const patient = patientDict[key]
    patients.push(patient)
    const value = patient.patientName + " - " + patient.patientDateOfBirth
    patientSelect.options[patientSelect.options.length] = new Option(value, value);
  }

  patientSelect.onchange = function () {
    // Remove options
    studies = []
    series = []
    studySelect.length = 1;
    serieSelect.length = 1;

    if (this.selectedIndex < 1) return; // done

    // Add underneath studies
    const patientId = this.selectedIndex - 1
    const patient = patients[patientId]
    for (const key in patient.studyDict) {
      const study = patient.studyDict[key]
      studies.push(study)
      const value = study.studyDescription + " - " + study.studyDate
      studySelect.options[studySelect.options.length] = new Option(value, value);
    }
  }
  patientSelect.onchange(); // reset in case page is reloaded

  studySelect.onchange = function () {
    // Remove options
    series = []
    serieSelect.length = 1;

    if (this.selectedIndex < 1) return; // done

    // Add underneath series
    const studyId = this.selectedIndex - 1
    const study = studies[studyId]
    for (const key in study.serieDict) {
      const serie = study.serieDict[key]
      series.push(serie)
      const value = serie.seriesDescription + " - " + serie.seriesModality
      serieSelect.options[serieSelect.options.length] = new Option(value, value);
    }
  }

  serieSelect.onchange = function () {
    if (this.selectedIndex < 1) return; // done

    // Return files for serie
    const serieId = this.selectedIndex - 1
    const serie = series[serieId]
    callback(serie.files)
  }
}

export default setupDicomForm;