# this file manage all routing system in flask
import traceback

# To make code clean, please make
# each route that serve the same object have the same variable_name

# To test the code, I recommend using postman app to see what is going on
from flask import Blueprint, request, jsonify
from fire_base import *

account = Blueprint('login', __name__)
language = Blueprint('language', __name__)

# to create an account, reach this route and send a json message with the following formate
# {"username":"<user_name>", "password":"<password>", ""}
@account.route('/create_account', methods=['POST'])
def create_account():
    receive_account = request.get_json()
    try:
        data = create_account_by_username_and_password(receive_account)
        ret = data['response_status']
        if ret == 2:
            response = jsonify({'error': 'username has been used'})
            response.status_code = 205
        elif ret == 1:
            response = jsonify({'error': 'failed to create account'})
            response.status_code = 206
        else:
            response = jsonify({
            'message': 'Done',
            'user_id': data['user_id']
        })
        response.status_code = 201
    except:
        response = jsonify({'error': 'failed to create account'})
        response.status_code = 206
    return response


# this is where you modify login method
@account.route('/login', methods=['POST'])
def login():
    receive_account = request.get_json()
    
    data = login_account_with_email_and_password(receive_account)
    ret = data['return_status']
    if ret == 1:
        response = jsonify({'error': 'invalid email or password'})
        response.status_code = 205
    elif ret == 3:
        response = jsonify({'error': 'Please verify your email'})
        response.status_code = 206
    else:
        response = jsonify({
            'message': 'Done',
            'user_id': data['user_id']
        })
        response.status_code = 201
    return response

@account.route('/user_data', methods=['POST'])
def user_data():
    receive_user = request.get_json()
    try: 
        data = get_user(receive_user)
        ret = data['return_status']
        if ret == 1:
            response = jsonify({'error': 'user not found'})
            response.status_code = 202
        elif ret == 0:
            response = jsonify({
            'message': 'Done',
            'user_id': data['user_id'],
            'email': data['email'],
            'user_name': data['user_name'],
            'first_name': data['first_name'],
            'last_name': data['last_name'],
            'calendars': data['calendars'],
            'location': data['location'],
            })
            response.status_code = 201
    except:
        traceback.print_exc()
        response = jsonify({'error': 'missing information'})
        response.status_code = 205
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

@account.route('/create_event', methods=['POST'])
def create_event():
    receive_event = request.get_json()
    try:
        ret = add_new_event(receive_event)
        if ret == 1:
            response = jsonify({'error': 'event not created'})
            response.status_code = 205
        else:
            response = jsonify({'message': 'Done'})
            response.status_code = 201
    except:
        traceback.print_exc()
        response = jsonify({'error': 'missing information'})
        response.status_code = 206
    return response

# this is to retireve calendar default mode
@account.route('/get_calendar_default_mode', methods=['POST'])
def get_calendar_default_mode():
    receive_user = request.get_json()
    if receive_user['userId'] != 'O4eABYSFUxNTJgUSfRogsY6D7Eh2':
        response = jsonify({'message': 'Done'})
        response.status_code = 206
        return

    data = get_default_calendar_type(receive_user['userId'])
    response = jsonify({'type':data})
    response.status_code = 201

    return response

@account.route('/update_format', methods=['POST'])
def update_calendar_format():
    info = request.get_json()
    try:
        ret = update_format(info)
        if ret == 1:
            response = jsonify({'error': 'calendar format can not be changed'})
            response.status_code = 205
        else:
            response = jsonify({'message': 'Done'})
            response.status_code = 201
    except:
        traceback.print_exc()
        response = jsonify({'error': 'missing information'})
        response.status_code = 206
    return response

@account.route('/update_account_info', methods=['POST'])
def update_account_info():
    info = request.get_json()
    try:
        ret = update_user_info(info)
        if ret == 1:
            response = jsonify({'error' : 'update info failed'})
            response.status_code = 205
        else:
            response = jsonify({'message' : 'Done'})
            response.status_code = 201
    except:
        traceback.print_exc()
        response = jsonify({'error': 'missing information'})
        response.status_code = 206
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