# this class manage all types of communication between firebase and python
#
# Firebase Layout
#
# - User
#   |-  user_id
#       |-  first_name
#       |-  last_name
#       |-  email
#       |-  user_name
#       |- default_calendar_type
#       |-  calenders
#           |-  cal_id1
#           |-  cal_id2
#           ...
#       |-  task_lists
#           |-  task_list_id1
#           |-  task_list_id2
#           ...
#   |-  user_id
#       |-  first_name
#       |-  last_name
#       |-  email
#       |-  user_name
#       |- default_calendar_type
#       |-  calenders
#           |-  cal_id1
#           |-  cal_id2
#           ...
#       |-  task_lists
#           |-  task_list_id1
#           |-  task_list_id2
#           ...
#   ...
# - Calendars
#   |-  cal_id1
#       |-  event_id1
#       |-  event_id2
#       ...
#   |-  cal_id2
#       |-  event_id1
#       |-  event_id2
#       ...
#   ...
# - Events
#   |-  event_id1
#       |-  name
#       |-  desc
#       |-  ...
#   |-  event_id2
#       |-  name
#       |-  desc
#       |-  ...
#   ...
# - Task_Lists
#   |-  task_list_id1
#       |-  task_id1
#       |-  task_id2
#       ...
#   |-  task_list_id2
#       |-  task_id1
#       |-  task_id2
#       ...
#   ...

import pyrebase
from firebaseConfig import firebaseConfig
import secrets
import traceback
import difflib
from datetime import datetime, timedelta


# to use this function, you will need to first log in the account with method:
# login_account_with_username_and_password(username, password)
# the method will return a user object that you will use for argument in this method
# then the account will be properly deleted
def delete_account(user):
    try:
        users = db.child("User").get()
        for userSearch in users.each():
            if str(userSearch.val()["email"]).lower() == auth.get_account_info(user["idToken"])["users"][0]["email"]:
                db.child("User").child(userSearch.key()).remove()
        auth.delete_user_account(user['idToken'])
        return 0
    except Exception as e:
        print("Fail to delete account")
        print(f"{e}")
        return 1


def __look_for_same_user_name_or_email(data):
    users = db.child("User").get()
    for user in users.each():
        try:
            if data["user_name"] == user.val()["user_name"]:
                return 1
            if data["email"] == user.val()["email"]:
                return 2
        except KeyError:
            pass
    return 0


# login_account_with_username_and_password(username, password)
# the method will return a user object that you will use for argument in this method
# need to update, will eventually just pull all information using loops, so it is easily reusable 
def get_user(response):
    user_id = response['user_id']
    try:
        calendars_data = db.child("User").child(user_id).child('calendars').get().val() or {}
        calendars = {}
        for cal_name, cal_info in calendars_data.items():
            calendar_id = cal_info.get('calendar_id')
            calendars[cal_name] = {"calendar_id": calendar_id}
        data = {
            "email": db.child("User").child(user_id).child('email').get().val(),
            "first_name": db.child("User").child(user_id).child('first_name').get().val(),
            "last_name": db.child("User").child(user_id).child('last_name').get().val(),
            "user_name": db.child("User").child(user_id).child('user_name').get().val(),
            "timezone": db.child("User").child(user_id).child('timezone').get().val(),
            "user_id": user_id,
            "calendars": calendars,
            "language": db.child("User").child(user_id).child('language').get().val(),
            "location": db.child("User").child(user_id).child('location').get().val(),
            'task_list': db.child("User").child(user_id).child('task_list').get().val(),
            "return_status": 0
        }
        return data
    except Exception as e:
        return {
            "error": "Cannot Find User",
            "return_status": 1
        }


def update_user_info(receive_account):
    try:
        user_id = receive_account['user_id']
        db.child("User").child(user_id).update(receive_account)
        return 0
    except Exception:
        print("Failed to update account information")
        return 1


def update_language(data):
    try:
        user_id = data['user_id']
        db.child("User").child(user_id).update({"language": data["language"]})
        return 0
    except Exception:
        print("fail to update language")
        return 1


def create_account_by_username_and_password(receive_account):
    try:
        data = {
            "first_name": receive_account['firstname'],
            "last_name": receive_account['lastname'],
            "user_name": receive_account['username'],
            "email": receive_account['email'],
        }

        same_account_confirm = __look_for_same_user_name_or_email(data)

        if same_account_confirm == 1:
            return {
                "error": "username",
                "response_status": 0
            }
        if same_account_confirm == 2:
            return {
                "error": "email",
                "response_status": 0
            }

        user = auth.create_user_with_email_and_password(receive_account['email'], receive_account['password'])
        db.child("User").child(user['localId']).set(data)
        return {
            "email": receive_account['email'],
            "password": receive_account['password'],
            "user_id": user['localId'],
            "response_status": 0
        }
    except Exception as e:
        return {
            "error": "invalid",
            "response_status": 0
        }


# this method is used to log in with email and password (both argument are string)
# if login successfully, a user object build by pyrebase will return,
# which can be used to delete account or view token for security purpose
# if fail (invalid email or password), 1 is return
def login_account_with_email_and_password(receive_account):
    try:
        user = auth.sign_in_with_email_and_password(receive_account['email'], receive_account['password'])

        # Check if the user's email is not verified based on the database field
        user_id = user['localId']
        # 2FA CODE START ########################################################################################
        email_verified = db.child("User").child(user_id).child("emailVerified").get().val()

        # Send verification email to certify login
        if not email_verified:
            auth.send_email_verification(user['idToken'])

            # Update 'emailVerified' to True in the database
            db.child("User").child(user_id).update({"emailVerified": True})

            return {
                "email": receive_account['email'],
                "password": receive_account['password'],
                "user_id": user_id,
                "return_status": 3
            }

        # Set 'emailVerified' to False so that user will have to re-verify on next sign-in
        db.child("User").child(user_id).update({"emailVerified": False})

        #### TEMPORARY DISABLE EMAIL VERIFICATION ####
        db.child("User").child(user_id).update({"emailVerified": True})

        # 2FA CODE END ##########################################################################################

        data = {
            "email": receive_account['email'],
            "password": receive_account['password'],
            "user_id": user_id,
            "return_status": 0
        }
        return data
    except Exception:
        print("invalid email or password")
        return {"return_status": 1}


# ##################################################################################################
# The following code will be used to manipulate task in firebase
# ##################################################################################################
def __task_list_exist(task_list_id):
    try:
        task_list = db.child("Task_lists").child(task_list_id).get()
        task_list = task_list[0]
    except TypeError:
        return False
    return True


# this function is used to add a whole new event list to the firebase
# arguments:
# event_list_id: should be random id generated by flask
# task_list = [task1, task2, task3, ...]
# task = {
#     "task_id": "<id>",
#     "info": "<info>"
# }
def add_new_task_list(task_list_id, task_list):
    if __task_list_exist(task_list_id):
        return f"tasklist: {task_list_id} already exist"
    for task in task_list:
        try:
            db.child("Task_lists").child(task_list_id).child(task['task_id']).set(task)
        except KeyError:
            return "one of the task does not contain 'task_id'"
    return 0


# This function is used to add or update event to event_list that already exist
# argument:
# task_list_id = the id for the task list we are modifying
# new_task with format = {
#     "task_id": "<id>",
#     "info": "<info>"
#     ...
# }
def update_task_list(task_list_id, new_task):
    if not __task_list_exist(task_list_id):
        return f"Error: {task_list_id} does not exist in task list"

    try:
        db.child("Task_lists").child(task_list_id).child(new_task['task_id']).set(new_task)
    except KeyError:
        return "one of the task does not contain 'task_id'"
    return 0


def mark_task_as_done(task):
    try:
        # look for id
        tasks = db.child("User").child(task["user_id"]).child("task_list").get()
        id_path = None
        for each_task in tasks:
            if each_task.val()["id"] == task["id"]:
                id_path = each_task.key()
        db.child("User").child(task["user_id"]).child("task_list").child(id_path).update(
            {"completed_time": task["completed_time"]})
        db.child("User").child(task["user_id"]).child("task_list").child(id_path).update(
            {"completed": task["completed"]})
    except KeyError as e:
        print(f"{e}")


# end of the task functions ###################


def add_new_calendar(calendar_info):
    calendar_name = calendar_info['newCalendarName']
    user_id = calendar_info['user_id']
    calendar_id = secrets.token_hex(16)
    data = {
        "name": calendar_name
    }
    try:
        db.child("Calendars").child(calendar_id).set(data)
    except Exception as e:
        print("Failed to create calendar:", e)
        return {'response_status': 1}

    # add calendar_id to current users calendar list
    try:
        db.child("User").child(user_id).child("calendars").child(calendar_name).set({'calendar_id': calendar_id})
    except Exception as e:
        print("Failed to add calendar to user:", e)
        return {'response_status': 2}
    return {
        'calendar_id': calendar_id,
        'response_status': 0
    }


def f_get_events(calendar):
    try:
        data_event_ids = db.child("Calendars").child(calendar["calendar_id"]).child("Events").get()
        events = []
        for event_id in data_event_ids.each():
            event = event_id.val()
            e = db.child("Events").child(event["event_id"]).get().val()
            e["event_id"] = event["event_id"]
            events.append(e)
        return {"data": events}
    except Exception as e:
        print(f"fail to retrieve events data: \n{e}")
    return 1


def update_task(task_info):
    user_id = task_info['user_id']
    data = {'task_list': task_info['task_list']}
    try:
        db.child("User").child(user_id).update(data)
    except Exception as e:
        print("Failed to update tasks:", e)
        return 1
    return 0


def add_new_event(event_info):
    user_id = event_info['user_id']
    if user_id is None:
        raise Exception("User ID is None")

    event_id = secrets.token_hex(16)
    data = {
        'name': event_info['name'],
        'desc': event_info['desc'],
        'start_time': event_info['start_time'],
        'end_time': event_info['end_time'],
        'start_date': event_info['start_date'],
        'end_date': event_info['end_date'],
        'conferencing_link': event_info['conferencing_link'],
        'location': event_info['location'],
        'calendar': event_info['calendar'],
        'repetition_type': event_info['repetition_type'],
        'repetition_unit': event_info['repetition_unit'],
        'repetition_val': event_info['repetition_val'],
        'selected_days': event_info['selected_days'],
        'emails': event_info['emails'],
        'type': event_info['type']
    }
    try:
        emails = data['emails']
        for email in emails:
            safe_email = email.replace(".", ",").replace("@", "_")
            db.child("Invitations").child(safe_email).child(event_id).set({'status': 'pending'})
        calendar_id = data['calendar']
        db.child("Calendars").child(calendar_id).child("Events").push({"event_id": event_id})
        db.child("Events").child(event_id).set(data)
    except Exception as e:
        print(f"{e}")
        print("Failed to create calendar:", e)
        return {'response_status': 1}
    return {
        'response_status': 0,
        'event_id': event_id
    }


def update_event_db(event_info):
    user_id = event_info['user_id']
    if user_id is None:
        raise Exception("User ID is None")
    event_id = event_info['event_id']
    data = {
        'name': event_info['name'],
        'desc': event_info['desc'],
        'start_time': event_info['start_time'],
        'end_time': event_info['end_time'],
        'start_date': event_info['start_date'],
        'end_date': event_info['end_date'],
        'conferencing_link': event_info['conferencing_link'],
        'location': event_info['location'],
        'repetition_type': event_info['repetition_type'],
        'repetition_unit': event_info['repetition_unit'],
        'repetition_val': event_info['repetition_val'],
        'selected_days;': event_info['selected_days'],
        'type': event_info['type']
    }
    try:
        db.child("Events").child(event_id).update(data)
    except Exception as e:
        print("Failed to update event:", e)
        return {'response_status': 1}
    return {'response_status': 0}


def delete_event_db(event_info):
    user_id = event_info['user_id']
    if user_id is None:
        raise Exception("User ID is None")
    try:
        event_id = event_info['event_id']
        event = db.child("Events").child(event_id).get().val()
        calendar_id = event['calendar']
        try:
            emails = event['emails']
            for email in emails:
                safe_email = email.replace(".", ",").replace("@", "_")
                db.child("Invitations").child(safe_email).child(event_id).set({'status': 'deleted'})
        except Exception as e:
            print("no emails")
        event_list = db.child("Calendars").child(calendar_id).child("Events").get().val()
        matching_event_id = None
        for key, value in event_list.items():
            if value['event_id'] == event_id:
                matching_event_id = key
                break
        if matching_event_id is not None:
            db.child("Calendars").child(calendar_id).child("Events").child(matching_event_id).remove()
        else:
            print("Event_id not found")
        db.child("Events").child(event_id).remove()
    except Exception as e:
        traceback.print_exc()
        print("Failed to delete event:", e)
        return {'response_status': 1}
    return {'response_status': 0}


def get_event_with_id_db(data):
    try:
        if data['user_id'] is None:
            raise Exception("User ID is None")
        event_id = data['event_id']
        event = db.child("Events").child(event_id).get().val()
        return {'response_status': 0, 'event': event}
    except Exception as e:
        print("Failed to get event with ID:", e)
        return {'response_status': 1}


def invite_users_to_event_db(data):
    try:
        if data['user_id'] is None:
            raise Exception("User ID is None")
        emails = data['emails']
        event_id = data['event_id']
        for email in emails:
            db.child("Invitations").child(email).child(event_id).set({'status': 'pending'})
        return {'response_status': 0}
    except Exception as e:
        print("Failed to invite user to event:", e)
        return {'response_status': 1}


def get_invitations_db(data):
    try:
        if data['user_id'] is None:
            raise Exception("User ID is None")
        user_id = data['user_id']
        email = db.child("User").child(user_id).child('email').get().val()
        safe_email = email.replace(".", ",").replace("@", "_")
        invitations = db.child("Invitations").child(safe_email).get().val()
        event_ids = list(invitations.keys())
        for event_id in event_ids:
            event_info = get_event_with_id_db({'user_id': user_id, 'event_id': event_id})
            invitations[event_id]['event_info'] = event_info['event']
        return {'response_status': 0, 'invitations': invitations}
    except Exception as e:
        print("Failed to get invitations:", e)
        return {'response_status': 1}


def accept_invitation_db(data):
    try:
        if data['user_id'] is None:
            raise Exception("User ID is None")
        user_id = data['user_id']
        event_id = data['event_id']
        email = db.child("User").child(user_id).child('email').get().val()
        safe_email = email.replace(".", ",").replace("@", "_")
        db.child("Invitations").child(safe_email).child(event_id).update({"status": "accepted"})
        calendar_id = db.child("User").child(user_id).child("calendars").child("Invitations").get().val()['calendar_id']
        db.child("Calendars").child(calendar_id).child("Events").push({"event_id": event_id})
        return {'response_status': 0}
    except Exception as e:
        # print("Failed to accept invitation:", e)
        return {'response_status': 1}


def decline_invitation_db(data):
    try:
        if data['user_id'] is None:
            raise Exception("User ID is None")
        user_id = data['user_id']
        event_id = data['event_id']
        email = db.child("User").child(user_id).child('email').get().val()
        safe_email = email.replace(".", ",").replace("@", "_")
        db.child("Invitations").child(safe_email).child(event_id).remove()
        return {'response_status': 0}
    except Exception as e:
        print("Failed to decline invitation:", e)
        return {'response_status': 1}


# this func is to get the default calendar type
def get_default_calendar_type(uid):
    type = db.child("User").child(uid).child("default_calendar_type").get()
    return type.val()


def update_default_calendar_type(info):
    mode = info['mode']
    user_id = info['user_id']
    try:
        db.child("User").child(user_id).child("default_calendar_type").set(mode)
        return 0
    except Exception:
        print("Failed to set the calendar mode")
        return 1


def get_default_location_settings(user_id):
    mode = db.child("User").child(user_id).child("default_location_settings").get()
    return mode.val()


def update_default_location_settings(info):
    mode = info['mode']
    user_id = info['user_id']
    try:
        db.child("User").child(user_id).child("default_location_settings").set(mode)
        return 0
    except Exception:
        print("Failed to set the location settings")
        return 1


def get_system_color_settings(info):
    user_id = info['user_id']
    color = info['color']
    try:
        db.child("User").child(user_id).child("system_color").set(color)
        return 0
    except Exception:
        print("Failed to set the system color settings")
        return 1


# This function is used to create a new Habits list for the logged in user
def add_new_habit(data):
    user_id = data['user_id']
    habit_data = {
        "id": data['id'],
        "calories": data['calories'],
        "carbs": data['carbs'],
        "fat": data['fat'],
        "protein": data['protein'],
        "sodium": data['sodium'],
        "sugar": data['sugar']
    }
    # Construct the Firebase structure
    habit_path = f"/Habits/{user_id}/{data['itemName']}"

    # Push the habit data to the Firebase database
    try:
        db.child(habit_path).set(habit_data)
        return 0
    except Exception as e:
        print("Failed to create habit:", e)
        return 1


def find_closest_available_time(data):
    user_id = data['user_id']
    timeRange = data['timeAmount']

    # get all calendar
    calendars = db.child("User").child(user_id).child("calendars").get().val()
    earlist_start_time = ''
    earlist_end_time = ''

    loc_dt = datetime.today()
    time_del = timedelta(minutes=5)
    earlist_start_time = loc_dt + time_del
    time_del = timedelta(minutes=int(timeRange))
    earlist_end_time = earlist_start_time + time_del
    earlist_start_time = earlist_start_time.strftime("%Y-%m-%d %H:%M")
    earlist_end_time = earlist_end_time.strftime("%Y-%m-%d %H:%M")
    event_list = []

    for key, val in calendars.items():
        # get all events from all calendars
        data_event_ids = db.child("Calendars").child(val['calendar_id']).child("Events").get()
        if data_event_ids.val() == None:
            continue

        for event_id in data_event_ids.each():
            event = event_id.val()
            e = db.child("Events").child(event["event_id"]).get().val()
            if e['start_date'] == '' and e['start_time'] == '' and e['end_date'] == '' and e['end_time'] == '':
                continue
            start_time = e['start_date'] + ' ' + e['start_time']
            end_time = e['end_date'] + ' ' + e['end_time']
            event_list.append((start_time, end_time))

        event_list.sort(key=lambda a: a[1])

        for start_time, end_time in event_list:
            if (start_time <= earlist_start_time and end_time >= earlist_start_time) or (
                    start_time <= earlist_end_time and end_time >= earlist_end_time):
                temp_time = datetime.strptime(end_time, "%Y-%m-%d %H:%M")
                time_del = timedelta(minutes=5)
                temp_start = temp_time + time_del
                time_del = timedelta(minutes=int(timeRange))
                temp_end = temp_start + time_del
                earlist_start_time = temp_start.strftime("%Y-%m-%d %H:%M")
                earlist_end_time = temp_end.strftime("%Y-%m-%d %H:%M")

    time = earlist_start_time + ' - ' + earlist_end_time

    # get user email
    email = db.child("User").child(user_id).child('email').get().val()
    username = db.child("User").child(user_id).child("user_name").get().val()
    ret = {'username': username, 'time': time, 'email': email}

    return ret


################################################### friend system ######################################################
def __get_name(id):
    return get_user({"user_id": id})["user_name"]


def __get_friend_list(user_id):
    friend_list = []
    try:
        friends = db.child("User").child(user_id).child("friendManager").child("friend").get()
        for friend in friends.each():
            friend_name = __get_name(friend.val()["id"])
            friend_data = {
                'name': friend_name,
                'confirm': friend.val()["confirm"]
            }
            friend_list.append(friend_data)
    except TypeError as e:
        pass
    return friend_list


def __get_request_list(user_id):
    request_list = []
    try:
        requests = db.child("User").child(user_id).child("friendManager").child("request").get()
        for request in requests.each():
            request_name = __get_name(request.val()["id"])
            friend_data = {
                'name': request_name
            }
            request_list.append(friend_data)
    except TypeError as e:
        pass
    return request_list


def __get_user_id(name):
    users = db.child("User").get()
    for user in users.each():
        try:
            if name == user.val()["user_name"]:
                return user.key()
        except KeyError as e:
            pass
    return None


def __create_room(data):
    friend_id = __get_user_id(data["name"])
    chat_room_data = {
        "user1": data["user_id"],
        "user2": friend_id,
        "confirmation": False,
        "counter": 0,
    }
    a = db.child("Chat_Room").push(chat_room_data)
    return a["name"]


def __delete_chat_room(room_id):
    try:
        db.child("Chat_Room").child(room_id).remove()
    except TypeError | KeyError as e:
        print(f"{e} in delete chat room")
        pass


def __get_chat_id(user_id, friend_id):
    try:
        friends = db.child("User").child(user_id).child("friendManager").child("friend").get()
        for friend in friends.each():
            if friend.val()["id"] == friend_id:
                return friend.val()["chat_room"]
        return None
    except TypeError:
        return None


def get_friend_manager(user_data):
    friend_list = __get_friend_list(user_data["user_id"])
    request_list = __get_request_list(user_data["user_id"])
    friend_manager = {
        "friend": friend_list,
        "request": request_list
    }
    return friend_manager


def f_search_user(string):
    name_list = []
    names = db.child("User").get()
    for name in names.each():
        try:
            f_user_names = name.val()["user_name"]
            if (f_user_names.startswith(string) or f_user_names.endswith(string)) or string in f_user_names:
                name_list.append(f_user_names)
        except KeyError:
            pass
    if name_list:
        name_list = sorted(name_list, key=lambda x: difflib.SequenceMatcher(None, string, x).ratio(), reverse=True)

    return {"data": name_list}


def add_friend(add_friend_data):
    friend_id = __get_user_id(add_friend_data["name"])
    # check if the requester is user himself
    user_name = get_user({"user_id": add_friend_data["user_id"]})["user_name"]
    if user_name == add_friend_data["name"]:
        return {"error": "user requesting himself as friend"}
    # check if the request has already being post

    friend_list = __get_friend_list(add_friend_data["user_id"])

    for friend in friend_list:
        if friend['name'] == add_friend_data["name"]:
            return {"error": "request already send"}

    request_list = __get_request_list(add_friend_data["user_id"])
    for request in request_list:
        if request['name'] == add_friend_data["name"]:
            return {"error": "already receive request from friend"}

    room_id = __create_room(add_friend_data)
    friend_data = {
        "confirm": False,
        "chat_room": room_id,
        "id": __get_user_id(add_friend_data["name"])
    }

    if friend_id is not None:
        db.child("User").child(add_friend_data["user_id"]).child("friendManager").child("friend").push(friend_data)
        friend_data["id"] = add_friend_data["user_id"]
        db.child("User").child(friend_id).child("friendManager").child("request").push(friend_data)
        return {'message': 'request complete'}
    else:
        __delete_chat_room(room_id)
        return {'error': 'friend not found'}


def confirm(user_data):
    try:
        friend_id = __get_user_id(user_data["name"])

        update1 = True
        update2 = True

        # dealing user's request
        user_requester = db.child("User").child(user_data["user_id"]).child("friendManager").child("request").get()

        for requester in user_requester.each():
            if requester.val()["id"] == friend_id:
                if user_data["confirm"]:
                    c = (db.child("User").child(user_data["user_id"]).child("friendManager").child("friend").
                         push(requester.val()))
                    (db.child("User").child(user_data["user_id"]).child("friendManager").child("friend").
                     child(c["name"]).update({"confirm": True}))

                db.child("User").child(user_data["user_id"]).child("friendManager").child("request").child(
                    requester.key()).remove()
                update2 = False
                break
        if update2:
            return {"error": "user's requester not found"}

        # update value in requester
        requester_friends = db.child("User").child(friend_id).child("friendManager").child("friend").get()

        for requester in requester_friends.each():
            if requester.val()["id"] == user_data["user_id"]:
                chat_room_id = (db.
                child("User").
                child(friend_id).
                child("friendManager").
                child("friend").
                child(requester.key()).
                get().val()["chat_room"])
                if user_data["confirm"]:
                    db.child("User").child(friend_id).child("friendManager").child("friend").child(
                        requester.key()).update({"confirm": user_data["confirm"]})
                    db.child("Chat_Room").child(chat_room_id).update({"confirmation": True})
                else:
                    __delete_chat_room(chat_room_id)
                    db.child("User").child(friend_id).child("friendManager").child("friend").child(
                        requester.key()).remove()
                update1 = False
                break
        if update1:
            return {"error": "requester friend not found"}

        if not friend_id:
            return {"error": "account not found, please send the friend request again"}

        user_requester = db.child("User").child(user_data["user_id"]).child("friendManager").child("friend").get()

        return {"message": "done"}

    except TypeError as e:
        print(f"main: {e}")
        return {"error": "request not found"}


def get_message(request):
    user_id = request["user_id"]
    friend_name = request["name"]
    start_point = request["start_point"]

    friend_id = __get_user_id(friend_name)
    chat_room = __get_chat_id(user_id, friend_id)
    if chat_room is None:
        return {"error": "friend not found"}

    line = db.child("Chat_Room").child(chat_room).get().val()["counter"]
    user2 = db.child("Chat_Room").child(chat_room).get().val()["user2"]
    identification = 1 if user2 == friend_id else 2
    messages = []

    for x in range(start_point, line):
        data_base_message_group = db.child("Chat_Room").child(chat_room).child("message_group").child(x).get().val()
        data = {
            "message": data_base_message_group["message"],
            "type": data_base_message_group["identifier"]
        }
        if identification == 2:
            data["type"] = 1 if data_base_message_group["identifier"] == 2 else 2
        messages.append(data)

    return {"data": messages}


def add_message(add_data):
    user_id = add_data["user_id"]
    friend_name = add_data["name"]
    friend_id = __get_user_id(friend_name)
    new_message = add_data["message"]

    chat_room = __get_chat_id(user_id, friend_id)
    if chat_room is None:
        return {"error": "friend not found"}
    try:
        count = db.child("Chat_Room").child(chat_room).get().val()["counter"]
        user2 = db.child("Chat_Room").child(chat_room).get().val()["user2"]
        new_data = {
            "identifier": 1 if user2 == friend_id else 2,
            "message": new_message
        }
    except TypeError | KeyError:
        return {"error": "fatal"}
    db.child("Chat_Room").child(chat_room).child("message_group").child(count).set(new_data)
    count = int(count)
    count += 1
    db.child("Chat_Room").child(chat_room).update({"counter": count})
    return {"message": "done"}


# Make sure you download the firebaseConfig.py file in google doc
firebase = pyrebase.initialize_app(firebaseConfig)

db = firebase.database()
auth = firebase.auth()
storage = firebase.storage()
