API="http://localhost4741"
URL_PATH:"/words"

curl "" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --data '{
    "word": {
      "definition": "'"${DEFINITION}"'",
      "sentence": "'"${SENTENCE}"'",
      "pronunciation": "'"${PRONUNCIATION}"'",
      "comfort_level": "'"${COMFORT LEVEL}
    }
  }'

echo