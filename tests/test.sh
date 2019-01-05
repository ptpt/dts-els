#!/bin/sh

curl -s https://raw.githubusercontent.com/elastic/examples/master/Common%20Data%20Formats/twitter/twitter_template.json | jq .mappings.tweets.properties | node index.js --array=entities Tweet > tests/Tweet.d.ts
tsc tests/main.ts