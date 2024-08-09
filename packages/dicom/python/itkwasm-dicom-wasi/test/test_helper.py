import json

def compare_json(baselineJsonFilePath: str, outputJSON) -> bool:
    with open(baselineJsonFilePath, 'r') as fp:
        buffer = fp.read()
    baseline_json_object = json.loads(buffer)

    for key in baseline_json_object:
        if not baseline_json_object[key] == outputJSON[key]:
            print("compare_json failed on key: ", key)
            return False

    for key in outputJSON:
        if not outputJSON[key] == baseline_json_object[key]:
            print("compare_json failed on key: ", key)
            return False

    return True
