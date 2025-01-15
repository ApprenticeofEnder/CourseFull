#!/bin/bash -e
export COURSEFULL_ENV=Prod

OP_SERVICE_ACCOUNT_TOKEN=$(cat /run/secrets/op_service_account_token) \
  op run --env-file='.env.tpl' -- \
  node server.js