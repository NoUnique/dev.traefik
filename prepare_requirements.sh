#!/bin/bash

PATH_WORKSPACE=$(dirname $(realpath ${BASH_SOURCE}))
cd ${PATH_WORKSPACE}


# Step1: download certification keys from router
ADDRESS_ROUTER=router.asus.com
DIR_SECRET=secrets

#scp ${ADDRESS_ROUTER}:/tmp/cert_key.tar ./
wget --no-check-certificate https://router.asus.com:8443/cert_key.tar
mkdir -p ${DIR_SECRET}
tar -xvf cert_key.tar -C ${DIR_SECRET}
rm -f cert_key.tar

# Step2: make username & password for HTTP basic auth
USERNAME=${USER}
HASHED_PASSWORD=$(openssl passwd -apr1)
echo "${USER}:${HASHED_PASSWORD}" > ./${DIR_SECRET}/basic-auth

