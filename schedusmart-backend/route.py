# this file manage all routing system in flask
import traceback

# To make code clean, please make
# each route that serve the same object have the same variable_name

# To test the code, I recommend using postman app to see what is going on
from flask import Blueprint, request, jsonify
from fire_base import *

account = Blueprint('login', __name__)


# to create an account, reach this route and send a json message with the following formate
# {"username":"<user_name>", "password":"<password>", ""}
@account.route('/create_account', methods=['POST'])
def create_account():
    receive_account = request.get_json()
    try:
        ret = create_account_by_username_and_password(receive_account)
        if ret == 1:
            return 'username has been used', 205
    except:
        traceback.print_exc()
        return 'missing information', 206
    return 'Done', 201


# this is where you modify login method
@account.route('/login', methods=['POST'])
def login():
    receive_account = request.get_json()
    
    data = login_account_with_email_and_password(receive_account)
    ret = data['return_status']
    if ret == 1:
        response = jsonify({'error': 'invalid email or password'})
        response.status_code = 205
    else:
        response = jsonify({
            'message': 'Done',
            'user_id': data['user_id']
        })
        response.status_code = 201
    return response


@account.route('/create_calendar', methods=['POST'])
def create_calendar():
    receive_calendar = request.get_json()
    try:
        ret = add_new_calendar(receive_calendar)
        if ret == 1:
            response = jsonify({'error': 'calendar not created'})
            response.status_code = 205
        elif ret == 2:
            response = jsonify({'error': 'calendar not added to user'})
            response.status_code = 207
        else:
            response = jsonify({'message': 'Done'})
            response.status_code = 201
    except:
        traceback.print_exc()
        response = jsonify({'error': 'missing information'})
        response.status_code = 206
    return response


@account.route('/user_data', methods=['GET'])
def user_data():
    return jsonify(
        message="This is jsonify",
        date="November 11, 2021",
        id="10",
    )