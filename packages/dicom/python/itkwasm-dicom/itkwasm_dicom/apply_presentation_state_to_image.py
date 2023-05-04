# Generated file. Do not edit.

from typing import Optional

from itkwasm import (
    environment_dispatch,
    BinaryFile,
    Image,
)

def apply_presentation_state_to_image(
    image_in: os.PathLike,
    presentation_state_file: os.PathLike,
    config_file: str = "",
    frame: int = 1,
    no_presentation_state_output: bool = False,
    no_bitmap_output: bool = False,
) -> Tuple[Dict, Image]:
    """Apply a presentation state to a given DICOM image and render output as pgm bitmap or dicom file.

    :param image_in: Input DICOM file
    :type  image_in: os.PathLike

    :param presentation_state_file: Process using presentation state file
    :type  presentation_state_file: os.PathLike

    :param config_file: filename: string. Process using settings from configuration file
    :type  config_file: str

    :param frame: frame: integer. Process using image frame f (default: 1)
    :type  frame: int

    :param no_presentation_state_output: Do not get presentation state information in text stream.
    :type  no_presentation_state_output: bool

    :param no_bitmap_output: Do not get resulting image as bitmap output stream.
    :type  no_bitmap_output: bool

    :return: Output overlay information
    :rtype:  Dict

    :return: Output image
    :rtype:  Image
    """
    func = environment_dispatch("itkwasm_dicom", "apply_presentation_state_to_image")
    output = func(image_in, presentation_state_file, config_file=config_file, frame=frame, no_presentation_state_output=no_presentation_state_output, no_bitmap_output=no_bitmap_output)
    return output
