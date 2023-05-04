from pathlib import Path 

def test_read_dicom_encapsulated_pdf():
    from itkwasm_dicom_wasi import read_dicom_encapsulated_pdf
    file_name = '104.1-SR-printed-to-pdf.dcm'
    test_file_path = Path('..', '..' , 'test', 'data', 'input', file_name)

    assert test_file_path.exists()

    pdf_binary = read_dicom_encapsulated_pdf(test_file_path)
    assert pdf_binary != None
    assert len(pdf_binary) == 91731
