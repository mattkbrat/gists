#!/bin/bash

# Check requirements
# - mp4
# - youtube-dl

for prog in youtube-dl mpv
do
    if ! command -v $prog 2>&1 >/dev/null
    then
        echo "$prog could not be found"
        exit 1
    fi
done


if [ $# -ne 1 ]; then
    echo "Usage: $0 [video_id]"
    exit 1
fi

VIDEO=$1

if [[ "$VIDEO" == *"www.twitch.tv"* ]]; then
    echo "includes url"
    arrIN=(${VIDEO##*/})
    echo "$arrIN"
    VIDEO=${arrIN}
fi;

echo "streaming video ID $VIDEO with MPV and youtube-dl."

youtube-dl -g "https://www.twitch.tv/videos/${VIDEO}" | xargs -I{} mpv {} --save-position-on-quit=yes

echo "All done"
