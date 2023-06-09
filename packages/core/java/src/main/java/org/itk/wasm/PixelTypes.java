package org.itk.wasm;

public enum PixelTypes {
    Unknown("Unknown"),
    Scalar("Scalar"),
    RGB("RGB"),
    RGBA("RGBA"),
    Offset("Offset"),
    Vector("Vector"),
    Point("Point"),
    CovariantVector("CovariantVector"),
    SymmetricSecondRankTensor("SymmetricSecondRankTensor"),
    DiffusionTensor3D("DiffusionTensor3D"),
    Complex("Complex"),
    FixedArray("FixedArray"),
    Array("Array"),
    Matrix("Matrix"),
    VariableLengthVector("VariableLengthVector"),
    VariableSizeMatrix("VariableSizeMatrix");

    private final String value;

    PixelTypes(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
