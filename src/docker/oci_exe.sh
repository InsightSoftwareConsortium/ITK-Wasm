function ociExe() {
    # Check for OCI_EXE environmental variable
    if [[ -n "$OCI_EXE" && -x "$OCI_EXE" ]]; then
        echo "$OCI_EXE"
        return
    fi

    # Check for podman executable
    if which podman > /dev/null 2>&1; then
        echo "podman"
        return
    fi

    # Check for docker executable
    if which docker > /dev/null 2>&1; then
        echo "docker"
        return
    fi

    # If none of the above exist, return nothing
    echo "Could not find podman or docker executable" >&2
    exit 1
}