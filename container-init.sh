#!/bin/bash

function fn_main() {
    fn_set_env
}

function fn_install_jq() {
    if ! command -v jq &> /dev/null; then
        sudo apt -qq install -y jq
    fi
}

function fn_set_env() {
    fn_install_jq
    export HOSTNAME=${HOSTNAME}
    export HOSTBRIDGE_IP=$(docker network inspect bridge | jq --raw-output .[0].IPAM.Config[0].Gateway)
}

fn_main