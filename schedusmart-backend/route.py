# this file manage all routing system in flask
import traceback

# To make code clean, please make
# each route that serve the same object have the same variable_name

# To test the code, I recommend using postman app to see what is going on
from flask import Blueprint, request
from fire_base import *

account = Blueprint('login', __name__)


# to create an account, reach this route and send a json message with the following formate
# {"username":"<user_name>", "password":"<password>"}
@account.route('/create_account', methods=['POST'])
def create_account():
    receive_account = request.get_json()
    try:
        a = create_account_by_username_and_password(receive_account['user_name'], receive_account['password'])
        # TODO: add additional information to the account can be add here
        if a == 1:
            return 'username has been used', 205
    except:
        traceback.print_exc()
        return 'missing information', 206
    return 'Done', 201


@account.route('/login', methods=['POST'])
def login():
    return 'login_confirm', 201
