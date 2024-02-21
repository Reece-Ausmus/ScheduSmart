# this class manage all types of communication between firebase and python

import pyrebase
from firebaseConfig import firebaseConfig


# print project id
def printing_id():
    pass


def create_account_by_username_and_password(username, password):
    try:
        auth.create_user_with_email_and_password(username, password)
        return 0
    except Exception:
        print("invalid username or password to create account")
        return 1


def login_account_with_username_and_password(username, password):
    try:
        auth.sign_in_with_email_and_password(username, password)
        return 0
    except Exception:
        print("invalid username or password")
        return 1


# build a connection between firebase and flask #######################

# Make sure you download the firebaseConfig.py file in google doc
firebase = pyrebase.initialize_app(firebaseConfig)

db = firebase.database()
auth = firebase.auth()
storage = firebase.storage()
