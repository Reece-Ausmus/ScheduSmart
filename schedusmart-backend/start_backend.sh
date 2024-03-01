#!/bin/bash

#install dependencies
pip install -r requirements.txt > /dev/null

#start flask
flask --app server.py run
