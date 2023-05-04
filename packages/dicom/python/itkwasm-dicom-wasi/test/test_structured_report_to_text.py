from pathlib import Path

def test_structured_report_to_text():
    from itkwasm_dicom_wasi import structured_report_to_text
    file_name = '88.33-comprehensive-SR.dcm'
    test_file_path = Path('..', '..' , 'test', 'data', 'input', file_name)

    assert test_file_path.exists()

    output_text = structured_report_to_text(test_file_path)
    assert output_text.find('Comprehensive SR Document') != -1
    assert output_text.find('Pathology') != -1

    output_text = structured_report_to_text(test_file_path, no_document_header=True)
    assert output_text.find('Comprehensive SR Document') == -1
    assert output_text.find('Breast Imaging Report') != -1
    assert output_text.find('Pathology') != -1