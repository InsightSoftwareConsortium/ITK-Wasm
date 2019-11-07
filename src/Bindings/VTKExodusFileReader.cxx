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
#include "vtkAppendCompositeDataLeaves.h"
#include "vtkExodusIIReader.h"
#include "vtkGeometryFilter.h"
#include "vtkJSONDataSetWriter.h"
#include "vtkMultiBlockDataSet.h"
#include "vtkPolyData.h"
#include "vtkSmartPointer.h"

vtkPolyData* FindPolyData(vtkMultiBlockDataSet* output)
{
  int nb = output->GetNumberOfBlocks();
  for (int bb = 0; bb < nb; ++bb)
  {
    auto data = output->GetBlock(bb);
    if (data)
    {
      auto polydata = vtkPolyData::SafeDownCast(data);
      if (polydata)
      {
        return polydata;
      }
      auto mbds = vtkMultiBlockDataSet::SafeDownCast(data);
      if (mbds)
      {
        polydata = FindPolyData(mbds);
        if (polydata)
        {
          return polydata;
        }
      }
    }
  }
  return nullptr;
}

int main(int argc, char* argv[]) {
  if (argc < 3) {
    std::cerr << "Usage: " << argv[0] << " <inputFile> <outputPolyDataFile> "
              << std::endl;
    return EXIT_FAILURE;
  }
  const char* inputFile = argv[1];
  const char* outputPolyDataFile = argv[2];

  vtkNew<vtkGeometryFilter> geometryFilter;
  vtkNew<vtkAppendCompositeDataLeaves> appendFilter;

  vtkNew<vtkJSONDataSetWriter> writer;
  writer->SetFileName(outputPolyDataFile);

  bool canReadFile = false;

  auto reader = vtkSmartPointer<vtkExodusIIReader>::New();
  if (reader->CanReadFile(inputFile)) {
    canReadFile = true;
    reader->SetFileName(inputFile);
    // Request all point and cell arrays
    reader->SetAllArrayStatus(vtkExodusIIReader::NODAL, 1);
    reader->SetAllArrayStatus(vtkExodusIIReader::ELEM_BLOCK, 1);
    geometryFilter->SetInputConnection(reader->GetOutputPort());
    appendFilter->SetInputConnection(geometryFilter->GetOutputPort());
    appendFilter->Update();
    auto output = vtkMultiBlockDataSet::SafeDownCast(appendFilter->GetOutputDataObject(0));
    auto polydata = FindPolyData(output);
    if (!polydata)
    {
      std::cerr << "Read file but could not produce polydata." << std::endl;
      canReadFile = false;
    }
    writer->SetInputDataObject(0, polydata);
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
