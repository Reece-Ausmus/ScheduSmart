# this file manage all routing system in flask
import traceback

# To make code clean, please make
# each route that serve the same object have the same variable_name

# To test the code, I recommend using postman app to see what is going on
from flask import Blueprint, request, jsonify
from fire_base import *

account = Blueprint('login', __name__)
language = Blueprint('language', __name__)
events = Blueprint('events_controller', __name__)


@events.route('/get_events', methods=['POST'])
def get_events():
    calendar = request.get_json()
    ret = f_get_events(calendar)
    if ret == 1:
        response = jsonify({'response': 'fail retrieve events'})
        response.status_code = 205
    else:
        response = jsonify(ret)
        response.status_code = 201
    return response


@language.route('/set_language', methods=['POST'])
def set_language():
    data = request.get_json()
    response = jsonify({'message': 'fail'})
    response.status_code = 202
    try:
        if update_language(data) == 0:
            response = jsonify({'message': 'Done'})
            response.status_code = 201
    except:
        pass
    return response


@language.route('/get_language', methods=['POST'])
def get_language():
    data = request.get_json()
    response = jsonify({'message': 'fail'})
    response.status_code = 202
    try:
        data = get_user(data)
        if data["return_status"] == 0:
            response = jsonify(data["language"])
            response.status_code = 201
    except Exception as e:
        print("crash in get language")
    return response
