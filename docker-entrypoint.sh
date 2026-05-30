#!/bin/sh
set -e
npx prisma db push
exec node_modules/.bin/next start
