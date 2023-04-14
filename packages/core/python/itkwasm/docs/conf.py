# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'itkwasm'
copyright = '2023, NumFOCUS'
author = 'Matt McCormick'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = ['sphinx.ext.napoleon', 'sphinx.ext.autodoc']

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']



# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'pydata_sphinx_theme'
html_static_path = ['_static']

html_theme_options = {
    "use_edit_page_button": True,
    "github_url": "https://github.com/InsightSoftwareConsortium/itk-wasm",
}

html_context = {
    "github_user": "InsightSoftwareConsortium",
    "github_repo": "itk-wasm",
    "github_version": "main",
    "doc_path": "packages/core/python/itkwasm/docs",
}