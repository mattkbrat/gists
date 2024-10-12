#!/bin/bash

SOURCE_DIR="/tmp/project-dir"

BACKUP_FILESIZE_FILE="./new_database_size.txt"
SOURCE_FILE="${SOURCE_DIR}/database.sqlite3"

CURRENT_FILESIZE=`cat $BACKUP_FILESIZE_FILE`
du -s "$SOURCE_FILE" | awk '{print $1}' > "${BACKUP_FILESIZE_FILE}"
NEW_FILESIZE=`cat $BACKUP_FILESIZE_FILE`

if [[ "$CURRENT_FILESIZE" == "$NEW_FILESIZE" ]]
then
  echo "filesizes match"
  exit 1
fi

NOW=$(date  +"%Y-%m-%dT%H%M%S%z")
BACKUP_FILENAME="backup_${NOW}.sq3.bak"
BACKUP_PATH="${SOURCE_DIR}/backup_${NOW}.sq3.bak"

sqlite3 $SOURCE_FILE ".backup ${BACKUP_PATH}"

mkdir "${SOURCE_DIR}/backups"
mv ${BACKUP_PATH} "${SOURCE_DIR}/backups"

