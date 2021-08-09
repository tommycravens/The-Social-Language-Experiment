API="http://localhost:4741"
URL_PATH="/vocabs"
# 3945fd04ecfa636e0171b5e164e2de35
# TOKEN="3945fd04ecfa636e0171b5e164e2de35" DEFINITION="Car" SENTENCE="El coche es en la calle" PRONUNCIATION="koche" COMFORT_LEVEL="3" WORD="coche" sh curl-scripts/create.sh
curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "vocab": {
      "word": "'"${WORD}"'",
      "definition": "'"${DEFINITION}"'",
      "sentence": "'"${SENTENCE}"'",
      "pronunciation": "'"${PRONUNCIATION}"'",
      "comfortLevel": "'"${COMFORT_LEVEL}"'"
    }
  }'

echo
