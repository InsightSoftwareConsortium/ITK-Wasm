from itkwasm_downsample_wasi import downsample_sigma

def test_downsample_sigma():
    sigma = downsample_sigma(shrink_factors=[2, 4])
    assert sigma[0] == 0.735534255037358
    assert sigma[1] == 1.6447045940431997