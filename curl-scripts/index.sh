#!/bin/sh
# 3945fd04ecfa636e0171b5e164e2de35
API="http://localhost:4741"
URL_PATH="/vocabs"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo