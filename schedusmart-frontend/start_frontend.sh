#!/bin/bash

#remove outdated info
rm -rf node_modules/.vite >/dev/null 2>/dev/null

npm run dev
