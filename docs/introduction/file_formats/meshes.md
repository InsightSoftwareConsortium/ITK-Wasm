# Supported Mesh and Point Set File Formats

Read and write to and from [`Mesh`](/typescript/interface_types/Mesh.html) is supported.

- [BYU](http://www.eg-models.de/formats/Format_Byu.html)
- [FreeSurfer surface, binary and ASCII](http://www.grahamwideman.com/gw/brain/fs/surfacefileformats.htm)
- [OFF](https://en.wikipedia.org/wiki/OFF_%28file_format%29)
- [STL](https://en.wikipedia.org/wiki/STL_%28file_format%29)
- [SWC Neuron Morphology](https://swc-specification.readthedocs.io/en/latest/)
- [OBJ](https://en.wikipedia.org/wiki/Wavefront_.obj_file)
- [VTK legacy file format for vtkPolyData](https://www.vtk.org/wp-content/uploads/2015/04/file-formats.pdf)

For visualization with [vtk.js](https://kitware.github.io/vtk-js/index.html), use itk-wasm `meshToPolyData` and [`vtkITKHelper.convertItkToVtkPolyData`](https://kitware.github.io/vtk-js/api/Common_DataModel_ITKHelper.html) ([example](https://kitware.github.io/vtk-js/examples/ItkWasmGeometry.html)).
