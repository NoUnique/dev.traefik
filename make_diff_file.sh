#!/bin/bash

PATH_WORKSPACE=$(dirname $(realpath ${BASH_SOURCE}))
cd ${PATH_WORKSPACE}


TARGET=traefik-index
diff -wur --to-file=${TARGET}-modified ${TARGET} > ${TARGET}.patch

