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


# Sprint 1 User Story #3: account info
def test_valid_user_data(client):
    headers = {
        'Content-type':'application/json', 
        'Accept':'application/json'
    }

    data = {
         "user_id": "UmkEPUjA7xfopiibKSCPpQDIpV42",
    }

    response = client.post('/user_data', headers=headers, data=json.dumps(data))
    assert response.status_code == 201


# Sprint 1 User Story #3: update account info (change location from West Lafayette to Taipei)
def test_update_account_info(client):
    headers = {
        'Content-type':'application/json', 
        'Accept':'application/json'
    }

    data = {
        "user_id": "UmkEPUjA7xfopiibKSCPpQDIpV42",
        "first_name": 'Cassie',
        "last_name": 'Chang',
        "user_name": 'cassie0206',
        "email": 'cassie610512@gmail.com',
        "location": 'Taipei',
    }

    response = client.post('/user_data', headers=headers, data=json.dumps({"user_id": data["user_id"]}))
    assert response.json["location"] == 'West Lafayette'

    response = client.post('/update_account_info', headers=headers, data=json.dumps(data))
    assert response.status_code == 201

    # check if location has been changed successfully
    response = client.post('/user_data', headers=headers, data=json.dumps({"user_id": data["user_id"]}))
    assert response.json["location"] == 'Taipei'

    # resume for next test
    data["location"] = 'West Lafayette'
    response = client.post('/update_account_info', headers=headers, data=json.dumps(data))
    
