---
type: reference
title: Resample Bounding Box Pipeline
created: 2026-07-02
tags:
  - itk-wasm
  - resampling
  - bounding-box
  - transform
related:
  - '[[downsample]]'
  - '[[affine-ops]]'
---

# Resample Bounding Box Pipeline

`resample-bounding-box` computes the padded region of a **moving** image that is needed to resample a **fixed**
image's grid through a spatial transform — *without touching a single pixel*. It reads only image metadata
(size, spacing, origin, direction), so both images may be supplied with empty data buffers. The result is a small
JSON object describing exactly which sub-region of the moving image a caller must fetch before performing the real,
pixel-level resample (for example with [[downsample]] or an affine warp built from [[affine-ops]]).

The pipeline is part of the `@itk-wasm/downsample` / `itkwasm-downsample` packages and runs identically in C++
(WASI/native CTest), TypeScript (browser/Node), and Python.

## Motivation

Resampling a fixed grid into a moving image only ever reads moving-image samples inside the transformed footprint
of the fixed grid. When the moving image is large (or remote, or chunked), materializing all of it just to resample
a small overlapping region is wasteful. `resample-bounding-box` answers the question **"which moving-image indices
will the resample actually read?"** using arithmetic on metadata alone, so a caller can fetch only that block.

## Inputs

Positional arguments are, in order, `transform`, `fixed`, `moving`, `bounding-box` (output), matching the CLI and
the generated bindings.

| Input | Type | Notes |
| --- | --- | --- |
| `transform` | `INPUT_TRANSFORM` | Spatial transform mapping **fixed**-image physical points into **moving**-image physical space. Any single, non-composite parameterization at dimension 2, 3, or 4 (e.g. `TranslationTransform`, `AffineTransform`). Read at double precision regardless of stored precision. |
| `fixed` | `INPUT_IMAGE` | Fixed image whose grid is resampled. **Metadata only** — the pixel buffer is never dereferenced and may be empty. |
| `moving` | `INPUT_IMAGE` | Moving image to be sampled. **Metadata only** — buffer may be empty. |
| `--padding` | `int`, default `1` | Pixels of padding added per side (symmetrically). The default of `1` covers linear interpolation, which reads one neighbor beyond the continuous-index bound. Use `0` for the tight region, or a larger value for wider-support interpolators. |

Both images must share the transform's dimension. The pipeline dispatches on the transform dimension itself, so a
2D transform expects 2D images, a 3D transform 3D images, and so on.

### Metadata-only contract

The fixed and moving pixel buffers are **never** read. In the bindings this means the caller can construct images
whose `data` is an empty array of the correct component type and still receive a correct region. This is the whole
point: describe two images and a transform with a few numbers, learn precisely which moving-image block to fetch,
and only then move real pixels.

## Algorithm

For a fixed image of dimension *N*:

1. **Sample selection.** Ask the transform whether it is linear (`itk::Transform::IsLinear()`, i.e.
   `GetTransformCategory() == Linear` — true for translation, rigid, similarity, and affine transforms).
   - **Linear (fast path).** Sample only the `2^N` grid *corners* (4 in 2D, 8 in 3D, …). A linear map sends the
     fixed rectangle to a convex region, so its axis-aligned bound is already attained at the transformed corners —
     the corners give the exact same box as the full boundary would, at `2^N` transforms independent of image size.
   - **Nonlinear, made of linear, cubic B-spline and displacement-field stages.** No fixed-grid samples are
     selected: the grid's box is carried through the stages, see [Stage bound](#stage-bound) below.
   - **Any other nonlinear transform.** Enumerate every *boundary* pixel of the fixed grid — every pixel with at least one index
     component equal to `0` or `size_d - 1` (all faces and edges, not merely the corners). Interior pixels are
     skipped efficiently (the fastest axis is fast-forwarded to its last column), so the cost is proportional to the
     number of boundary pixels, not the total pixel count.
2. **Transform.** Map each sampled point's physical location (corners on the linear fast path, boundary pixels
   otherwise) through the transform into moving-image physical space, and convert to a continuous index in the
   moving image (`TransformPhysicalPointToContinuousIndex`). All math is done at double precision.
3. **Bounding box.** Accumulate the per-axis min/max of the transformed physical points (`corners`) and of the
   moving-image continuous indices.
4. **Moving index region.** Convert the continuous-index bounds to an integer region: `floor` the min and `ceil`
   the max per axis.
5. **Padding.** Expand the integer region outward by `--padding` on every side (`start -= padding`,
   `end += padding`). The resulting per-axis size is clamped to a minimum of `0` (never negative).

### Corner fast path vs. full-boundary sampling

For a **linear** transform (translation, rigid, similarity, affine — rotation, scale, shear) the image of the fixed
rectangle is convex, so its axis-aligned bound is already achieved at the `2^N` transformed corners. The pipeline
detects this via `itk::Transform::IsLinear()` and samples **only the corners** — a `2^N`-point computation
independent of image size, and provably identical to what a full-boundary walk would return.

Enumerating the entire boundary is kept for **nonlinear** transforms the stage bound does not cover (a
thin-plate spline, a custom transform), where an interior edge pixel can map *outside* the hull
of the transformed corners; sampling only the corners would then *under-bound* the region and the later resample
would read outside the fetched block. The walk itself bounds the grid only when the transform's extremes lie on
the grid's faces. (The C++ unit test covers both paths: it asserts the
linear cases sample exactly `2^N` corners yet reproduce the same region a boundary walk gives, and includes a
nonlinear "bulge" transform whose right-edge midpoint maps beyond the transformed corners — confirming the full
boundary is walked, and matters, precisely when the transform is nonlinear.)

### Stage bound

The boundary of the fixed grid does not bound a B-spline or a displacement field: a displacement that peaks
strictly inside the grid moves interior pixels past everything the faces reach, and the later resample reads
outside the fetched block. For these transforms the pipeline carries the grid's physical box through the
transform one stage at a time, in the order ITK applies them, with a rule per stage that holds for every point of
the box:

- **Linear stage.** Composed with the linear stages around it, and applied exactly to the points a later stage
  samples, so a rotation ahead of a B-spline does not widen the box.
- **Cubic B-spline stage.** The transform is sampled on a lattice over the box, and the lattice's box is widened
  by the interpolation error between lattice points, `s^2 / 8` times a bound on the second derivative read off
  the second differences of the control points. The result is intersected with the box plus the signed range of
  the control points whose support meets it. The lattice step is half a control cell at most and a voxel at
  least, shortened in between until the margin fits in a voxel; a stage maps at most 2^14 points. Where the box
  leaves the B-spline's valid region, ITK displaces nothing, and the box plus the signed range with zero in it is
  taken alone.
- **Displacement-field stage.** The box of the landing points of the samples under the box, intersected with the
  box plus the signed range of those samples; half a sample wider where the box reaches past the field.

Each rule holds because a point moves by a convex combination of the control points or the samples around it.
The `corners` output is then this box, and the index region is the box of its corners in the moving image.
[ngff-zarr](https://github.com/fideus-labs/ngff-zarr) implements the same rules in Python and TypeScript, and the
three test suites assert the same regions for the same B-spline.

### Edge cases

- A **degenerate fixed image** with any zero-length axis has no boundary pixels; the pipeline reports an all-zero,
  empty region rather than producing garbage indices.
- **Negative effective sizes** (e.g. a large negative `--padding`) are clamped so `paddedSize` is never negative.
- `padding` is applied **symmetrically** per side, and the unpadded `corners` are the tight transformed-point
  extremes **regardless** of the padding value.

## Output JSON schema

The `bounding-box` output is a single JSON object (`OUTPUT_JSON`). All arrays are length *N* (the image
dimension), ordered fastest-axis-first (x, y, z, …).

```json
{
  "paddedStartIndex": [int, ...],
  "paddedSize": [uint, ...],
  "paddedCorners": { "min": [double, ...], "max": [double, ...] },
  "corners":       { "min": [double, ...], "max": [double, ...] }
}
```

| Field | Meaning |
| --- | --- |
| `paddedStartIndex` | Integer start index, **in the moving image**, of the region to fetch (padding included). May be negative if the transformed grid extends past the moving-image origin. |
| `paddedSize` | Integer size, in moving-image pixels, of the region to fetch. Clamped to ≥ 0. |
| `paddedCorners.min` / `.max` | Physical-space coordinates of the padded region's start index and inclusive-end index (from the moving-image grid). |
| `corners.min` / `.max` | The **tight** (unpadded) transformed-point extremes in moving-image physical space. Padding-independent. |

### Worked example (2D translation)

Fixed `16×16`, spacing `(2, 2)`, origin `(10, 20)`; moving `64×64`, spacing `(1, 1)`, origin `(0, 0)`;
translation `(10, 5)`; `--padding 1`:

```json
{"paddedStartIndex":[19,24],"paddedSize":[33,33],"paddedCorners":{"min":[19,24],"max":[51,56]},"corners":{"min":[20,25],"max":[50,55]}}
```

The output is compact (no whitespace). The `corners` / `paddedCorners` values are JSON numbers of type *double*, but
an integer-valued coordinate is emitted without a trailing `.0` (e.g. `19`, not `19.0`) — the value is identical and
every binding parses it as a floating-point number. A non-integer coordinate keeps its fraction at full precision:
the 2D affine rotation below yields, for example, `"corners":{"min":[9.2,5.200000000000001],"max":[29.799999999999997,23.800000000000004]}`.

The tight corners `[20,25]–[50,55]` are the translated fixed grid; padding 1 grows the integer region outward by
one pixel per side. A 3D translation and a 2D affine rotation (non-axis-aligned corners `[9.2,5.2]–[29.8,23.8]`)
are covered by the same tests and produce identical results across C++, TypeScript, and Python.

## Intended downstream use

The reported region is a *fetch plan*. A typical pipeline:

1. Call `resample-bounding-box(transform, fixed, moving, padding=…)` with **metadata-only** fixed and moving images.
2. Read `paddedStartIndex` and `paddedSize` and fetch only that sub-region of the moving image (a streamed read,
   a chunk request, or an `itk::RegionOfInterestImageFilter`-style crop) — intersecting with the moving image's
   largest possible region if you need to stay in bounds.
3. Perform the real resample of the fixed grid through the same `transform`, now reading pixels only from the
   fetched block. See [[downsample]] for the resampling/anti-aliasing side, and [[affine-ops]] for constructing
   and composing the affine transforms fed in here.

Because the region is computed from metadata alone, steps 1–2 are cheap enough to run before deciding whether a
resample is even worthwhile (e.g. skipping non-overlapping tiles).

## See also

- [[downsample]] — the resampling / anti-aliasing pipelines in this package.
- [[affine-ops]] — building, inverting, and composing the affine transforms consumed by this pipeline.
