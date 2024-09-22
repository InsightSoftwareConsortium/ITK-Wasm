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
#ifndef TAGS_OPTION_PARSER_H
#define TAGS_OPTION_PARSER_H

#include <optional>
#include "rapidjson/document.h"

#include "Tags.h"

std::optional<const Tags> parseTags(itk::wasm::InputTextStream &tagsToRead, itk::wasm::Pipeline &pipeline)
{
    if (tagsToRead.GetPointer() == nullptr)
    {
        return std::nullopt;
    }

    rapidjson::Document inputTagsDocument;
    const std::string inputTagsString((std::istreambuf_iterator<char>(tagsToRead.Get())),
                                      std::istreambuf_iterator<char>());
    if (inputTagsDocument.Parse(inputTagsString.c_str()).HasParseError())
    {
        CLI::Error err("Runtime error", "Could not parse input tags JSON.", 1);
        pipeline.exit(err);
        return std::nullopt;
    }
    if (!inputTagsDocument.HasMember("tags"))
    {
        CLI::Error err("Runtime error", "Input tags does not have expected \"tags\" member", 1);
        pipeline.exit(err);
        return std::nullopt;
    }

    const rapidjson::Value &inputTagsArray = inputTagsDocument["tags"];

    Tags tags;
    for (rapidjson::Value::ConstValueIterator itr = inputTagsArray.Begin(); itr != inputTagsArray.End(); ++itr)
    {
        const std::string tagString(itr->GetString());
        Tag tag;
        tag.ReadFromPipeSeparatedString(tagString.c_str());
        tags.insert(tag);
    }
    return tags;
}

#endif // TAGS_OPTION_PARSER_H