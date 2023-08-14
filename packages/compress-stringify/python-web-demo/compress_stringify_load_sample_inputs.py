import js

async def load_sample_inputs(model):
    sample_input = bytes([222, 173, 190, 239])
    model.inputs['input'] = sample_input
    input_element = js.document.getElementById('compress_stringify-input-details')
    input_element.innerHTML = f"<pre>{str(sample_input)}</pre>"
    input_element.disabled = False

    stringify = True
    model.options['stringify'] = stringify
    stringify_element = js.document.querySelector('#compress_stringify-inputs sl-checkbox[name=stringify]')
    stringify_element.checked = stringify

    compression_level = 5
    model.options['compression_level'] = compression_level
    compression_level_element = js.document.querySelector('#compress_stringify-inputs sl-input[name=compression-level]')
    compression_level_element.value = compression_level

    data_url_prefix = 'data:application/iwi+cbor+zstd;base64,'
    model.options['data_url_prefix'] = data_url_prefix
    data_url_prefix_element = js.document.querySelector('#compress_stringify-inputs sl-input[name=data-url-prefix]')
    data_url_prefix_element.value = data_url_prefix

    return model