from pathlib import Path

test_input_path = Path(__file__).parent / ".." / ".." / ".." / "test" / "data" / "input"
test_baseline_path = Path(__file__).parent / ".." / ".." / ".." / "test" / "data" / "baseline"
test_output_path = Path(__file__).parent / ".." / ".." / ".." / "test" / "data" / "output" / "python"
test_output_path.mkdir(parents=True, exist_ok=True)

def compare_rounded_float(a: float, b: float, n: int) -> bool:
    return round(a, n) ==  round(b, n)

def compare_array_float(a, b) -> bool:
    for x in range(len(a)):
        if not compare_rounded_float(a[x], b[x], 3):
            return False
    return True
