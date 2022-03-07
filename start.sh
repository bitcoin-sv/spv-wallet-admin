#!/usr/bin/env bash

ADDRESS=`echo -n \`ifconfig en0 2>/dev/null|awk '/inet / {print $2}'\``

meteor yarn install --no-optional
ROOT_URL="http://${ADDRESS}:3069" meteor run --exclude-archs web.browser.legacy --port 3069 --settings settings.json
