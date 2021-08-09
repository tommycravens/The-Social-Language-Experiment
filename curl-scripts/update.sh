API="http://localhost:4741"
URL_PATH="/vocabs"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
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