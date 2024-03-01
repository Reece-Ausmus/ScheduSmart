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


# login_account_with_username_and_password(username, password)
# the method will return a user object that you will use for argument in this method
def get_user(response):
    user_id = response['user_id']
    try:
        calendars_data = db.child("User").child(user_id).child('calendars').get().val() or {}
        calendar_names = list(calendars_data.keys())
        data = {
            "email": db.child("User").child(user_id).child('email').get().val(),
            "first_name": db.child("User").child(user_id).child('first_name').get().val(),
            "last_name": db.child("User").child(user_id).child('last_name').get().val(),
            "user_name": db.child("User").child(user_id).child('user_name').get().val(),
            "user_id": user_id,
            "calendars": calendar_names,
            "language": db.child("User").child(user_id).child('language').get().val(),
            "location": db.child("User").child(user_id).child('location').get().val(),
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
        db.child("User").child(user_id).set(receive_account)
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


# this is used to create an account
# the argument accept an array with following format:
# user = {
#     "email": "<email>",
#     "password": "<password>",
#     "firstname": '<firstname>',
#     "lastname": '<lastname>',
#     "username": '<username>'
# }
# if success, 0 is returned
# else 1 is returned
def create_account_by_username_and_password(receive_account):
    try:
        data = {
            "first_name": receive_account['firstname'],
            "last_name": receive_account['lastname'],
            "user_name": receive_account['username'],
            "email": receive_account['email'],
        }

        existing_user = db.child("User").get().val()
        if existing_user:
            for userid, user_data in existing_user.items():
                if user_data['user_name'] == data['user_name']:
                    print("Username already exists")
                    return {
                        "error": "Username already exists",
                        "response_status": 2
                    }

        user = auth.create_user_with_email_and_password(receive_account['email'], receive_account['password'])
        db.child("User").child(user['localId']).set(data)
        return {
            "email": receive_account['email'],
            "password": receive_account['password'],
            "user_id": user['localId'],
            "return_status": 0
        }
    except Exception as e:
        print("Failed to create account:", e)
        return {
            "error": "Failed to create account",
            "response_status": 1
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
        # if not email_verified:
        #    auth.send_email_verification(user['idToken'])

        # Update 'emailVerified' to True in the database
        #    db.child("User").child(user_id).update({"emailVerified": True})

        #    return {
        #        "email": receive_account['email'],
        #        "password": receive_account['password'],
        #        "user_id": user_id,
        #        "return_status": 3
        #    }

        # Set 'emailVerified' to False so that user will have to re-verify on next sign-in
        # db.child("User").child(user_id).update({"emailVerified": False})

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
def add_new_event_list(task_list_id, task_list):
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
        return 1

    # add calendar_id to current users calendar list
    try:
        db.child("User").child(user_id).child("calendars").child(calendar_name).set({'calendar_id': calendar_id})
    except Exception as e:
        print("Failed to add calendar to user:", e)
        return 2
    return 0


def add_new_event(event_info):
    user_id = event_info['user_id']
    event_id = secrets.token_hex(16)
    data = {
        'name': event_info['name'],
        'desc': event_info['desc'],
        'start_time': event_info['start_time'],
        'end_time': event_info['end_time'],
        'start_date': event_info['start_date'],
        'end_date': event_info['end_date'],
        'location': event_info['location'],
        'calendar': event_info['calendar'],
        'repetition_type': event_info['repetition_type'],
        'repetition_unit': event_info['repetition_unit'],
        'repetition_val': event_info['repetition_val']
    }
    try:
        caldata = db.child("User").child(user_id).child("calendars").child(data['calendar']).get().val()
        calendar_id = caldata['calendar_id']
        print(calendar_id)
        db.child("Calendars").child(calendar_id).child("Events").child(event_id).set(data)
    except Exception as e:
        print("Failed to create calendar:", e)
        return 1
    return 0


# this func is to get the default calendar type
def get_default_calendar_type(uid):
    type = db.child("User").child(uid).child("default_calendar_type").get()
    return type.val()


def update_format(info):
    mode = info['mode']
    user_id = info['user_id']
    try:
        db.child("User").child(user_id).set(mode)
        return 0
    except Exception:
        print("Failed to set the calendar mode")
        return 1


# used to test with firebase #######################

# Make sure you download the firebaseConfig.py file in google doc
firebase = pyrebase.initialize_app(firebaseConfig)

db = firebase.database()
auth = firebase.auth()
storage = firebase.storage()

user = {
    "user_name": "mick@gmail.com",
    "password": "123456",
    "language": "2",
    "user_id": "igOcM0niMhQNVLKe2S0ncnU9kOC2"
}
# create_account_by_username_and_password(user)
update_language(user)
