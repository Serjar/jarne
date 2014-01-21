#!/bin/bash

curl -i -X POST -H 'Content-Type: application/json' -d '{"code":'$1', "user": "12", "usertype": "android"}' http://www.jarne.com/msg/joinlink

echo "////" & echo ""



