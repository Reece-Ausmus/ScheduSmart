# this class manage all types of communication between firebase and python
#
# Firebase Layout
#
# - Users
#   |-  user_name1
#       |-  first_name
#       |-  last_name
#       |-  email
#       |-  calenders
#           |-  cal_id1
#           |-  cal_id2
#           ...
#       |-  task_lists
#           |-  task_list_id1
#           |-  task_list_id2
#           ...
#   |-  user_name2
#       |-  first_name
#       |-  last_name
#       |-  email
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


def delete_account(user):
    try:
        users = db.child("User").get()
        for userSearch in users.each():
            pass
            if userSearch.val()["email"] == auth.get_account_info(user["idToken"])["users"][0]["email"]:
                db.child("User").child(userSearch.key()).remove()
        auth.delete_user_account(user['idToken'])
        return 0
    except Exception as e:
        print("Fail to delete account")
        print(f"{e}")
        return 1


def create_account_by_username_and_password(receive_account):
    try:
        def transaction(transaction):
            users = transaction.child("User").get()
            if users is None:
                return None
            for user in users.each():
                if user.val().get("user_name") == receive_account['username']:
                    return None
            return users
        result=db.transaction(transaction)
        if result is None:
            print("Username already exists")
            return 2
        user = auth.create_user_with_email_and_password(receive_account['email'], receive_account['password'])
        data = {
            "first_name": receive_account['firstname'],
            "last_name": receive_account['lastname'],
            "user_name": receive_account['username'],
            "email": receive_account['email']
        }
        db.child("User").push(data)
        return 0
    except Exception as e:
        print("Failed to create account:", e)
        return 1


def login_account_with_username_and_password(username, password):
    try:
        return auth.sign_in_with_email_and_password(username, password)
    except Exception:
        print("invalid username or password")
        return 1


# build a connection between firebase and flask #######################

# Make sure you download the firebaseConfig.py file in google doc
firebase = pyrebase.initialize_app(firebaseConfig)

db = firebase.database()
auth = firebase.auth()
storage = firebase.storage()

#user = auth.sign_in_with_email_and_password("ty@hn.ce", "123456r")
#delete_account(user)