from itkwasm_downsample_wasi import gaussian_kernel_radius

def test_gaussian_kernel_radius():
    radius = gaussian_kernel_radius(size=[64, 64, 32], sigma=[2.0, 4.0, 2.0])
    assert radius[0] == 5
    assert radius[1] == 10
    assert radius[2] == 5