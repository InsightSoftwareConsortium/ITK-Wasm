/*=========================================================================
 *
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
#ifndef resampleReadInputTransform_h
#define resampleReadInputTransform_h

// Read a spatial transform input -- a single transform, a transform chain, or a composite transform --
// into the abstract itk::Transform<double, Dim, Dim> base.
//
// itk::ResampleImageFilter::SetTransform() takes the abstract base, so the resample pipeline can apply any
// transform parameterization (translation, rigid, affine, B-spline, ...) polymorphically. itk::wasm::
// InputTransform<T> cannot read a generic transform: it hard-codes a concrete T (e.g. AffineTransform) and, on
// the in-memory path, copies the JSON's parameter array into that T after checking only precision and
// dimension -- never the parameterization. So a non-affine transform is silently mis-parameterized, and a
// transform with more parameters than the affine (e.g. a B-spline) overruns the fixed-size affine parameter
// buffer. We instead reconstruct each concrete transform ourselves -- via the ITK object factory, exactly as
// itkWasmTransformToTransformFilter does for composite components -- and return it upcast to the base.
//
// Multi-transform lists are composed into an itk::CompositeTransform. Following itkwasm's TransformList
// serialization convention, a Composite entry is a marker that carries no parameters of its own (the
// components follow it in the list), so Composite entries are skipped and every non-composite entry becomes a
// component. Composition follows itk::CompositeTransform semantics: components are added in list order
// [T0, T1, ..., TN-1] and the point is mapped by the queue in reverse, T0(T1(...TN-1(x))) -- i.e. the LAST
// list entry is applied to the point first, matching function-composition notation [A, B] == A o B and
// exactly matching what itkWasmTransformToTransformFilter produces for the same composite JSON.
//
// Two transport paths:
//   * --memory-io (TypeScript / Python bindings): the transform arrives in the wasm memory store; the CLI
//     argument is its store index. We deserialize the TransformListJSON, build each concrete transform by
//     name, and copy the parameter arrays (whose addresses the JSON encodes) out of the store.
//   * filesystem (native / WASI CTest): the argument is a real .iwt/.h5 path read with the transform reader.
//     For a file holding a composite transform, ITK's reader returns the fully-populated CompositeTransform
//     as the list front (its components repeat behind it), so the front is used directly; a multi-transform
//     file without a composite wrapper is composed in list order as above.
//
// The math is always performed at double precision. This is lossless for float32 and float64 inputs and keeps
// the filesystem path robust to itk-wasm's .iwt scalar-type detection, which can misreport a float64 transform
// as float32 (reading such a transform at single precision silently drops parameters).

#include <cstdlib>
#include <stdexcept>
#include <string>
#include <vector>

#include "itkCompositeTransform.h"
#include "itkPipeline.h"
#include "itkTransform.h"
#include "itkTransformFileReader.h"

#ifndef ITK_WASM_NO_MEMORY_IO
#  include "itkWasmExports.h"
#  include "itkTransformJSON.h"
#  include "itktransformParameterizationString.h"
#  include "itkTransformFactoryBase.h"
#  include "itkObjectFactoryBase.h"

#  include "glaze/glaze.hpp"
#endif

namespace
{

// Peek the input transform's dimension without fully reconstructing it, so the pipeline can dispatch to a
// dimension-specialized functor. Reads from the wasm memory store under --memory-io, or the filesystem otherwise.
// (Used by resample-bounding-box, which dispatches on the transform dimension; resample-to-reference dispatches
// on the image and does not need it.)
inline unsigned int
readInputTransformDimension(const std::string & transformArg)
{
  if (transformArg.empty())
  {
    throw std::runtime_error("The input transform argument is empty.");
  }

  if (itk::wasm::Pipeline::get_use_memory_io())
  {
#ifndef ITK_WASM_NO_MEMORY_IO
    const unsigned int  index = static_cast<unsigned int>(std::stoi(transformArg));
    const std::string & json = itk::wasm::getMemoryStoreInputJSON(0, index);
    auto                deserialized = glz::read_json<itk::TransformListJSON>(json);
    if (!deserialized)
    {
      throw std::runtime_error("Failed to parse the input transform JSON: " + glz::format_error(deserialized, json));
    }
    const itk::TransformListJSON transformListJSON = deserialized.value();
    if (transformListJSON.empty())
    {
      throw std::runtime_error("The input transform list is empty.");
    }
    return transformListJSON.front().transformType.inputDimension;
#else
    throw std::runtime_error("Memory IO support was not compiled into this pipeline.");
#endif
  }

  using ReaderType = itk::TransformFileReaderTemplate<double>;
  auto reader = ReaderType::New();
  reader->SetFileName(transformArg);
  reader->Update();
  const auto transformList = reader->GetTransformList();
  if (transformList == nullptr || transformList->empty())
  {
    throw std::runtime_error("No transform found in the input transform file.");
  }
  return transformList->front()->GetInputSpaceDimension();
}

#ifndef ITK_WASM_NO_MEMORY_IO
// Reconstruct one non-composite TransformListJSON entry into a concrete, double-precision transform, returned
// upcast to the abstract itk::Transform base. The concrete type is built by name via the ITK object factory;
// the parameter arrays are copied out of the wasm memory store at the addresses the JSON encodes, sized to the
// entry's own parameter counts.
template <unsigned int VDimension>
typename itk::Transform<double, VDimension, VDimension>::Pointer
reconstructTransformEntry(const itk::TransformJSON & transformJSON)
{
  using TransformType = itk::Transform<double, VDimension, VDimension>;

  if (transformJSON.transformType.inputDimension != VDimension ||
      transformJSON.transformType.outputDimension != VDimension)
  {
    throw std::runtime_error("The input transform dimension does not match the pipeline dimension.");
  }

  // Construct the concrete, double-precision transform by name via the ITK object factory. The factory is
  // populated as a side effect of GetFactory(). We always build the double variant so the math stays at
  // double precision regardless of the input's stored precision.
  const std::string typeString = itk::transformParameterizationString(transformJSON.transformType) +
                                 "Transform_double_" + std::to_string(VDimension) + "_" + std::to_string(VDimension);
  itk::TransformFactoryBase::GetFactory();
  itk::LightObject::Pointer       instance = itk::ObjectFactoryBase::CreateInstance(typeString.c_str());
  typename TransformType::Pointer transform = dynamic_cast<TransformType *>(instance.GetPointer());
  if (transform.IsNull())
  {
    throw std::runtime_error("Could not construct the input transform type: " + typeString);
  }
  instance->UnRegister(); // correct the extra reference from CreateInstance()

  // The JSON encodes the parameter arrays as wasm memory addresses: "data:application/vnd.itk.address,0:<ptr>".
  constexpr std::string::size_type addressPrefixLength = 35;

  // Fixed parameters are stored at double precision (itk::Transform::FixedParametersValueType is double).
  if (transformJSON.numberOfFixedParameters > 0)
  {
    const double * fixedParametersPtr = reinterpret_cast<const double *>(
      std::strtoull(transformJSON.fixedParameters.substr(addressPrefixLength).c_str(), nullptr, 10));
    transform->CopyInFixedParameters(fixedParametersPtr, fixedParametersPtr + transformJSON.numberOfFixedParameters);
  }

  // Parameters are stored at the transform's own precision; cast into a double buffer so the double-precision
  // transform receives them losslessly whether the source is float32 or float64.
  const std::size_t numberOfParameters = static_cast<std::size_t>(transformJSON.numberOfParameters);
  if (numberOfParameters > 0)
  {
    std::vector<double> parameters(numberOfParameters);
    const std::string   parametersAddress = transformJSON.parameters.substr(addressPrefixLength);
    if (transformJSON.transformType.parametersValueType == itk::JSONFloatTypesEnum::float32)
    {
      const float * source = reinterpret_cast<const float *>(std::strtoull(parametersAddress.c_str(), nullptr, 10));
      for (std::size_t ii = 0; ii < numberOfParameters; ++ii)
      {
        parameters[ii] = static_cast<double>(source[ii]);
      }
    }
    else
    {
      const double * source = reinterpret_cast<const double *>(std::strtoull(parametersAddress.c_str(), nullptr, 10));
      for (std::size_t ii = 0; ii < numberOfParameters; ++ii)
      {
        parameters[ii] = source[ii];
      }
    }
    transform->CopyInParameters(parameters.data(), parameters.data() + numberOfParameters);
  }

  return transform;
}
#endif // !ITK_WASM_NO_MEMORY_IO

template <unsigned int VDimension>
typename itk::Transform<double, VDimension, VDimension>::ConstPointer
readInputTransform(const std::string & transformArg)
{
  using TransformType = itk::Transform<double, VDimension, VDimension>;
  using CompositeTransformType = itk::CompositeTransform<double, VDimension>;

  if (transformArg.empty())
  {
    throw std::runtime_error("The input transform argument is empty.");
  }

  if (itk::wasm::Pipeline::get_use_memory_io())
  {
#ifndef ITK_WASM_NO_MEMORY_IO
    // The transform is in the wasm memory store; the argument is its index.
    const unsigned int  index = static_cast<unsigned int>(std::stoi(transformArg));
    const std::string & json = itk::wasm::getMemoryStoreInputJSON(0, index);

    auto deserialized = glz::read_json<itk::TransformListJSON>(json);
    if (!deserialized)
    {
      throw std::runtime_error("Failed to parse the input transform JSON: " + glz::format_error(deserialized, json));
    }
    const itk::TransformListJSON transformListJSON = deserialized.value();
    if (transformListJSON.empty())
    {
      throw std::runtime_error("The input transform list is empty.");
    }

    // Composite entries are markers with no parameters of their own -- their components follow in the list --
    // so skip them and reconstruct every non-composite entry as a component (mirroring
    // itkWasmTransformToTransformFilter).
    std::vector<typename TransformType::Pointer> components;
    for (const auto & transformJSON : transformListJSON)
    {
      if (transformJSON.transformType.transformParameterization == itk::JSONTransformParameterizationEnum::Composite)
      {
        continue;
      }
      components.push_back(reconstructTransformEntry<VDimension>(transformJSON));
    }
    if (components.empty())
    {
      throw std::runtime_error("The composite transform list contains no component transforms.");
    }
    if (components.size() == 1)
    {
      return components.front().GetPointer();
    }

    // Compose in list order; itk::CompositeTransform applies the queue in reverse, so the mapping is
    // T0(T1(...TN-1(x))).
    auto compositeTransform = CompositeTransformType::New();
    for (const auto & component : components)
    {
      compositeTransform->AddTransform(component);
    }
    return compositeTransform.GetPointer();
#else
    throw std::runtime_error("Memory IO support was not compiled into this pipeline.");
#endif
  }

  // Filesystem path: read any parameterization generically into the base, at double precision.
  using ReaderType = itk::TransformFileReaderTemplate<double>;
  auto reader = ReaderType::New();
  reader->SetFileName(transformArg);
  reader->Update();
  const auto transformList = reader->GetTransformList();
  if (transformList == nullptr || transformList->empty())
  {
    throw std::runtime_error("No transform found in the input transform file.");
  }

  // A file holding a composite transform is returned by ITK's reader as the fully-populated
  // CompositeTransform at the list front, with its components repeated behind it -- use the front directly.
  const auto * frontComposite = dynamic_cast<const CompositeTransformType *>(transformList->front().GetPointer());
  if (frontComposite != nullptr)
  {
    return frontComposite;
  }

  if (transformList->size() == 1)
  {
    typename TransformType::ConstPointer transform =
      dynamic_cast<const TransformType *>(transformList->front().GetPointer());
    if (transform.IsNull())
    {
      throw std::runtime_error("The input transform dimension or scalar type is not supported.");
    }
    return transform;
  }

  // Multiple independent transforms without a composite wrapper: compose them in list order, matching the
  // in-memory chain semantics above.
  auto compositeTransform = CompositeTransformType::New();
  for (const auto & entry : *transformList)
  {
    auto * component = dynamic_cast<TransformType *>(entry.GetPointer());
    if (component == nullptr)
    {
      throw std::runtime_error("The input transform dimension or scalar type is not supported.");
    }
    compositeTransform->AddTransform(component);
  }
  return compositeTransform.GetPointer();
}

} // namespace

#endif // resampleReadInputTransform_h
