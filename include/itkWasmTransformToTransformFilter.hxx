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
#ifndef itkWasmTransformToTransformFilter_hxx
#define itkWasmTransformToTransformFilter_hxx

#include "itkTransformFactoryBase.h"

#include "itktransformParameterizationString.h"
#include <exception>
#include "itkWasmMapComponentType.h"
#include "itkWasmMapPixelType.h"

namespace itk
{

template <typename TTransform>
WasmTransformToTransformFilter<TTransform>
::WasmTransformToTransformFilter()
{
  this->SetNumberOfRequiredInputs(1);

  typename DecoratorType::Pointer output = static_cast<DecoratorType *>(this->MakeOutput(0).GetPointer());
  this->ProcessObject::SetNumberOfRequiredOutputs(1);
  this->ProcessObject::SetNthOutput(0, output.GetPointer());
}

template <typename TTransform>
ProcessObject::DataObjectPointer
WasmTransformToTransformFilter<TTransform>
::MakeOutput(ProcessObject::DataObjectPointerArraySizeType)
{
  typename DecoratorType::Pointer decorator = DecoratorType::New();
  this->m_OutputTransform = TransformType::New();
  decorator->Set(m_OutputTransform);
  return decorator.GetPointer();
}

template <typename TTransform>
ProcessObject::DataObjectPointer
WasmTransformToTransformFilter<TTransform>
::MakeOutput(const ProcessObject::DataObjectIdentifierType &)
{
  typename DecoratorType::Pointer decorator = DecoratorType::New();
  this->m_OutputTransform = TransformType::New();
  decorator->Set(m_OutputTransform);
  return decorator.GetPointer();
}

template <typename TTransform>
auto
WasmTransformToTransformFilter<TTransform>
::GetOutput() -> TransformType *
{
  return this->m_OutputTransform;
}

template <typename TTransform>
auto
WasmTransformToTransformFilter<TTransform>
::GetOutput() const -> const TransformType *
{
  return const_cast<const TransformType *>(this->m_OutputTransform);
}

template <typename TTransform>
auto
WasmTransformToTransformFilter<TTransform>
::GetOutput(unsigned int idx) -> TransformType *
{
  auto * out = dynamic_cast<DecoratorType *>(this->ProcessObject::GetOutput(idx));

  if (out == nullptr && this->ProcessObject::GetOutput(idx) != nullptr)
  {
    itkWarningMacro(<< "Unable to convert output number " << idx << " to type " << typeid(DecoratorType).name());
  }
  return out->Get();
}

template <typename TTransform>
void
WasmTransformToTransformFilter<TTransform>
::SetInput(const WasmTransformType * input)
{
  // Process object is not const-correct so the const_cast is required here
  this->ProcessObject::SetNthInput(0, const_cast<WasmTransformType *>(input));
}

template <typename TTransform>
void
WasmTransformToTransformFilter<TTransform>
::SetInput(unsigned int index, const WasmTransformType * transform)
{
  // Process object is not const-correct so the const_cast is required here
  this->ProcessObject::SetNthInput(index, const_cast<WasmTransformType *>(transform));
}

template <typename TTransform>
const typename WasmTransformToTransformFilter<TTransform>::WasmTransformType *
WasmTransformToTransformFilter<TTransform>
::GetInput()
{
  return itkDynamicCastInDebugMode<const WasmTransformType *>(this->GetPrimaryInput());
}

template <typename TTransform>
const typename WasmTransformToTransformFilter<TTransform>::WasmTransformType *
WasmTransformToTransformFilter<TTransform>
::GetInput(unsigned int idx)
{
  return itkDynamicCastInDebugMode<const TTransform *>(this->ProcessObject::GetInput(idx));
}

template <typename TTransform>
void
WasmTransformToTransformFilter<TTransform>
::GenerateData()
{
  using ParametersValueType = typename TTransform::ParametersValueType;
  using FixedParametersValueType = typename TTransform::FixedParametersValueType;

  // Get the input and output pointers
  const WasmTransformType * wasmTransform = this->GetInput();
  auto deserializedAttempt = glz::read_json<TransformListJSON>(wasmTransform->GetJSON());
  if (!deserializedAttempt)
  {
    itkExceptionMacro("Failed to deserialize TransformListJSON");
  }
  auto transformListJSON = deserializedAttempt.value();
  if (transformListJSON.size() < 1)
  {
    itkExceptionMacro("Expected at least one transform in the list");
  }
  TransformType * transform = this->GetOutput();
  unsigned int count = 0;
  bool isComposite = false;
  for (const auto & transformJSON : transformListJSON)
  {
    transform->SetObjectName(transformJSON.name);
    transform->SetInputSpaceName(transformJSON.inputSpaceName);
    transform->SetOutputSpaceName(transformJSON.outputSpaceName);

    if (transformJSON.transformType.transformParameterization == JSONTransformParameterizationEnum::Composite)
    {
      isComposite = true;
      ++count;
      continue;
    }

    using ParametersValueType = typename TransformType::ParametersValueType;
    std::string transformPrecision;
    switch (transformJSON.transformType.parametersValueType)
    {
      case JSONFloatTypesEnum::float32:
      {
        transformPrecision = "float";
        if (sizeof(ParametersValueType) != 4)
        {
          itkExceptionMacro("ParametersValueType does not match JSON transformType");
        }
        break;
      }
      case JSONFloatTypesEnum::float64:
      {
        transformPrecision = "double";
        if (sizeof(ParametersValueType) != 8)
        {
          itkExceptionMacro("ParametersValueType does not match JSON transformType");
        }
        break;
      }
      default:
      {
        itkExceptionMacro("Unknown parameters value type");
      }
    }
    const std::string transformParameterization = transformParameterizationString(transformJSON.transformType);
    if (transform->GetInputSpaceDimension() != transformJSON.transformType.inputDimension)
    {
      itkExceptionMacro("InputSpaceDimension does not match JSON transformType");
    }
    if (transform->GetOutputSpaceDimension() != transformJSON.transformType.outputDimension)
    {
      itkExceptionMacro("OutputSpaceDimension does not match JSON transformType");
    }
    // itk::Transform<TParametersValueType, VInputDimension, VOutputDimension>::GetTransformTypeAsString() returns the
    // transform type string Note: non-cubic B-Splines not supported
    std::string transformType = transformParameterization + "Transform_" + transformPrecision + "_" +
                                std::to_string(transformJSON.transformType.inputDimension) + "_" +
                                std::to_string(transformJSON.transformType.outputDimension);

    if (isComposite)
    {
      // call to GetFactory has side effect of initializing the
      // TransformFactory overrides
      using ComponentTransformType = Transform<ParametersValueType, TransformType::InputSpaceDimension, TransformType::OutputSpaceDimension>;
      typename ComponentTransformType::Pointer ptr;
      // TransformIOBaseTemplate::CreateTransform(ptr, transformType);
      TransformFactoryBase * theFactory = TransformFactoryBase::GetFactory();

      // Instantiate the transform
      itkDebugMacro("About to call ObjectFactory");
      LightObject::Pointer i = ObjectFactoryBase::CreateInstance(transformType.c_str());
      itkDebugMacro("After call ObjectFactory");
      ptr = dynamic_cast<ComponentTransformType *>(i.GetPointer());
      if (ptr.IsNull())
      {
        std::ostringstream msg;
        msg << "Could not create an instance of \"" << transformType << '"' << std::endl
            << "The usual cause of this error is not registering the "
            << "transform with TransformFactory" << std::endl;
        msg << "Currently registered Transforms: " << std::endl;
        std::list<std::string> names = theFactory->GetClassOverrideWithNames();
        for (auto & name : names)
        {
          msg << "\t\"" << name << '"' << std::endl;
        }
        itkExceptionMacro(<< msg.str());
      }
      // Correct extra reference count from CreateInstance()
      ptr->UnRegister();

      FixedParametersValueType * fixedPtr = reinterpret_cast< FixedParametersValueType * >( std::strtoull(transformJSON.fixedParameters.substr(35).c_str(), nullptr, 10) );
      ptr->CopyInFixedParameters(fixedPtr, fixedPtr + transformJSON.numberOfFixedParameters);
      ParametersValueType * paramsPtr = reinterpret_cast< ParametersValueType * >( std::strtoull(transformJSON.parameters.substr(35).c_str(), nullptr, 10) );
      ptr->CopyInParameters(paramsPtr, paramsPtr + transformJSON.numberOfParameters);

      using CompositeTransformType = CompositeTransform<ParametersValueType, TransformType::InputSpaceDimension>;
      CompositeTransformType * compositeTransform = dynamic_cast<CompositeTransformType *>(transform);
      compositeTransform->AddTransform(ptr);
    }
    else
    {
      FixedParametersValueType * fixedPtr = reinterpret_cast< FixedParametersValueType * >( std::strtoull(transformJSON.fixedParameters.substr(35).c_str(), nullptr, 10) );
      transform->CopyInFixedParameters(fixedPtr, fixedPtr + transformJSON.numberOfFixedParameters);
      ParametersValueType * paramsPtr = reinterpret_cast< ParametersValueType * >( std::strtoull(transformJSON.parameters.substr(35).c_str(), nullptr, 10) );
      transform->CopyInParameters(paramsPtr, paramsPtr + transformJSON.numberOfParameters);
    }

    ++count;
  }
}

template <typename TTransform>
void
WasmTransformToTransformFilter<TTransform>
::PrintSelf(std::ostream & os, Indent indent) const
{
  Superclass::PrintSelf(os, indent);
}
} // end namespace itk

#endif
