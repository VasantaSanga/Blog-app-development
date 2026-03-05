#!/bin/bash
set -e

cd /var/app/staging
npx prisma migrate deploy
