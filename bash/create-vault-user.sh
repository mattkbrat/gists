#!/bin/bash

set -e

Organization=""

Usage() {
  echo "usage: $0 app -u USERNAME -p PASSWORD"
}
Help() {
  # Display Help
  echo "Creates a service account for the hashicorp vault"
  echo "Grants access to secret storage matching the passed username."
  echo "Reference: https://developer.hashicorp.com/vault/tutorials/auth-methods/identity?variants=vault-deploy%3Aselfhosted"
  echo
  Usage
}

# Check that the vault env variables are set

if [ -z "$VAULT_ADDR" ]; then
  echo "Missing env variable VAULT_ADDR."
  exit 1
fi

if [ -z "$VAULT_TOKEN" ]; then
  echo "Missing env variable VAULT_TOKEN."
  exit
fi

Service_Password=""
Service_Username=""

# Get the options
while getopts "p:u:h" option; do
  case $option in
  h) # display Help
    Help
    exit 0
    ;;
  \?) # Invalid option
    Usage
    exit 0
    ;;
  p) # set password
    Service_Password=$OPTARG
    ;;
  u) # set username
    if [ -z "$OPTARG" -a "$OPTARG" == " " ]; then
      echo "Missing username argument ($OPTARG)"
      Usage
      exit 1
    fi
    Service_Username=$OPTARG
    ;;
  esac
done

if [[ ! -n "$Service_Username" ]]; then
  echo "Missing username argument ($Service_Username)"
  Usage
  exit 1
fi

if [[ ! -n "$Service_Password" ]]; then
  echo "Missing password argument"
  Usage
  exit 1
fi

echo "Creating new service account with password $Service_Password and username $Service_Username"

# exit 2

service_group=userpass-service
policy_group="team-${Service_Username}"

echo $service_account

# Check that the service group login method exists, and create if not.

auth_list="$(vault auth list)"

if ! [[ $auth_list == *"${service_group}"* ]]; then
  echo "Creating new service_group $service_group"
  vault auth enable -path="${service_group}" userpass
else
  echo "$service_group exists"
fi

userpass_accessor="$(vault auth list -format=json | jq -r '.["'${service_group}'/"].accessor')"

if [[ ! -n "$userpass_accessor" ]]; then
  echo "userpass accessor failed to set, is null or space"
  exit 2
else
  echo "userpass accessor: $userpass_accessor"
fi

# Check if the service account policy exists, and create if not.

Existing_Policies="$(vault policy list)"

if ! [[ $Existing_Policies == *"${policy_group}"* ]]; then
  echo "Creating new policy $policy_group"
  vault policy write "${policy_group}" - <<EOF
path "secret/data/${Service_Username}" {
   capabilities = [ "create", "read", "update", "delete" ]
}
EOF
else
  echo "$policy_group exists."
fi

# Check entity alias to determine if the service account exists

# entities="$(vault read -format=json identity/entity/id/$userpass_accessor | jq -r ".data")"
entity_id="$(vault list -detailed identity/entity/id | grep $Service_Username | head --lines=1 | awk '{print $1}')"

if [[ ! -n "$entity_id" ]]; then
  echo "Creating new service user $Service_Username"

  entity_id="$(
    vault write -format=json identity/entity name="${Service_Username}" policies="${policy_group}" \
      metadata=organization="$Organization" \
      metadata=team="Service" |
      jq -r ".data.id"
  )"
else
  echo "$Service_Username exists."
fi

if [[ ! -n "$entity_id" ]]; then
  echo "entity id failed to set, is null or space"
  exit 3
fi

# account_aliases="$(vault read identity/entity-alias/id/$userpass_accessor)"

echo "updating password"

vault write "auth/${service_group}/users/${Service_Username}" password="${Service_Password}" policies="${policy_group}"

echo "writing alias $entity_id (orig. $entity_id) to $userpass_accessor"

vault write identity/entity-alias name="${Service_Username}" \
  canonical_id=$entity_id \
  mount_accessor=$userpass_accessor
