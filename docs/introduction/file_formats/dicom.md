# Supported DICOM File Formats

The DICOM standard defines how various medical media, such as images, reports,
waveforms, annotations, and measurements, are to be stored and accessed
([SOP classes](https://dicom.nema.org/medical/dicom/current/output/chtml/part04/chapter_6.html)).

Since itk-wasm builds upon [ITK](https://github.com/InsightSoftwareConsortium/ITK),
it already has significant support for reading DICOM and other medical image file formats.
ITK’s DICOM reading capabilities are mainly supported through third-party libraries, namely GDCM and DCMTK.
We have tested our support for the following classes, and will continue to expand this list
in the future:

## Supported image classes

- Computed Tomography (CT)
- Enhanced CT Image
- Magnetic Resonance (MR)
- Enhanced MR Image
- Computed Radiography Image (CR)
- Digital Mammography X-Ray Image
- Digital X-Ray Image
- Positron Emission Tomography Image
- Nuclear Medicine Image
- Ultrasound Image
- Ultrasound Multi-frame Image
- Secondary Capture Image
- Multi-frame Secondary Capture Image
- Segmentation Storage

For other image formats see: [Images](./images)


There also certain SOP classes that store non-image related medical information.

## Supported non-image classes

- Basic, Enhanced, Comprehensive Structured Report (SR)
- X-Ray Radiation Dose Report (SR)
- Key Object Selection Document (SR)
- Encapsulated PDF Storage
- Grayscale Softcopy Presentation State Storage SOP Class (GSPS)
- Color Softcopy Presentation State Storage SOP Class (CSPS)


