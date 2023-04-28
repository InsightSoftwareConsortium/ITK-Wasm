# Generated file. Do not edit.

from itkwasm import (
    environment_dispatch,
    BinaryFile,
    Image,
)

async def apply_presentation_state_to_image_async(
    image_in: os.PathLike,
    presentation_state_file: os.PathLike,
    config_file: str = "",
    frame: int = 1,
    presentation_state_output: bool = False,
    bitmap_output: bool = False,
    pgm: bool = False,
    dicom: bool = False,
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

    :param presentation_state_output: get presentation state information in text stream (default: ON).
    :type  presentation_state_output: bool

    :param bitmap_output: get resulting image as bitmap output stream (default: ON).
    :type  bitmap_output: bool

    :param pgm: save image as PGM (default)
    :type  pgm: bool

    :param dicom: save image as DICOM secondary capture
    :type  dicom: bool

    :return: Output overlay information
    :rtype:  Dict

    :return: Output image
    :rtype:  Image
    """
    func = environment_dispatch("itkwasm_dicom", "apply_presentation_state_to_image_async")
    output = await func(image_in, presentation_state_file, config_file=config_file, frame=frame, presentation_state_output=presentation_state_output, bitmap_output=bitmap_output, pgm=pgm, dicom=dicom)
    return output
