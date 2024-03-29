from flask import Blueprint, request, jsonify
from fire_base import *

calendar = Blueprint('calendar', __name__)


# to create an account, reach this route and send a json message with the following formate
# {"username":"<user_name>", "password":"<password>", ""}
@calendar.route('/create_calendar', methods=['POST'])
def create_calendar():
    receive_calendar = request.get_json()
    try:
        response = add_new_calendar(receive_calendar)
        ret = response['response_status']
        if ret == 1:
            response = jsonify({'error': 'calendar not created'})
            response.status_code = 205
        elif ret == 2:
            response = jsonify({'error': 'calendar not added to user'})
            response.status_code = 207
        else:
            response = jsonify({'calendar_id': response['calendar_id']})
            response.status_code = 201
    except:
        traceback.print_exc()
        response = jsonify({'error': 'missing information'})
        response.status_code = 206
    return response


@calendar.route('/create_event', methods=['POST'])
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

@calendar.route('/invite_users_to_event', methods=['POST'])
def invite_users_to_event():
    receive_event = request.get_json()
    try:
        ret = invite_users_to_event_db(receive_event)
        status = ret['response_status']
        if status == 1:
            response = jsonify({'error': 'invitation not created'})
            response.status_code = 205
        else:
            response = jsonify({'message': 'Done'})
            response.status_code = 201
    except:
        traceback.print_exc()
        response = jsonify({'error': 'missing information'})
        response.status_code = 206
    return response

@calendar.route('/get_invitations', methods=['POST'])
def get_invitations():
    receive_user = request.get_json()
    try:
        ret = get_invitations_db(receive_user)
        status = ret['response_status']
        if status == 1:
            response = jsonify({'error': 'invitation not retrieved'})
            response.status_code = 205
        else:
            response = jsonify(ret)
            response.status_code = 201
    except:
        traceback.print_exc()
        response = jsonify({'error': 'missing information'})
        response.status_code = 206
    return response

@calendar.route('/accept_invitation', methods=['POST'])
def accept_invitation():
    receive_user = request.get_json()
    try:
        ret = accept_invitation_db(receive_user)
        status = ret['response_status']
        if status == 1:
            response = jsonify({'error': 'invitation not accepted'})
            response.status_code = 205
        else:
            response = jsonify({'message': 'Done'})
            response.status_code = 201
    except:
        traceback.print_exc()
        response = jsonify({'error': 'missing information'})
        response.status_code = 206
    return response

@calendar.route('/decline_invitation', methods=['POST'])
def decline_invitation():
    receive_user = request.get_json()
    try:
        ret = decline_invitation_db(receive_user)
        status = ret['response_status']
        if status == 1:
            response = jsonify({'error': 'invitation not declined'})
            response.status_code = 205
        else:
            response = jsonify({'message': 'Done'})
            response.status_code = 201
    except:
        traceback.print_exc()
        response = jsonify({'error': 'missing information'})
        response.status_code = 206
    return response

@calendar.route('/get_events', methods=['POST'])
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


@calendar.route('/update_task', methods=['POST'])
def update_task_list():
    receive_event = request.get_json()
    try:
        ret = update_task(receive_event)
        if ret == 1:
            response = jsonify({'error': 'task not updated'})
            response.status_code = 205
        else:
            response = jsonify({'message': 'Done'})
            response.status_code = 201
    except:
        traceback.print_exc()
        response = jsonify({'error': 'missing information'})
        response.status_code = 206
    return response


@calendar.route('/mark_done', methods=['POST'])
def mark_task_done():
    task = request.get_json()
    mark_task_as_done(task)
    response = jsonify({'message': 'done'})
    response.status_code = 200
    return response


# this is to retrieve calendar default mode
@calendar.route('/get_calendar_default_mode', methods=['POST'])
def get_calendar_default_mode():
    receive_user = request.get_json()
    # if receive_user['userId'] != 'O4eABYSFUxNTJgUSfRogsY6D7Eh2':
    #    response = jsonify({'message': 'Done'})
    #    response.status_code = 206
    #    return

    data = get_default_calendar_type(receive_user['user_id'])
    response = jsonify({'type': data})
    response.status_code = 201

    return response


@calendar.route('/update_calendar_format', methods=['POST'])
def update_calendar_format():
    info = request.get_json()
    try:
        ret = update_default_calendar_type(info)
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


# this is to retrieve calendar default mode
@calendar.route('/set_amount_of_time', methods=['POST'])
def set_amount_of_time():
    receive_user = request.get_json()
    uid = receive_user['userId']
    time = receive_user['time']
    '''
    if uid == 'Sup3XDcQrNUm6CGdIJ3W5FHyPpQ2':
        response = jsonify({'available': 60})
        response.status_code = 205
        return response

    if time == 15:
        response = jsonify({'available': 60})
        response.status_code = 208
        return response

    if uid == 'Sup3XDcQrNUm6CGdIJ3W5FHyPpQ2' and time == '15':
        response = jsonify({'available': 60})
        response.status_code = 201
        return response
    '''


@calendar.route('/upload', methods=['POST'])
def upload_file():
    response = jsonify({'message': 'success', "status": 0})
    return response
