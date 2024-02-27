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
            "email": receive_account['email']
        }
        user = auth.create_user_with_email_and_password(receive_account['email'], receive_account['password'])
        db.child("User").push(data)
        return 0
    except Exception as e:
        print("Failed to create account:", e)
        return 1

# this method is used to log in with email and password (both argument are string)
# if login successfully, a user object build by pyrebase will return,
# which can be used to delete account or view token for security purpose
# if fail (invalid email or password), 1 is return
def login_account_with_email_and_password(receive_account):
    try:
        user =  auth.sign_in_with_email_and_password(receive_account['email'], receive_account['password'])
        data = {
            "email": receive_account['email'],
            "password": receive_account['password']
        }
        return 0
    except Exception:
        print("invalid email or password")
        return 1

# ##################################################################################################
# The following code will be used to manipulate task in firebase
# ##################################################################################################

# build a connection between firebase and flask #######################

# Make sure you download the firebaseConfig.py file in google doc
firebase = pyrebase.initialize_app(firebaseConfig)

db = firebase.database()
auth = firebase.auth()
storage = firebase.storage()
