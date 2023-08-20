interface CompareImagesMetric {
    /** Whether the test image and one of the baseline images are equal given specified tolerances. */
    almostEqual: boolean;

    /** The number of pixels that are different. */
    numberOfPixelsDifferent: number;

    /** Minimum pixel intensity difference. */
    minimumDifference: number;

    /** Maximum pixel intensity difference. */
    maximumDifference: number;

    /** Mean pixel intensity difference. */
    meanDifference: number;

    /** Total pixel intensity difference. */
    totalDifference: number;
}

export default CompareImagesMetric
