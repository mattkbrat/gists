#!/bin/bash

echo "running at $PWD"

if [ ! -f ".env" ]; then
      echo "Missing .env file. Please ensure you run the script from the project directory and have pulled the env from dotenv."
      exit 1
fi

if [ ! -f ".env.local" ]; then
      echo "Missing .env.local file. Read the README to learn how to generate."
      exit 1
fi

export $(cat .env | xargs)
export $(cat .env.local | xargs)

if [ -z "$PROJECT_DIRECTORY" ]; then
  echo "Missing env variable PROJECT_DIRECTORY."
  exit 1
fi

WORKING_DIRECTORY="$HOME/$PROJECT_DIRECTORY"

TEMP_FILE="${WORKING_DIRECTORY}/env-temp.json"
DEV_ENV_PATH="${WORKING_DIRECTORY}/.env.dev"
WEB_DIRECTORY="${WORKING_DIRECTORY}/apps/web"

if [ ! -d "$WEB_DIRECTORY" ]; then
  echo "$WEB_DIRECTORY does not exist."
  exit 1
fi

WEB_ENV_PATH="$WEB_DIRECTORY/.env.local"

if [ ! -f $TEMP_FILE ]; then

  if [ -z "$VAULT_TOKEN" ]; then
      echo "variable VAULT_TOKEN is empty."
      exit 1
  fi

  if [ -z "$VAULT_URL" ]; then
      echo "variable VAULT_URL is empty."
      exit 1
  fi

  if [ -z "$VAULT_SECRETS_PATH" ]; then
      echo "variable VAULT_SECRETS_PATH is empty."
      exit 1
  fi

  SECRETS_PATH="$VAULT_URL/v1/${VAULT_SECRETS_PATH}"
  wget --quiet --header="X-Vault-Token: "$VAULT_TOKEN \
    --output-document=$TEMP_FILE \
    $SECRETS_PATH

  cat $TEMP_FILE | jq '.data.data' > "${TEMP_FILE}_2.json"
  mv "${TEMP_FILE}_2.json" $TEMP_FILE

else
  echo "Using existing temp file at $TEMP_FILE"

fi

# Write key:value pairs to $ENV_DEV_FILE
echo "Writing public env FROM $SECRETS_PATH to $DEV_ENV_PATH"
cat $TEMP_FILE | jq 'with_entries(select(.key | startswith("NEXT_PUBLIC")))' | jq -r 'to_entries|map("\(.key)=\(.value|tostring)")|.[]' > $DEV_ENV_PATH

# Write key:key references pairs to $WEB_ENV_PATH
echo "SETTING POINTERS FROM $DEV_ENV_PATH to $WEB_ENV_PATH"
cat $TEMP_FILE | jq 'with_entries(select(.key | startswith("NEXT_PUBLIC")))' | jq -r 'to_entries|map("\(.key)=\"${\(.key)}\"")|.[]' > $WEB_ENV_PATH

rm $TEMP_FILE
