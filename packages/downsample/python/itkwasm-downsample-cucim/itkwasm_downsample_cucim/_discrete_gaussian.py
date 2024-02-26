import math

import cupy as cp
import numpy as np
import cupyx.scipy.ndimage as ndi

try:
    # Use Bessel functions from SciPy.
    # (we only call these with scalar values, so a CPU-based implementation is
    #  preferable)
    from scipy.special import i0, i1, iv
except ImportError:
    # fall back to CuPy's CUDA implementation if SciPy is unavailable

    # Can `GaussianOperator.ModifiedBesselI0` etc. be used from ITK Python?

    import cupyx.scipy.special

    def i0(x):
        """compute i0 on the GPU and copy back to host."""
        return float(cupyx.scipy.special.i0(x))

    def i1(x):
        """compute i1 on the GPU and copy back to host."""
        return float(cupyx.scipy.special.i1(x))

    def iv(x):
        """compute iv on the GPU and copy back to host."""
        return float(cupyx.scipy.special.iv(x))


def _to_seq(x, ndim):
    if np.isscalar(x):
        x = (x,) * ndim
    return x


def _discrete_gaussian_kernel(var, max_error=0.01, max_half_width=29):
    """Genereate a discrete Gaussian kernel.

    Parameters
    ----------
    var : float
        The variance of the discrete Gaussian kernel.
    max_error : float
        This is a normalized value in the range (0, 1) that represents the
        difference between the area under the discrete Gaussian curve and the
        area under the continuous Gaussian. It effects the size of the kernel.
    max_half_width : int
        The maximum width of the generated kernel will be constrained to size
        ``2*max_half_width + 1``. If `max_half_width` is reached, a
        UserWarning will be raised.

    Returns
    -------
    kernel : ndarray
        A symmetric, discrete Gaussian kernel with odd length. The length will
        be the minimum length required to satisfy the requested `max_error`
        or ``2 * max_half_width + 1``, whichever is shorter.

    Notes
    -----
    The discrete Gaussian kernel is the solution to the discrete diffusion
    equation [1]_. Its use for discrete scale space representations was
    pioneered by Tony Lindeberg ([1]_, [3]_).

    This kernel is based on the ITK class itkGaussianOperator.

    References
    ----------
    .. [1] https://en.wikipedia.org/wiki/Scale_space_implementation#The_discrete_Gaussian_kernel
    .. [2] Lindeberg, T., "Scale-space for discrete signals,"
           IEEE Transactions on Pattern Analysis and Machine Intelligence,
           vol. 12, no. 3, pp. 234-254, March 1990.
           :DOI:`10.1109/34.49051`
    .. [3] Lindeberg, T., Scale-Space Theory in Computer Vision,
           Kluwer Academic Publishers, 1994, ISBN 0-7923-9418-6.
    """
    if var == 0:
        return np.ones((1,), dtype=float)
    et = math.exp(-var)
    max_width = max_half_width + 1  # include central point of kernel
    if max_half_width < 1 or (max_half_width % 1 != 0):
        raise ValueError("max_half_width must be a positive integer")
    if not (0 < max_error < 1):
        raise ValueError("max_error must be in the range (0.0, 1.0)")

    coeffs = [et * i0(var),  # central point
              et * i1(var)]  # first right side sample

    # Keep adding coefficients until the summed values of the kernel are
    # close to 1.0.
    # Note: cumsum up to 1.0 - max_error would have relatively poor accuracy.
    #       Instead, we progressively subtract each coefficient. This is
    #       accurate as all subtractions are for values of similar magnitude.
    error = 1.0 - coeffs[0]
    error -= 2 * coeffs[1]  # *2 to account for both sides of the kernel
    width = 1
    while error > max_error and width < max_width:
        width += 1
        c = et * iv(width, var)
        error -= 2 * c
        coeffs.append(c)

    if width == max_width:
        warnings.warn("max_half_width reached (with error = {})".format(error))

    # normalize to area 1
    area = 1 - error
    coeffs = np.asarray(coeffs)
    coeffs /= area

    # make symmetric
    coeffs = np.concatenate((coeffs[-1:0:-1], coeffs))
    return coeffs


def _derivative_kernel(order, dtype=float):
    """Generate a kernel for taking a derivative of a given order.

    The minimal length symmetric kernel corresponding to a derivative of the
    requested order is returned.

    Parameters
    ----------
    order : int
        The order of the derivative.
    dtype : float

    Notes
    -----
    Implementation based on ITK's itkDerivativeOperator.

    Odd orders are produced by convolving [-0.5, 0, 0.5] with ``order - 1``
    convolutions with [1, -1].

    Even orders are produced by convolving [1, -1] with ``order - 1``
    convolutions with [1, -1].

    """
    if order < 0 or order % 1 != 0:
        raise ValueError("order must be a non-negative integer")
    if np.dtype(dtype).kind != 'f':
        raise ValueError("dtype must be a floating point data type.")
    if order > 1:
        d = np.asarray([1, -1], dtype=dtype)
    if order % 2:
        coeff = np.asarray([-0.5, 0, 0.5], dtype=dtype)
        if order == 1:
            return coeff
    else:
        if order == 0:
            return np.ones((1,), dtype=dtype)
        coeff = d
    # obtain higher orders by repeated convolution with [1, -1]
    for i in range(order - 1):
        coeff = np.convolve(coeff, d)
    return coeff


def _discrete_gaussian_derivative_kernel(
    sigma, max_error=0.005, max_half_width=29, order=1, spacing=1.0,
    normalize_across_scale=True
):
    """
    Parameters
    ----------
    sigma : float
        The standard deviation of the discrete Gaussian kernel.
    max_error : float
        This is a normalized value in the range (0, 1) that represents the
        difference between the area under the discrete Gaussian curve and the
        area under the continuous Gaussian. It effects the size of the kernel.

        This values is clamped to the range [0.00001, 0.99999].
    max_half_width : int
        The maximum width of the generated kernel will be constrained to size
        ``2*max_half_width + 1``. If `max_half_width` is reached, a
        UserWarning will be raised.

    Returns
    -------
    kernel : ndarray
        A symmetric, discrete Gaussian kernel with odd length. The length will
        be the minimum length required to satisfy the requested `max_error`
        or ``2 * max_half_width + 1``, whichever is shorter.

    Notes
    -----
    The discrete Gaussian derivative kernel is obtained by applying small,
    discrete derivative operators to the discrete Gaussian kernel [1]_. The
    implementation here follows that of ITK as described in [2]_.

    As in the ITK class, variance will be adjusted to,
    ``var /= spacing * spacing``.

    References
    ----------
    .. [1] Lindeberg, T. Discrete derivative approximations with scale-space
        properties: A basis for low-level feature extraction,
        J. of Mathematical Imaging and Vision, 3(4), pp. 349--376, 1993.
    .. [2] I. Macía. Generalized Computation of Gaussian Derivatives Using ITK.
        The Insight Journal - 2007 July - December.
        http://insight-journal.org/browse/publication/179

    """
    if not (0 < max_error < 1):
        raise ValueError("max_error must be in the range (0.0, 1.0)")
    if spacing <= 0:
        raise ValueError("spacing must be > 0")
    if order < 0:
        raise ValueError("negative order not allowed")

    # clamp range for max_error
    max_error = min(max(0.00001, max_error), 0.99999)

    var = sigma * sigma
    pixel_variance = var / (spacing * spacing)
    coeff = _discrete_gaussian_kernel(pixel_variance, max_error)

    if normalize_across_scale and order > 0:
        if var == 0:
            raise ValueError("normalize_across_scale requires var > 0")
        norm = var ** (order / 2.)
        if spacing != 1.0:
            # additional normalization for spacing
            norm /= spacing ** order
    else:
        norm = 1.0

    coeff *= norm

    # Convolve the Gaussian kernel with a derivative operator.
    if order > 0:
        d = _derivative_kernel(order)
        # Pad the input Gaussian kernel with a clamped boundary condition.
        #    see: itkDiscreteGaussianKernel.hxx
        d_radius = d.size // 2
        coeff = np.pad(coeff, 2 * d_radius - 1, mode='edge')
        coeff = np.convolve(coeff, d, mode='valid')

        # Note: For numerical accuracy, ITK uses compensated summation (aka
        #       Kahan summation for the convolution above). Need to check if
        #       there are real-world scenarios where that is truly necessary.
        #       Here we just use double precision numpy.convolve.
    return coeff



def discrete_gaussian_filter(
    img, sigma=0.0, max_error=0.01, max_half_width=31, spacing=1.0,
    normalize_across_scale=False
):
    return discrete_gaussian_derivative_filter(
        img=img,
        sigma=sigma,
        order=0,
        max_error=max_error,
        max_half_width=max_half_width,
        spacing=spacing,
        normalize_across_scale=normalize_across_scale
    )


def discrete_gaussian_derivative_filter(
    img, sigma=0.0, order=1, max_error=0.01, max_half_width=31, spacing=1.0,
    normalize_across_scale=False,
):
    """Discrete Gaussian derivative filter.

    Parameters
    ----------
    sigma : float
        The standard deviation of the discrete Gaussian kernel.
    max_error : float
        This is a normalized value in the range (0, 1) that represents the
        difference between the area under the discrete Gaussian curve and the
        area under the continuous Gaussian. It effects the size of the kernel.

        This value is clamped to the range [0.00001, 0.99999].
    max_half_width : int
        The maximum width of the generated kernel will be constrained to size
        ``2*max_half_width + 1``. If `max_half_width` is reached, a
        UserWarning will be raised.

    Returns
    -------
    kernel : ndarray
        A symmetric, discrete Gaussian kernel with odd length. The length will
        be the minimum length required to satisfy the requested `max_error`
        or ``2 * max_half_width + 1``, whichever is shorter.

    Notes
    -----
    The discrete Gaussian derivative kernel is obtained by applying small,
    discrete derivative operators to the discrete Gaussian kernel [1]_. The
    implementation here follows that of ITK as described in [2]_.

    As in the ITK class, variance will be adjusted to,
    ``var /= spacing * spacing``.

    `max_half_width` as defined here is equal to ITK's member
    ``m_MaximumKernelWidth - 1``.

    References
    ----------
    .. [1] Lindeberg, T. Discrete derivative approximations with scale-space
        properties: A basis for low-level feature extraction,
        J. of Mathematical Imaging and Vision, 3(4), pp. 349--376, 1993.

    .. [2] Iván Macı́a. Generalized Computation of Gaussian Derivatives Using
        ITK. The Insight Journal - 2007 July - December.
        https://doi.org/10.54294/mrg5is
    """
    ndim = img.ndim
    order = _to_seq(order, ndim)
    max_error = _to_seq(max_error, ndim)
    spacing = _to_seq(spacing, ndim)
    sigma = _to_seq(sigma, ndim)
    if len(sigma) != ndim:
        raise ValueError(
            "var must be a scalar or a sequence of length img.ndim")
    if len(order) != ndim:
        raise ValueError(
            "order must be a scalar or a sequence of length img.ndim")
    if len(max_error) != ndim:
        raise ValueError(
            "max_error must be a scalar or a sequence of length img.ndim")
    if len(spacing) != ndim:
        raise ValueError(
            "spacing must be a scalar or a sequence of length img.ndim")
    for ax, (sig, o, e, s) in enumerate(zip(sigma, order, max_error, spacing)):
        h = _discrete_gaussian_derivative_kernel(
            sigma=sig, order=o, max_error=e,
            max_half_width=max_half_width, spacing=s,
            normalize_across_scale=normalize_across_scale)
        h = cp.asarray(h)
        img = ndi.convolve1d(img, h, axis=ax, mode='nearest')
    return img
