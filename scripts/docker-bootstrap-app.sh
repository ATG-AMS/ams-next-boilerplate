#!/bin/sh
# ENVIRONEMTN from docker-compose.yaml doesn't get through to subprocesses
# Need to explicit pass DATABASE_URL here, otherwise migration doesn't work
# Run migrations
DATABASE_URL="file:./prisma/dev.db" npx prisma generate
# start app
DATABASE_URL="file:./prisma/dev.db" NEXT_PUBLIC_API_URI=https://next-boilerplate.atgams.com/api node server.js
