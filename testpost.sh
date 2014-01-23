#!/bin/bash
echo "curling..."

curl -i -X POST -H 'Content-Type: application/json' -d '{"link": "1234567891", "lat" : "40.479732600", "long"  : "-3.5898299",  "comment": "'"$1"'", "sender": "0", "destination": "0" }' http://www.jarne.com/msg/write
