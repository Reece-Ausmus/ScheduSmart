import json
import requests
import flask
from fire_base import *
from account_route import *
from server import *


def test_create_valid_account(client):
    headers = {
        'Content-type':'application/json', 
        'Accept':'application/json'
    }

    user = {
        "email": "unitTest@purpose.only",
        "password": "123465",
        "firstname": 'firstname',
        "lastname": 'lastname',
        "username": 'username'
    }

    response = client.post('/create_account', headers=headers, data=json.dumps(user))
    assert response.status_code == 201
    

# same email add and special character in the password
def test_create_invalid_account():
    user = {
        "email": "unitTest@purpose.only",
        "password": "123465",
        "firstname": 'firstname',
        "lastname": 'lastname',
        "username": 'username'
    }

    temp_user = {"email": "unitTest@purpose.only", "password": "ThisIsJustPassword"}
    delete_user = login_account_with_email_and_password(temp_user)
    user["email"] = "unitTest@purpose.only"
    user["password"] = "ThisIsJustPassword"
    if create_account_by_username_and_password(user) == 1:
        print("fail to create valid account")
        assert False
    if create_account_by_username_and_password(user) == 0:
        print("fail to reject email account that already exist")
        assert False
    #delete_user = login_account_with_email_and_password(user)
    #delete_account(delete_user)


def test_login(client):
    headers = {
        'Content-type':'application/json', 
        'Accept':'application/json'
    }

    data = {
         "email": "unitTest@purpose.only",
        "password": "123465",
    }

    response = client.post('/login', headers=headers, data=json.dumps(data))
    assert response.status_code == 201


# with invalid email address
def test_invalid_login(client):
    headers = {
        'Content-type':'application/json', 
        'Accept':'application/json'
    }

    data = {
         "email": "1234565",
        "password": "123465",
    }

    response = client.post('/login', headers=headers, data=json.dumps(data))
    assert response.status_code == 205


