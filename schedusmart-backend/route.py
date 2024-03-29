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
            response = jsonify({
                'error': 'user not found',
            })
            response.status_code = 202
        elif ret == 0:
            response = jsonify({
                'message': 'Done',
                'user_id': data['user_id'],
                'email': data['email'],
                'timezone': data['timezone'],
                'user_name': data['user_name'],
                'first_name': data['first_name'],
                'last_name': data['last_name'],
                'calendars': data['calendars'],
                'location': data['location'],
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


@account.route('/create_calendar', methods=['POST'])
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


@account.route('/create_event', methods=['POST'])
def create_event():
    receive_event = request.get_json()
    try:
        ret = add_new_event(receive_event)
        status = ret['response_status']
        if status == 1:
            response = jsonify({'error': 'event not created'})
            response.status_code = 205
        else:
            response = jsonify({'event_id': ret['event_id']})
            response.status_code = 201
    except:
        traceback.print_exc()
        response = jsonify({'error': 'missing information'})
        response.status_code = 206
    return response


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

@account.route('/update_task', methods=['POST'])
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


# this is to retrieve calendar default mode
@account.route('/get_calendar_default_mode', methods=['POST'])
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


@account.route('/update_calendar_format', methods=['POST'])
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

@account.route('/get_location_default_settings', methods=['POST'])
def get_location_default_settings():
    receive_user = request.get_json()
    data = get_default_location_settings(receive_user['user_id'])
    response = jsonify({'type': data})
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


# this is to retrieve calendar default mode
@account.route('/set_amount_of_time', methods=['POST'])
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

@account.route('/upload', methods=['POST'])
def upload_file():
    response = jsonify({'message': 'success', "status" : 0})
    return response

# This route is for adding habits
@account.route('/add_habit', methods=['POST'])
def add_habit():
    data = request.get_json()
    try:
        result = add_new_habit(data)
        if result == 0:
            response = jsonify({'message': 'Habit added successfully'})
            response.status_code = 201
        else:
            response = jsonify({'error': 'Failed to add habit'})
            response.status_code = 400
    except Exception as e:
        response = jsonify({'error': 'An error occured'})
        response.status_code = 500
    return response

# This route is for updating habits
@account.route('/update_habit', methods=['POST'])
def update_habit():
    data = request.get_json()
    user_id = data['user_id']
    edited_item = data['editedItem']
    old_item_name = data['old_item_name']  # Previous itemName
    new_item_name = edited_item['itemName']  # New itemName

    # Construct the Firebase path for the habit to be updated
    habit_path = f"/Habits/{user_id}/{old_item_name}"

    # Update the habit data in Firebase
    try:
        # If the itemName has changed, delete the old folder and create a new one
        if old_item_name != new_item_name:
            # Read the data from the old path
            old_habit_data = db.child(habit_path).get().val()

            # Delete the old folder
            db.child(habit_path).remove()

            # Construct the Firebase path for the new habit location
            new_habit_path = f"/Habits/{user_id}/{new_item_name}"

            # Write the data to the new folder
            db.child(new_habit_path).set(old_habit_data)
        else:
            # If itemName remains the same, update the existing folder without the itemName field
            db.child(habit_path).update({k: v for k, v in edited_item.items() if k != 'itemName'})

        return jsonify({'message': 'Habit updated successfully'}), 200
    except Exception as e:
        print("Failed to update habit:", e)
        return jsonify({'error': 'Failed to update habit'}), 500

# This route is for deleting habits
@account.route('/delete_habit', methods=['POST'])
def delete_habit():
    data = request.get_json()
    user_id = data.get('user_id')
    item_name = data.get('item_name')
    
    if not user_id or not item_name:
        return jsonify({'error': 'User ID and habit ID are required parameters'}), 400

    # Construct the Firebase path to the habit
    habit_path = f"/Habits/{user_id}/{item_name}"

    # Delete the habit from the Firebase database
    try:
        db.child(habit_path).remove()
        return jsonify({'message': 'Habit deleted successfully'}), 200
    except Exception as e:
        print("Failed to delete habit:", e)
        return jsonify({'error': 'Failed to delete habit'}), 500
    
# This route is for getting all habits for a user
@account.route('/get_habits', methods=['POST'])
def get_habits():
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    # Construct the Firebase path to the user's habits
    user_habits_path = f"/Habits/{user_id}"

    try:
        # Get all habits for the user from the Firebase database
        user_habits = db.child(user_habits_path).get()
        
        # If the user has no habits, return an empty list
        if not user_habits.val():
            return jsonify({'habits': []}), 200
        
        # Convert Firebase response to list of habits
        habits_list = []
        for habit_name, habit_data in user_habits.val().items():
            habit_data['itemName'] = habit_name
            habits_list.append(habit_data)
        
        return jsonify({'habits': habits_list}), 200
    except Exception as e:
        print("Failed to get habits:", e)
        return jsonify({'error': 'Failed to get habits'}), 500