# Generated file. To retain edits, remove this comment.

from dataclasses import dataclass
from typing import Any, Dict

import numpy as np

import js
from pyodide.ffi.wrappers import add_event_listener
import pyodide

from itkwasm_compress_stringify import compress_stringify_async
from compress_stringify_load_sample_inputs import load_sample_inputs

@dataclass
class CompressStringifyModel:
    inputs: Dict['str', Any]
    options: Dict['str', Any]
    outputs: Dict['str', Any]

class CompressStringifyController:

    def __init__(self, load_sample_inputs):
        self.model = CompressStringifyModel({}, {}, {})

        self.load_sample_inputs = load_sample_inputs
        if load_sample_inputs is not None:
            load_sample_inputs_button = js.document.querySelector("#compress_stringify-inputs [name=load-sample-inputs]")
            load_sample_inputs_button.setAttribute('style', 'display: block-inline;')
            add_event_listener(load_sample_inputs_button, 'click', self.on_load_sample_inputs_click)

        # Inputs
        input_element = js.document.querySelector('#compress_stringify-inputs input[name=input-file]')
        add_event_listener(input_element, 'change', self.on_input_change)

        # Options
        stringify_element = js.document.querySelector('#compress_stringify-inputs sl-checkbox[name=stringify]')
        self.stringify_element = stringify_element
        add_event_listener(stringify_element, 'sl-change', self.on_stringify_change)

        compression_level_element = js.document.querySelector('#compress_stringify-inputs sl-input[name=compression-level]')
        self.compression_level_element = compression_level_element
        add_event_listener(compression_level_element, 'sl-change', self.on_compression_level_change)

        data_url_prefix_element = js.document.querySelector('#compress_stringify-inputs sl-input[name=data-url-prefix]')
        self.data_url_prefix_element = data_url_prefix_element
        add_event_listener(data_url_prefix_element, 'sl-change', self.on_data_url_prefix_change)

        # Outputs
        output_download_element = js.document.querySelector('#compress_stringify-outputs sl-button[name=output-download]')
        self.output_download_element = output_download_element
        add_event_listener(output_download_element, 'click', self.on_output_click)

        # Run
        run_button = js.document.querySelector('#compress_stringify-inputs sl-button[name="run"]')
        self.run_button = run_button
        add_event_listener(run_button, 'click', self.on_run)

    async def on_load_sample_inputs_click(self, event):
        load_sample_inputs_button = js.document.querySelector("#compress_stringify-inputs [name=load-sample-inputs]")
        load_sample_inputs_button.loading = True
        self.model = await self.load_sample_inputs(self.model)
        load_sample_inputs_button.loading = False

    async def on_input_change(self, event):
        files = event.target.files
        array_buffer = await files.item(0).arrayBuffer()
        input_bytes = array_buffer.to_bytes()
        self.model.inputs['input'] = input_bytes
        input_element = js.document.getElementById("#compress_stringify-input-details")
        input_element.innerHTML = f"<pre>{str(np.frombuffer(input_bytes[:50], dtype=np.uint8)) + ' ...'}</pre>"

    def on_stringify_change(self, event):
        self.model.options['stringify'] = self.stringify_element.checked

    def on_compression_level_change(self, event):
        self.model.options['compression_level'] = int(self.compression_level_element.value)

    def on_data_url_prefix_change(self, event):
        self.model.options['data_url_prefix'] = self.data_url_prefix_element.value

    def on_output_click(self, event):
        if 'output' not in self.model.outputs:
            return
        output = pyodide.ffi.to_js(self.model.outputs['output'])
        js.globalThis.downloadFile(output, 'output.bin')

    async def on_run(self, event):
        event.preventDefault()
        event.stopPropagation()

        if 'input' not in self.model.inputs:

            js.globalThis.notify("Error while running pipeline", "Missing input 'input'", "danger", "exclamation-octagon")
            return

        self.run_button.loading = True
        try:
            t0 = js.performance.now()
            output = await compress_stringify_async(self.model.inputs['input'], **self.model.options)
            t1 = js.performance.now()
            js.globalThis.notify("compress_stringify successfully completed", f"in {t1 - t0} milliseconds.", "success", "rocket-fill")
            self.model.outputs["output"] = output
            self.output_download_element.variant = "success"
            self.output_download_element.disabled = False
            output_element = js.document.getElementById('compress_stringify-output-details')
            output_element.innerHTML = f"<pre>{str(np.frombuffer(output[:200], dtype=np.uint8)) + ' ...'}</pre>"
            output_element.disabled = False

        except Exception as error:
            js.globalThis.notify("Error while running pipeline", str(error), "danger", "exclamation-octagon")
            raise error
        finally:
            self.run_button.loading = False

compress_stringify_controller = CompressStringifyController(load_sample_inputs)
