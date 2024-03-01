#!/bin/bash

#install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt > /dev/null

#start flask
flask --app server.py run
