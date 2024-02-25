# this class manage all types of communication between firebase and python

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
        print("invalid username or password to create account")
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

user = auth.sign_in_with_email_and_password("ty@hn.ce", "123456r")
delete_account(user)