#!/bin/bash

#install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt > /dev/null 2> /dev/null

#start flask
flask --app server.py run
