#!/bin/bash

PATH_WORKSPACE=$(dirname $(realpath ${BASH_SOURCE}))
cd ${PATH_WORKSPACE}


TARGET=traefik-index
cd ${TARGET}
diff -wur --to-file=modified original > ../${TARGET}.patch

