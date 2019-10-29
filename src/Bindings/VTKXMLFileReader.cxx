/*=========================================================================
 *
 *  Copyright Insight Software Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *=========================================================================*/
#include "vtkGeometryFilter.h"
#include "vtkJSONDataSetWriter.h"
#include "vtkPolyDataReader.h"
#include "vtkSmartPointer.h"
#include "vtkXMLPolyDataReader.h"
#include "vtkXMLReader.h"
#include "vtkXMLUnstructuredGridReader.h"

int main(int argc, char* argv[]) {
  if (argc < 3) {
    std::cerr << "Usage: " << argv[0] << " <inputFile> <outputPolyDataFile> "
              << std::endl;
    return EXIT_FAILURE;
  }
  const char* inputFile = argv[1];
  const char* outputPolyDataFile = argv[2];

  vtkNew<vtkGeometryFilter> geometryFilter;

  vtkNew<vtkJSONDataSetWriter> writer;
  writer->SetFileName(outputPolyDataFile);

  bool canReadFile = false;

  vtkSmartPointer<vtkXMLReader> reader =
      vtkSmartPointer<vtkXMLPolyDataReader>::New();
  if (reader->CanReadFile(inputFile)) {
    canReadFile = true;
    reader->SetFileName(inputFile);
    writer->SetInputConnection(reader->GetOutputPort());
  }

  reader = vtkSmartPointer<vtkXMLUnstructuredGridReader>::New();
  if (reader->CanReadFile(inputFile)) {
    canReadFile = true;
    reader->SetFileName(inputFile);
    geometryFilter->SetInputConnection(reader->GetOutputPort());
    writer->SetInputConnection(geometryFilter->GetOutputPort());
  }

  if (!canReadFile) {
    std::cerr << "Unsupported file." << std::endl;
    return EXIT_FAILURE;
  }

  try {
    writer->Update();
  } catch (const std::exception& error) {
    std::cerr << "Error: " << error.what() << std::endl;
    return EXIT_FAILURE;
  }

  return EXIT_SUCCESS;
}
