#!/bin/bash

# workdir
work_dir="~/itk-wasm-native"

# main
itk_repository="https://github.com/KitwareMedical/ITK.git"
itk_branch="itkwasm-main-mutable"
dcmtk_repository="https://github.com/InsightSoftwareConsortium/DCMTK.git"
dcmtk_tag="fe7cff5de40b67ae0490d476ddf17689c06bcaf4"
wasm_repository="https://github.com/InsightSoftwareConsortium/ITK-Wasm"
wasm_branch="main"

# dev-override
#itk_repository="https://github.com/jadh4v/ITK.git"
#itk_branch="itkwasm-2024-06-06"
#wasm_repository="https://github.com/jadh4v/ITK-Wasm"
#wasm_branch="dicom-seg"

echo "itk_repository = $itk_repository"
echo "itk_branch = $itk_branch"
echo "wasm_repository = $wasm_repository"
echo "wasm_branch = $wasm_branch"

mkdir $work_dir

cd $work_dir

git clone  $itk_repository --branch=$itk_branch

git clone $wasm_repository --branch=$wasm_branch

#dcmtk_repository="https://github.com/jadh4v/DCMTK.git"
#dcmtk_tag="62ebb7bb6e9ffb5311ff0f7baaa935b9b85296ec"
#echo "dcmtk_repository = $dcmtk_repository"
#echo "dcmtk_tag = $dcmtk_tag"

#sed -i -e '/^set(DCMTK_GIT_REPOSITORY/c\set(DCMTK_GIT_REPOSITORY "'$dcmtk_repository'")' \
#    ITK/Modules/ThirdParty/DCMTK/DCMTKGitTag.cmake

#sed -i -e '/^set(DCMTK_GIT_TAG/c\set(DCMTK_GIT_TAG "'$dcmtk_tag'")' \
#    ITK/Modules/ThirdParty/DCMTK/DCMTKGitTag.cmake

