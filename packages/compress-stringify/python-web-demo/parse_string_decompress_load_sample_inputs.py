import js

def load_sample_inputs(model):
    sample_input = bytes([100,97,116,97,58,97,112,112,108,105,99,97,116,105,111,110,47,105,119,105,43,99,98,111,114,43,122,115,116,100,59,98,97,115,101,54,52,44,75,76,85,118,47,83,65,69,73,81,65,65,51,113,50,43,55,119,61,61])
    model.inputs["input"] = sample_input
    input_element = js.document.querySelector("#parse_string_decompress-inputs sl-input[name=input]")
    input_element.value = str(sample_input)

    parse_string = True
    model.options["parse_string"] = parse_string
    parse_string_element = js.document.querySelector("#parse_string_decompress-inputs sl-checkbox[name=parse-string]")
    parse_string_element.checked = parse_string

    return model
