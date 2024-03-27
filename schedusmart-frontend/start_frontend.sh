#!/bin/bash

#clear terminal
clear

#remove outdated info
rm -rf node_modules/.vite >/dev/null 2>/dev/null

#start server
npm run dev
