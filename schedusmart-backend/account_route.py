from flask import Blueprint, request, jsonify
from fire_base import *

account = Blueprint('account', __name__)


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
            response = jsonify({
                'error': 'user not found',
            })
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
                'timezone': data['timezone'],
                'task_list': data['task_list'],
            })
            response.status_code = 201
    except:
        traceback.print_exc()
        response = jsonify({
            'message': 'fail',
        })
        response.status_code = 201
    return response


@account.route('/update_location_settings', methods=['POST'])
def update_location_settings():
    info = request.get_json()
    try:
        ret = update_default_location_settings(info)
        if ret == 1:
            response = jsonify({'error': 'location settings can not be changed'})
            response.status_code = 205
        else:
            response = jsonify({'message': 'Done'})
            response.status_code = 201
    except:
        traceback.print_exc()
        response = jsonify({'error': 'missing information'})
        response.status_code = 206
    return response

@account.route('/get_location_default_settings', methods=['POST'])
def get_location_default_settings():
    receive_user = request.get_json()
    data = get_default_location_settings(receive_user['user_id'])
    response = jsonify({'type': data})
    response.status_code = 201
    return response


@account.route('/update_account_info', methods=['POST'])
def update_account_info():
    info = request.get_json()
    try:
        ret = update_user_info(info)
        if ret == 1:
            response = jsonify({'error': 'update info failed'})
            response.status_code = 205
        else:
            response = jsonify({'message': 'Done'})
            response.status_code = 201
    except:
        response = jsonify({'error': 'missing information'})
        response.status_code = 206
    return response
