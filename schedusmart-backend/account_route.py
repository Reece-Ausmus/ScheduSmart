from flask import Blueprint, request, jsonify
from fire_base import *
from friendManage import *

account = Blueprint('account', __name__)


@account.route('/create_account', methods=['POST'])
def create_account():
    receive_account = request.get_json()
    try:
        data = create_account_by_username_and_password(receive_account)

        response = jsonify(data)
        response.status_code = 201
    except Exception as e:
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
            'user_id': data['user_id'],
            'first_time': data['first_time']
        })
        response.status_code = 201
    return response


# Route to handle password reset requests
@account.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')

    try:
        auth.send_password_reset_email(email)
        return jsonify({'message': 'Password reset email sent successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@account.route('/user_data', methods=['POST'])
def user_data():
    receive_user = request.get_json()
    response = jsonify({
        'message': 'fail',
    }), 201
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
                'language': data['language'],
                'chat_log': data['chat_log'],
                'system_color':data['system_color'],
                'first_time': data['first_time'],
                'chat_log': data['chat_log']
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


# This route is for adding exercises
@account.route('/add_exercise', methods=['POST'])
def add_exercise():
    data = request.get_json()
    try:
        result = add_new_exercise(data)
        if result == 0:
            response = jsonify({'message': 'Exercise added successfully'})
            response.status_code = 201
        else:
            response = jsonify({'error': 'Failed to add exercise'})
            response.status_code = 400
    except Exception as e:
        response = jsonify({'error': 'An error occured'})
        response.status_code = 500
    return response


# This route is for getting all exercises for a user
@account.route('/get_exercises', methods=['POST'])
def get_exercises():
    data = request.get_json()
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    # Construct the Firebase path to the user's exercises
    user_exercises_path = f"/Exercise/{user_id}"

    try:
        # Get all exercises for the user from the Firebase database
        user_exercises = db.child(user_exercises_path).get()

        # If the user has no exercises, return an empty list
        if not user_exercises.val():
            return jsonify({'exercises': []}), 200

        # Convert Firebase response to list of exercises
        exercises_list = []
        for event_name, exercise_data in user_exercises.val().items():
            exercise_data['eventName'] = event_name
            exercises_list.append(exercise_data)

        return jsonify({'exercises': exercises_list}), 200
    except Exception as e:
        print("Failed to get exercises:", e)
        return jsonify({'error': 'Failed to get exercises'}), 500
    
# This route is for deleting exercises
@account.route('/delete_exercise', methods=['POST'])
def delete_exercise():
    data = request.get_json()
    user_id = data.get('user_id')
    event_name = data.get('event_name')

    selected_exercise_id = data.get('id')

    if not user_id or not event_name:
        return jsonify({'error': 'User ID and exercise ID are required parameters'}), 400

    # Construct the Firebase path to the exercise
    exercise_path = f"/Exercise/{user_id}/{event_name}"
    
    # Delete the exercise from the Firebase database
    try:
        db.child(exercise_path).remove()    
        return jsonify({'message': 'Exercise deleted successfully'}), 200
    except Exception as e:
        print("Failed to delete exercise:", e)
        return jsonify({'error': 'Failed to delete exercise'}), 500

@account.route('/get_highest_exercise_id', methods=['POST'])
def get_highest_exercise_id():
    data = request.get_json()
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    # Construct the Firebase path to the user's exercises
    user_exercises_path = f"/Exercise/{user_id}"

    try:
        # Get all exercises for the user from the Firebase database
        user_exercises = db.child(user_exercises_path).get()

        # If the user has no exercises, return an empty list
        if not user_exercises.val():
            highest_id = 0
        else:
            # Get the highest exercise ID
            highest_id = max(int(exercise_data.get('id', 0)) for exercise_data in user_exercises.val().values())

        # Set the new event ID to the highest exercise ID + 1
        new_event_id = highest_id + 1

        return jsonify({'highest_id': new_event_id}), 200
    except Exception as e:
        print("Failed to get highest exercise ID:", e)
        return jsonify({'error': 'Failed to get highest exercise ID'}), 500


# This route is for setting the daily calorie goal
@account.route('/set_calorie_goal', methods=['POST'])
def set_calorie_goal():
    data = request.get_json()
    try:
        result = add_new_goal(data)
        if result == 0:
            response = jsonify({'message': 'Calorie goal set successfully'})
            response.status_code = 201
        else:
            response = jsonify({'error': 'Failed to set calorie goal'})
            response.status_code = 400
    except Exception as e:
        response = jsonify({'error': 'An error occured'})
        response.status_code = 500
    return response

# This route is for getting the daily calorie goal
@account.route('/get_calorie_goal', methods=['POST'])
def get_calorie_goal():
    data = request.get_json()
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    # Construct the Firebase path to the user's calorie goal
    user_goal_path = f"/Goals/{user_id}"

    try:
        # Get the user's calorie goal from the Firebase database
        user_goal = db.child(user_goal_path).get()

        # If the user has no calorie goal, return an empty list
        if not user_goal.val():
            return jsonify({'goal': []}), 200

        # Convert Firebase response to list of goals
        goal_list = []
        for date, goal_data in user_goal.val().items():
            goal_data['date'] = date
            goal_list.append(goal_data)

        return jsonify({'goal': goal_list}), 200
    except Exception as e:
        print("Failed to get calorie goal:", e)
        return jsonify({'error': 'Failed to get calorie goal'}), 500


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
    
# This route is for getting the highest habit ID
@account.route('/get_highest_habit_id', methods=['POST'])
def get_highest_habit_id():
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
            highest_id = 0
        else:
            # Get the highest habit ID
            highest_id = max(int(habit_data.get('id', 0)) for habit_data in user_habits.val().values())

        # Set the new habit ID to the highest habit ID + 1
        new_habit_id = highest_id + 1

        return jsonify({'highest_id': new_habit_id}), 200
    except Exception as e:
        print("Failed to get highest habit ID:", e)
        return jsonify({'error': 'Failed to get highest habit ID'}), 500


@account.route('/request_friend', methods=['POST'])
def request_friend():
    data = request.get_json()
    try:
        if not data["user_id"]:
            return jsonify({'error': 'User ID is required'}), 201
    except KeyError:
        return jsonify({'error': 'User ID is required'}), 201
    try:
        if not data["name"]:
            return jsonify({'error': 'require friend\'s username in name field'}), 201
    except KeyError:
        return jsonify({'error': 'require friend\'s username in name field'}), 201
    return jsonify(add_friend(data)), 201


@account.route('/get_friends', methods=['POST'])
def get_friend():
    data = request.get_json()
    try:
        if not data["user_id"]:
            return jsonify({'error': 'User ID is required'}), 201
    except KeyError:
        return jsonify({'error': 'User ID is required'}), 201
    return jsonify(get_friend_manager(data)), 201


@account.route('/confirm_friend', methods=['POST'])
def confirm_friend():
    data = request.get_json()
    try:
        if not data["user_id"]:
            return jsonify({"error": "user_id not provided"}), 201
        if not data["name"]:
            return jsonify({"error": "friend not provided"}), 201
        test = data["confirm"]

        return jsonify(confirm(data)), 201
    except KeyError:
        return jsonify({"error": "lack of information"}), 201


@account.route('/delete_friend', methods=['POST'])
def delete_friend():
    delete_data = request.get_json()
    try:
        if not delete_data["user_id"]:
            return jsonify({"error": "user_id not provided"}), 201
        if not delete_data["name"]:
            return jsonify({"error": "friend not provided"}), 201

        return jsonify(delete_amigos(delete_data)), 201
    except KeyError:
        return jsonify({"error": "lack of information"}), 201


@account.route('/search_user', methods=['POST'])
def search_user():
    data = request.get_json()
    try:
        if not data["name"]:
            return jsonify({"error": "search name can not be null"}), 201
        return jsonify(f_search_user(data["name"])), 201
    except KeyError:
        return jsonify({"error": "search can not be null"}), 201


@account.route("/send_message", methods=['POST'])
def send_message():
    message_data = request.get_json()
    try:
        if not message_data["user_id"]:
            return jsonify({"error": "user_id is required"}), 201
    except KeyError:
        return jsonify({"error": "user_id is required"}), 201
    try:
        if not message_data["name"]:
            return jsonify({"error": "friend's name is required"}), 201
    except KeyError:
        return jsonify({"error": "friend's name is required"}), 201
    try:
        if not message_data["message"]:
            return jsonify({"error": "message can not be null"}), 201
    except KeyError:
        return jsonify({"error": "message is required"}), 201

    return jsonify(add_message(message_data)), 201


@account.route('/get_messages', methods=['POST'])
def get_messages():
    request_message_data = request.get_json()
    try:
        if not request_message_data["user_id"]:
            return jsonify({"error": "user_id is required"}), 201
    except KeyError:
        return jsonify({"error": "user_id is required"}), 201
    try:
        if not request_message_data["name"]:
            return jsonify({"error": "friend's name is required"}), 201
    except KeyError:
        return jsonify({"error": "friend's name is required"}), 201
    try:
        print = request_message_data["start_point"]
    except KeyError:
        return jsonify({"error": "start_point is required"}), 201

    return jsonify(get_message(request_message_data)), 201


# This route is for changing system color
@account.route('/change_system_color', methods=['POST'])
def change_system_color():
    info = request.get_json()
    try:
        ret = system_color_settings(info)
        if ret == 1:
            response = jsonify({'error': 'system color settings can not be changed'})
            response.status_code = 205
        else:
            response = jsonify({'message': 'Done'})
            response.status_code = 201
    except:
        traceback.print_exc()
        response = jsonify({'error': 'missing information'})
        response.status_code = 206
    return response


# This route is for getting users' choice of system color
@account.route('/get_system_color', methods=['POST'])
def get_system_color():
    info = request.get_json()
    data = get_system_color_settings(info)
    response = jsonify({'type': data})
    response.status_code = 201
    return response


@account.route('/change_language', methods=['POST'])
def change_language():
    language_data = request.get_json()
    try:
        if not language_data["user_id"]:
            return jsonify({"error": "user_id is required"}), 201
    except KeyError:
        return jsonify({"error": "user_id is required"}), 201
    try:
        c = language_data["language"]
    except KeyError:
        return jsonify({"error": "language field is required"}), 201
    return jsonify(update_language(language_data)), 201

# This route is for updating reminders options
@account.route('/update_reminders_options', methods=['POST'])
def update_reminders_options():
    info = request.get_json()
    try:
        ret = reminders_options_settings(info)
        if ret == 1:
            response = jsonify({'error': 'reminders options settings can not be changed'})
            response.status_code = 205
        else:
            response = jsonify({'message': 'Done'})
            response.status_code = 201
    except:
        traceback.print_exc()
        response = jsonify({'error': 'missing information'})
        response.status_code = 206
    return response

@account.route('/update_reminders_timeoptions', methods=['POST'])
def update_reminders_timeoptions():
    info = request.get_json()
    try:
        ret = reminders_timeoptions_settings(info)
        if ret == 1:
            response = jsonify({'error': 'reminders options settings can not be changed'})
            response.status_code = 205
        else:
            response = jsonify({'message': 'Done'})
            response.status_code = 201
    except:
        traceback.print_exc()
        response = jsonify({'error': 'missing information'})
        response.status_code = 206
    return response
