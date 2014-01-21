#!/bin/bash

curl -i -X PUT -H 'Content-Type: application/json' -d '{"creator": '\"$1\"', "creatortype": "android"}' http://www.jarne.com/msg/openlink

echo "////" & echo ""



