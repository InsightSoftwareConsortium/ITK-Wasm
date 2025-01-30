/*=========================================================================

 *  Copyright NumFOCUS
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         https://www.apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *=========================================================================*/

#include "itkPipeline.h"
#include "itkInputMesh.h"
#include "itkOutputMesh.h"
#include "itkOutputTextStream.h"
#include "itkSupportInputMeshTypes.h"

#include "itksys/SystemTools.hxx"

#include "rapidjson/document.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"

#include <tuple>

template <typename TMesh, typename TDifference>
std::tuple<bool, uint64_t, double, double, double>
comparePoints(
    const typename TMesh::PointsContainer *points0,
    const typename TMesh::PointsContainer *points1,
    const double pointsDifferenceThreshold,
    TDifference *pointsDifference)
{
  using MeshType = TMesh;
  using PointsContainerConstIterator = typename MeshType::PointsContainerConstIterator;

  bool sameNumberOfPoints = false;
  uint64_t numberOfPointsWithDifferences = 0;
  double pointsMinimumDifference = itk::NumericTraits<double>::max();
  double pointsMaximumDifference = 0.0;
  double pointsMeanDifference = 0.0;

  if (points0 != nullptr && points1 != nullptr)
  {
    if (points0->Size() == points1->Size())
    {
      sameNumberOfPoints = true;
      pointsDifference->resize(points0->Size());

      PointsContainerConstIterator pt0 = points0->Begin();
      PointsContainerConstIterator pt1 = points1->Begin();

      while ((pt0 != points0->End()) && (pt1 != points1->End()))
      {
        const auto difference = pt0.Value().SquaredEuclideanDistanceTo(pt1.Value());
        pointsMinimumDifference = std::min(pointsMinimumDifference, difference);
        pointsMaximumDifference = std::max(pointsMaximumDifference, difference);
        pointsMeanDifference += difference;
        pointsDifference->SetElement(pt0.Index(), difference);
        if (difference > pointsDifferenceThreshold)
        {
          ++numberOfPointsWithDifferences;
        }
        ++pt0;
        ++pt1;
      }

      pointsMeanDifference /= points0->Size();
    }
  }
  else
  {
    if (points0 == points1)
    {
      sameNumberOfPoints = true;
      pointsMinimumDifference = 0.0;
    }
  }

  if (pointsMinimumDifference == itk::NumericTraits<double>::max())
  {
    pointsMinimumDifference = 0.0;
  }

  return {sameNumberOfPoints, numberOfPointsWithDifferences, pointsMinimumDifference, pointsMaximumDifference, pointsMeanDifference};
}

template <typename TMesh, typename TDifference>
std::tuple<uint64_t, double, double, double>
comparePointData(
    const typename TMesh::PointDataContainer *pointData0,
    const typename TMesh::PointDataContainer *pointData1,
    const double pointDataDifferenceThreshold,
    TDifference *pointDataDifference)
{
  using MeshType = TMesh;
  using PointDataContainerConstIterator = typename MeshType::PointDataContainer::ConstIterator;

  uint64_t numberOfPointDataWithDifferences = 0;
  double pointDataMinimumDifference = itk::NumericTraits<double>::max();
  double pointDataMaximumDifference = 0.0;
  double pointDataMeanDifference = 0.0;

  if (pointData0 != nullptr && pointData1 != nullptr)
  {
    if (pointData0->Size() == pointData1->Size())
    {
      pointDataDifference->resize(pointData0->Size());

      PointDataContainerConstIterator pt0 = pointData0->Begin();
      PointDataContainerConstIterator pt1 = pointData1->Begin();

      while ((pt0 != pointData0->End()) && (pt1 != pointData1->End()))
      {
        const auto difference = std::abs(static_cast<double>(pt0.Value()) - static_cast<double>(pt1.Value()));
        pointDataMinimumDifference = std::min(pointDataMinimumDifference, difference);
        pointDataMaximumDifference = std::max(pointDataMaximumDifference, difference);
        pointDataMeanDifference += difference;
        pointDataDifference->SetElement(pt0.Index(), difference);
        if (difference > pointDataDifferenceThreshold)
        {
          ++numberOfPointDataWithDifferences;
        }
        ++pt0;
        ++pt1;
      }

      pointDataMeanDifference /= pointData0->Size();
    }
  }
  else
  {
    if (pointData0 == pointData1)
    {
      pointDataMinimumDifference = 0.0;
    }
  }

  if (pointDataMinimumDifference == itk::NumericTraits<double>::max())
  {
    pointDataMinimumDifference = 0.0;
  }

  return {numberOfPointDataWithDifferences, pointDataMinimumDifference, pointDataMaximumDifference, pointDataMeanDifference};
}

template <typename TMesh>
std::tuple<bool, bool, uint64_t, bool, uint64_t>
compareCellsContainer(const typename TMesh::CellsContainer *cells0, const typename TMesh::CellsContainer *cells1)
{
  using MeshType = TMesh;
  using CellsContainerConstIterator = typename MeshType::CellsContainerConstIterator;
  using CellPointIdIterator = typename MeshType::CellType::PointIdIterator;

  bool sameNumberOfCells = false;
  bool sameCellTypes = true;
  uint64_t numberOfDifferentCellsTypes = 0;
  bool sameCellPoints = true;
  uint64_t numberOfDifferentCellPoints = 0;

  if (cells0 != nullptr && cells1 != nullptr)
  {
    if (cells0->Size() == cells1->Size())
    {
      sameNumberOfCells = true;

      CellsContainerConstIterator ceIt0 = cells0->Begin();
      CellsContainerConstIterator ceIt1 = cells1->Begin();

      while ((ceIt0 != cells0->End()) && (ceIt1 != cells1->End()))
      {
        if (ceIt0.Value()->GetType() != ceIt1.Value()->GetType())
        {
          sameCellTypes = false;
          ++numberOfDifferentCellsTypes;
        }
        CellPointIdIterator pit0 = ceIt0.Value()->PointIdsBegin();
        CellPointIdIterator pit1 = ceIt1.Value()->PointIdsBegin();
        while (pit0 != ceIt0.Value()->PointIdsEnd())
        {
          if (*pit0 != *pit1)
          {
            sameCellPoints = false;
            ++numberOfDifferentCellPoints;
          }
          ++pit0;
          ++pit1;
        }
        ++ceIt0;
        ++ceIt1;
      }
    }
  }

  return {sameNumberOfCells, sameCellTypes, numberOfDifferentCellsTypes, sameCellPoints, numberOfDifferentCellPoints};
}

template <typename TMesh, typename TDifference>
std::tuple<uint64_t, double, double, double>
compareCellData(
    const typename TMesh::CellDataContainer *cellData0,
    const typename TMesh::CellDataContainer *cellData1,
    const double cellDataDifferenceThreshold,
    TDifference *cellDataDifference)
{
  using MeshType = TMesh;
  using CellDataContainerConstIterator = typename MeshType::CellDataContainer::ConstIterator;

  uint64_t numberOfCellDataWithDifferences = 0;
  double cellDataMinimumDifference = itk::NumericTraits<double>::max();
  double cellDataMaximumDifference = 0.0;
  double cellDataMeanDifference = 0.0;

  if (cellData0 != nullptr && cellData1 != nullptr)
  {
    if (cellData0->Size() == cellData1->Size())
    {
      cellDataDifference->resize(cellData0->Size());

      CellDataContainerConstIterator pt0 = cellData0->Begin();
      CellDataContainerConstIterator pt1 = cellData1->Begin();

      while ((pt0 != cellData0->End()) && (pt1 != cellData1->End()))
      {
        const auto difference = std::abs(static_cast<double>(pt0.Value()) - static_cast<double>(pt1.Value()));
        cellDataMinimumDifference = std::min(cellDataMinimumDifference, difference);
        cellDataMaximumDifference = std::max(cellDataMaximumDifference, difference);
        cellDataMeanDifference += difference;
        cellDataDifference->SetElement(pt0.Index(), difference);
        if (difference > cellDataDifferenceThreshold)
        {
          ++numberOfCellDataWithDifferences;
        }
        ++pt0;
        ++pt1;
      }

      cellDataMeanDifference /= cellData0->Size();
    }
  }
  else
  {
    if (cellData0 == cellData1)
    {
      cellDataMinimumDifference = 0.0;
    }
  }

  if (cellDataMinimumDifference == itk::NumericTraits<double>::max())
  {
    cellDataMinimumDifference = 0.0;
  }

  return {numberOfCellDataWithDifferences, cellDataMinimumDifference, cellDataMaximumDifference, cellDataMeanDifference};
}

template <typename TMesh>
int compareMeshes(itk::wasm::Pipeline &pipeline, const TMesh *testMesh)
{
  using MeshType = TMesh;
  constexpr unsigned int Dimension = MeshType::PointDimension;
  using PixelType = typename MeshType::PixelType;

  pipeline.get_option("test-mesh")->required()->type_name("INPUT_MESH");

  std::vector<itk::wasm::InputMesh<MeshType>> baselineMeshes;
  pipeline.add_option("--baseline-meshes", baselineMeshes, "Baseline images to compare against")->required()->type_size(1, -1)->type_name("INPUT_MESH");

  double pointsDifferenceThreshold = 1e-8;
  pipeline.add_option("--points-difference-threshold", pointsDifferenceThreshold, "Difference for point components to be considered different.");

  uint64_t numberOfDifferentPointsTolerance = 0;
  pipeline.add_option("--number-of-different-points-tolerance", numberOfDifferentPointsTolerance, "Number of points whose points exceed the difference threshold that can be different before the test fails.");

  double pointDataDifferenceThreshold = 1e-8;
  pipeline.add_option("--point-data-difference-threshold", pointDataDifferenceThreshold, "Difference for point data components to be considered different. ");

  uint64_t numberOfPointDataTolerance = 0;
  pipeline.add_option("--number-of-point-data-tolerance", numberOfPointDataTolerance, "Number of point data that can exceed the difference threshold before the test fails.");

  double cellDataDifferenceThreshold = 1e-8;
  pipeline.add_option("--cell-data-difference-threshold", cellDataDifferenceThreshold, "Difference for cell data components to be considered different.");

  uint64_t numberOfCellDataTolerance = 0;
  pipeline.add_option("--number-of-cell-data-tolerance", numberOfCellDataTolerance, "Number of cell data that can exceed the difference threshold before the test fails.");

  itk::wasm::OutputTextStream metrics;
  pipeline.add_option("metrics", metrics, "Metrics for the closest baseline.")->required()->type_name("OUTPUT_JSON");

  using DifferenceType = double;
  using DifferenceMeshType = itk::Mesh<DifferenceType, Dimension>;
  using DifferenceMeshPointer = typename DifferenceMeshType::Pointer;

  itk::wasm::OutputMesh<DifferenceMeshType> pointsDifferenceMesh;
  pipeline.add_option("points-difference-mesh", pointsDifferenceMesh, "Mesh with the differences between the points of the test mesh and the closest baseline.")->type_name("OUTPUT_MESH");

  itk::wasm::OutputMesh<DifferenceMeshType> pointDataDifferenceMesh;
  pipeline.add_option("point-data-difference-mesh", pointDataDifferenceMesh, "Mesh with the differences between the point data of the test mesh and the closest baseline.")->type_name("OUTPUT_MESH");

  itk::wasm::OutputMesh<DifferenceMeshType> cellDataDifferenceMesh;
  pipeline.add_option("cell-data-difference-mesh", cellDataDifferenceMesh, "Mesh with the differences between the cell data of the test mesh and the closest baseline.")->type_name("OUTPUT_MESH");

  ITK_WASM_PARSE(pipeline);

  bool sameNumberOfPoints = false;
  uint64_t numberOfPointsWithDifferences = itk::NumericTraits<uint64_t>::max();
  double pointsMinimumDifference = 0.0;
  double pointsMaximumDifference = 0.0;
  double pointsMeanDifference = 0.0;

  uint64_t numberOfPointDataWithDifferences = itk::NumericTraits<uint64_t>::max();
  double pointDataMinimumDifference = 0.0;
  double pointDataMaximumDifference = 0.0;
  double pointDataMeanDifference = 0.0;

  bool sameNumberOfCells = false;
  bool sameCellTypes = false;
  uint64_t numberOfDifferentCellsTypes = itk::NumericTraits<uint64_t>::max();
  bool sameCellPoints = false;
  uint64_t numberOfDifferentCellPoints = itk::NumericTraits<uint64_t>::max();

  uint64_t numberOfCellDataWithDifferences = itk::NumericTraits<uint64_t>::max();
  double cellDataMinimumDifference = 0.0;
  double cellDataMaximumDifference = 0.0;
  double cellDataMeanDifference = 0.0;

  typename DifferenceMeshType::PointDataContainerPointer pointsDifference = DifferenceMeshType::PointDataContainer::New();
  DifferenceMeshPointer pointsDifferenceMeshPointer = DifferenceMeshType::New();
  pointsDifferenceMeshPointer->SetPoints(const_cast<typename DifferenceMeshType::PointsContainer *>(const_cast<MeshType *>(testMesh)->GetPoints()));
  pointsDifferenceMeshPointer->SetCellsArray(const_cast<MeshType *>(testMesh)->GetCellsArray());

  typename DifferenceMeshType::PointDataContainerPointer pointDataDifference = DifferenceMeshType::PointDataContainer::New();
  DifferenceMeshPointer pointDataDifferenceMeshPointer = DifferenceMeshType::New();
  pointDataDifferenceMeshPointer->SetPoints(const_cast<typename DifferenceMeshType::PointsContainer *>(const_cast<MeshType *>(testMesh)->GetPoints()));
  pointDataDifferenceMeshPointer->SetCellsArray(const_cast<MeshType *>(testMesh)->GetCellsArray());

  typename DifferenceMeshType::PointDataContainerPointer cellDataDifference = DifferenceMeshType::PointDataContainer::New();
  DifferenceMeshPointer cellDataDifferenceMeshPointer = DifferenceMeshType::New();
  cellDataDifferenceMeshPointer->SetPoints(const_cast<typename DifferenceMeshType::PointsContainer *>(const_cast<MeshType *>(testMesh)->GetPoints()));
  cellDataDifferenceMeshPointer->SetCellsArray(const_cast<MeshType *>(testMesh)->GetCellsArray());

  for (unsigned int baselineIndex = 0; baselineIndex < baselineMeshes.size(); ++baselineIndex)
  {
    typename DifferenceMeshType::PointDataContainerPointer baselinePointsDifference = DifferenceMeshType::PointDataContainer::New();
    const auto [baselineSameNumberOfPoints,
                baselineNumberOfPointsWithDifferences,
                baselinePointsMinimumDifference,
                baselinePointsMaximumDifference,
                baselinePointsMeanDifference] = comparePoints<MeshType, typename DifferenceMeshType::PointDataContainer>(testMesh->GetPoints(),
                                                                                                                         baselineMeshes[baselineIndex].Get()->GetPoints(),
                                                                                                                         pointsDifferenceThreshold,
                                                                                                                         baselinePointsDifference);
    if (baselineSameNumberOfPoints && baselineNumberOfPointsWithDifferences <= numberOfPointsWithDifferences)
    {
      sameNumberOfPoints = baselineSameNumberOfPoints;
      numberOfPointsWithDifferences = baselineNumberOfPointsWithDifferences;
      pointsMinimumDifference = baselinePointsMinimumDifference;
      pointsMaximumDifference = baselinePointsMaximumDifference;
      pointsMeanDifference = baselinePointsMeanDifference;
      pointsDifference = baselinePointsDifference;
      pointsDifferenceMeshPointer->SetPointData(pointsDifference);

      typename DifferenceMeshType::PointDataContainerPointer baselinePointDataDifference = DifferenceMeshType::PointDataContainer::New();
      const auto [baselineNumberOfPointDataWithDifferences,
                  baselinePointDataMinimumDifference,
                  baselinePointDataMaximumDifference,
                  baselinePointDataMeanDifference] = comparePointData<MeshType, typename DifferenceMeshType::PointDataContainer>(testMesh->GetPointData(),
                                                                                                                                 baselineMeshes[baselineIndex].Get()->GetPointData(),
                                                                                                                                 pointDataDifferenceThreshold,
                                                                                                                                 baselinePointDataDifference);
      if (baselineNumberOfPointDataWithDifferences <= numberOfPointDataWithDifferences)
      {
        numberOfPointDataWithDifferences = baselineNumberOfPointDataWithDifferences;
        pointDataMinimumDifference = baselinePointDataMinimumDifference;
        pointDataMaximumDifference = baselinePointDataMaximumDifference;
        pointDataMeanDifference = baselinePointDataMeanDifference;
        pointDataDifference = baselinePointDataDifference;
        pointDataDifferenceMeshPointer->SetPointData(pointDataDifference);
      }

      const auto [baselineSameNumberOfCells,
                  baselineSameCellTypes,
                  baselineNumberOfDifferentCellsTypes,
                  baselineSameCellPoints,
                  baselineNumberOfDifferentCellPoints] = compareCellsContainer<MeshType>(testMesh->GetCells(),
                                                                                         baselineMeshes[baselineIndex].Get()->GetCells());
      if (baselineSameNumberOfCells)
      {
        if (baselineSameCellTypes)
        {
          sameCellTypes = baselineSameCellTypes;
        }
        if (baselineNumberOfDifferentCellsTypes <= numberOfDifferentCellsTypes)
        {
          numberOfDifferentCellsTypes = baselineNumberOfDifferentCellsTypes;
        }
        if (baselineSameCellPoints)
        {
          sameCellPoints = baselineSameCellPoints;
        }
        if (baselineNumberOfDifferentCellPoints <= numberOfDifferentCellPoints)
        {
          numberOfDifferentCellPoints = baselineNumberOfDifferentCellPoints;
        }

        typename DifferenceMeshType::PointDataContainerPointer baselineCellDataDifference = DifferenceMeshType::CellDataContainer::New();
        const auto [baselineNumberOfCellDataWithDifferences,
                    baselineCellDataMinimumDifference,
                    baselineCellDataMaximumDifference,
                    baselineCellDataMeanDifference] = compareCellData<MeshType, typename DifferenceMeshType::CellDataContainer>(testMesh->GetCellData(),
                                                                                                                                baselineMeshes[baselineIndex].Get()->GetCellData(),
                                                                                                                                cellDataDifferenceThreshold,
                                                                                                                                baselineCellDataDifference);
        if (baselineNumberOfCellDataWithDifferences <= numberOfCellDataWithDifferences)
        {
          numberOfCellDataWithDifferences = baselineNumberOfCellDataWithDifferences;
          cellDataMinimumDifference = baselineCellDataMinimumDifference;
          cellDataMaximumDifference = baselineCellDataMaximumDifference;
          cellDataMeanDifference = baselineCellDataMeanDifference;
          cellDataDifference = baselineCellDataDifference;
          cellDataDifferenceMeshPointer->SetPointData(cellDataDifference);
        }
      }
    }
    else
    {
      // Points are not the same, so we will not compare point data, cells, or cell data.
      continue;
    }
  }

  if (numberOfPointsWithDifferences == itk::NumericTraits<uint64_t>::max())
  {
    numberOfPointsWithDifferences = 0;
  }
  if (numberOfPointDataWithDifferences == itk::NumericTraits<uint64_t>::max())
  {
    numberOfPointDataWithDifferences = 0;
  }
  if (numberOfDifferentCellsTypes == itk::NumericTraits<uint64_t>::max())
  {
    numberOfDifferentCellsTypes = 0;
  }
  if (numberOfDifferentCellPoints == itk::NumericTraits<uint64_t>::max())
  {
    numberOfDifferentCellPoints = 0;
  }
  if (numberOfCellDataWithDifferences == itk::NumericTraits<uint64_t>::max())
  {
    numberOfCellDataWithDifferences = 0;
  }

  pointsDifferenceMesh.Set(pointsDifferenceMeshPointer);
  pointDataDifferenceMesh.Set(pointDataDifferenceMeshPointer);
  cellDataDifferenceMesh.Set(cellDataDifferenceMeshPointer);

  const bool almostEqual = sameNumberOfPoints && sameCellTypes && sameCellPoints && numberOfPointsWithDifferences <= numberOfDifferentPointsTolerance && numberOfPointDataWithDifferences <= numberOfPointDataTolerance && numberOfDifferentCellsTypes <= 0 && numberOfDifferentCellPoints <= 0 && numberOfCellDataWithDifferences <= numberOfCellDataTolerance;

  rapidjson::Document metricsJson;
  metricsJson.SetObject();
  rapidjson::Document::AllocatorType &allocator = metricsJson.GetAllocator();

  rapidjson::Value almostEqualValue;
  almostEqualValue.SetBool(almostEqual);
  metricsJson.AddMember("almostEqual", almostEqualValue, allocator);

  rapidjson::Value pointObject(rapidjson::kObjectType);

  rapidjson::Value sameNumberOfPointsValue;
  sameNumberOfPointsValue.SetBool(sameNumberOfPoints);
  pointObject.AddMember("sameNumber", sameNumberOfPointsValue, allocator);

  rapidjson::Value numberOfPointsWithDifferencesValue;
  numberOfPointsWithDifferencesValue.SetUint64(numberOfPointsWithDifferences);
  pointObject.AddMember("numberWithDifferences", numberOfPointsWithDifferencesValue, allocator);

  rapidjson::Value pointsMinimumDifferenceValue;
  pointsMinimumDifferenceValue.SetDouble(pointsMinimumDifference);
  pointObject.AddMember("minimumDifference", pointsMinimumDifferenceValue, allocator);

  rapidjson::Value pointsMaximumDifferenceValue;
  pointsMaximumDifferenceValue.SetDouble(pointsMaximumDifference);
  pointObject.AddMember("maximumDifference", pointsMaximumDifferenceValue, allocator);

  rapidjson::Value pointsMeanDifferenceValue;
  pointsMeanDifferenceValue.SetDouble(pointsMeanDifference);
  pointObject.AddMember("meanDifference", pointsMeanDifferenceValue, allocator);

  metricsJson.AddMember("points", pointObject.Move(), allocator);

  rapidjson::Value cellsObject(rapidjson::kObjectType);

  rapidjson::Value sameCellTypesValue;
  sameCellTypesValue.SetBool(sameCellTypes);
  cellsObject.AddMember("sameTypes", sameCellTypesValue, allocator);

  rapidjson::Value numberOfDifferentCellsTypesValue;
  numberOfDifferentCellsTypesValue.SetUint64(numberOfDifferentCellsTypes);
  cellsObject.AddMember("numberOfDifferentTypes", numberOfDifferentCellsTypesValue, allocator);

  rapidjson::Value sameCellPointsValue;
  sameCellPointsValue.SetBool(sameCellPoints);
  cellsObject.AddMember("samePoints", sameCellPointsValue, allocator);

  rapidjson::Value numberOfDifferentCellPointsValue;
  numberOfDifferentCellPointsValue.SetUint64(numberOfDifferentCellPoints);
  cellsObject.AddMember("numberOfDifferentPoints", numberOfDifferentCellPointsValue, allocator);

  metricsJson.AddMember("cells", cellsObject.Move(), allocator);

  rapidjson::Value pointDataObject(rapidjson::kObjectType);

  rapidjson::Value numberOfPointDataWithDifferencesValue;
  numberOfPointDataWithDifferencesValue.SetUint64(numberOfPointDataWithDifferences);
  pointDataObject.AddMember("numberWithDifferences", numberOfPointDataWithDifferencesValue, allocator);

  rapidjson::Value pointDataMinimumDifferenceValue;
  pointDataMinimumDifferenceValue.SetDouble(pointDataMinimumDifference);
  pointDataObject.AddMember("minimumDifference", pointDataMinimumDifferenceValue, allocator);

  rapidjson::Value pointDataMaximumDifferenceValue;
  pointDataMaximumDifferenceValue.SetDouble(pointDataMaximumDifference);
  pointDataObject.AddMember("maximumDifference", pointDataMaximumDifferenceValue, allocator);

  // rapidjson::Value pointDataMeanDifferenceValue;
  // pointDataMeanDifferenceValue.SetFloat(pointDataMeanDifference);
  // pointDataObject.AddMember("meanDifference", pointDataMeanDifferenceValue, allocator);

  metricsJson.AddMember("pointData", pointDataObject.Move(), allocator);

  rapidjson::Value cellDataObject(rapidjson::kObjectType);

  rapidjson::Value numberOfCellDataWithDifferencesValue;
  numberOfCellDataWithDifferencesValue.SetUint64(numberOfCellDataWithDifferences);
  cellDataObject.AddMember("numberWithDifferences", numberOfCellDataWithDifferencesValue, allocator);

  rapidjson::Value cellDataMinimumDifferenceValue;
  cellDataMinimumDifferenceValue.SetDouble(cellDataMinimumDifference);
  cellDataObject.AddMember("minimumDifference", cellDataMinimumDifferenceValue, allocator);

  rapidjson::Value cellDataMaximumDifferenceValue;
  cellDataMaximumDifferenceValue.SetDouble(cellDataMaximumDifference);
  cellDataObject.AddMember("maximumDifference", cellDataMaximumDifferenceValue, allocator);

  // Buggy in WASI?
  // rapidjson::Value cellDataMeanDifferenceValue;
  // cellDataMeanDifferenceValue.SetDouble(cellDataMeanDifference);
  // cellDataObject.AddMember("meanDifference", cellDataMeanDifferenceValue, allocator);

  metricsJson.AddMember("cellData", cellDataObject.Move(), allocator);

  rapidjson::StringBuffer stringBuffer;
  stringBuffer.Reserve(1024); // Reserve 1kB for the JSON string (default is 256B
  rapidjson::Writer<rapidjson::StringBuffer> writer(stringBuffer);
  metricsJson.Accept(writer);

  metrics.Get() << std::string(stringBuffer.GetString(), stringBuffer.GetLength());

  return EXIT_SUCCESS;
}

template <typename TMesh>
class PipelineFunctor
{
public:
  int operator()(itk::wasm::Pipeline &pipeline)
  {
    using MeshType = TMesh;

    itk::wasm::InputMesh<MeshType> testMesh;
    pipeline.add_option("test-mesh", testMesh, "The input test mesh")->type_name("INPUT_MESH");

    ITK_WASM_PRE_PARSE(pipeline);

    typename MeshType::ConstPointer testMeshRef = testMesh.Get();
    return compareMeshes<MeshType>(pipeline, testMeshRef);
  }
};

int main(int argc, char *argv[])
{
  itk::wasm::Pipeline pipeline("compare-meshes", "Compare meshes with a tolerance for regression testing.", argc, argv);

  return itk::wasm::SupportInputMeshTypes<PipelineFunctor,
                                          uint8_t,
                                          int8_t,
                                          uint16_t,
                                          int16_t,
                                          uint32_t,
                                          int32_t,
                                          float,
                                          double>::Dimensions<
      // 2U,
      3U>("test-mesh", pipeline);
}
