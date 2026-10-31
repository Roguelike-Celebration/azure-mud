# Exclusions for grin and findd tools

# shellcheck shell=bash

: "${RLC_GRIN_EXCLUDE_DIRS=node_modules:.parcel-cache:.git:CVS:.hg:.svn:venv:.venv:wp-includes:dist}"
: "${RLC_GRIN_EXCLUDE_FILES=*.ipynb}"

