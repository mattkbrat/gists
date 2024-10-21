#!/bin/bash

# Define backup directory
backup_dir="/data/backups/postgres"

# Create backup file name with timestamp
backup_file="dump_$(date +"%m-%d-%Y_%H_%M_%S").gz"

# Full backup file path
backup_path="$backup_dir/$backup_file"

# Run pg_dumpall and compress the output

docker exec -t postgres pg_dumpall -c -U postgres | gzip >"$backup_path"

# Delete all but the second oldest backup
find "$backup_dir/" -maxdepth 1 -name '*.gz' -mtime +14 | xargs -t -I {} rm {}

echo 'Successfully created PostgreSQL backup'
