#!/bin/sh

export ANT_MYSQL_HOST=127.0.0.1
export ANT_MYSQL_PORT=3000
export ANT_MYSQL_USER=user
export ANT_MYSQL_PASSWORD=password

sleep 1

/node_modules/ergate-cli/bin/index.js