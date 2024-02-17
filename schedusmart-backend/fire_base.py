# this class manage all types of communication between firebase and python

import firebase
import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth
from firebase_admin import exceptions
import requests


# print project id
def printing_id():
    print(cred.project_id)


# function to create an account with following requirements:
#   * username has formate <name>@<whatever>.<whatever>
#       (required by firebase)
#   * password length at least 6
# if the requirements did not reach, 1 is return
def create_account_by_username_and_password(username, password):
    try:
        auth.create_user(email=username, password=password)
        return 0
    except ValueError:
        return 1
    except exceptions.FirebaseError:
        return 2


def login_account_with_username_and_password(username, password):
    try:
        auth.ge
        user_info = auth.get_user_by_email(username)
        print(user_info)
        return 0
    except ValueError as e:
        print(e)
        return 1
    except auth.UserNotFoundError:
        return 2
    except exceptions.FirebaseError:
        return 3


##### build a connection between firebase and flask #####

# the string should be the PATH you put your json document on Google Drive
# DON"T PUT THAT DOCUMENT(json) ON PUBLIC
cred = credentials.Certificate(r"D:\code\private\schedusmart-483d7-firebase-adminsdk-vtz3t-f4f4c9445a.json")
firebase_admin.initialize_app(cred)