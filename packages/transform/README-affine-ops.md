# Affine Operations Pipeline

The `affine-ops` pipeline applies a sequence of operations to an affine transform.

## Usage

```bash
affine-ops input-transform output-transform operations
```

Where:
- `input-transform`: An input affine transform file
- `output-transform`: The output transform file after applying operations
- `operations`: A JSON array of operations to apply sequentially

## Operations Format

The operations parameter should be a JSON array where each element describes an operation to apply to the affine transform. Each operation object must have a `method` field specifying the operation type.

### Supported Operations

#### SetIdentity
Resets the transform to identity.
```json
{"method": "SetIdentity"}
```

#### Translate
Translates the transform by a vector.
```json
{
  "method": "Translate",
  "translation": [x, y, z],
  "pre": false
}
```
- `translation`: Vector of translation values (length must match transform dimension)
- `pre`: Optional boolean, if true applies pre-composition (default: false)

#### Scale
Scales the transform by a factor or vector of factors.
```json
{
  "method": "Scale",
  "factor": 2.0,
  "pre": false
}
```
or
```json
{
  "method": "Scale",
  "factor": [2.0, 1.5, 0.8],
  "pre": false
}
```
- `factor`: Scalar value or vector of scale factors
- `pre`: Optional boolean, if true applies pre-composition (default: false)

#### Rotate
Rotates around two axes by an angle.
```json
{
  "method": "Rotate",
  "axis1": 0,
  "axis2": 1,
  "angle": 1.57,
  "pre": false
}
```
- `axis1`, `axis2`: Axis indices for rotation plane
- `angle`: Rotation angle in radians
- `pre`: Optional boolean, if true applies pre-composition (default: false)

#### Rotate2D (2D transforms only)
Rotates in 2D by an angle.
```json
{
  "method": "Rotate2D",
  "angle": 1.57,
  "pre": false
}
```
- `angle`: Rotation angle in radians
- `pre`: Optional boolean, if true applies pre-composition (default: false)

#### Rotate3D (3D transforms only)
Rotates around a specified axis.
```json
{
  "method": "Rotate3D",
  "axis": [0, 0, 1],
  "angle": 1.57,
  "pre": false
}
```
- `axis`: 3D vector specifying rotation axis
- `angle`: Rotation angle in radians
- `pre`: Optional boolean, if true applies pre-composition (default: false)

#### Shear
Applies a shear transformation.
```json
{
  "method": "Shear",
  "axis1": 0,
  "axis2": 1,
  "coef": 0.5,
  "pre": false
}
```
- `axis1`, `axis2`: Axis indices for shear
- `coef`: Shear coefficient
- `pre`: Optional boolean, if true applies pre-composition (default: false)

## Example

```bash
# Create an affine transform
create-affine-transform identity.iwt

# Apply operations: reset to identity, translate, then scale
affine-ops identity.iwt result.iwt \
  '[
    {"method": "SetIdentity"},
    {"method": "Translate", "translation": [1.0, 2.0, 3.0]},
    {"method": "Scale", "factor": 2.0}
  ]'
```

This will create a transform that first translates by (1,2,3) and then scales by a factor of 2.
