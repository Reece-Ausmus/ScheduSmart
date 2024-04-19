from fire_base import *
from calendar_route import *
'''

user = {
    "email": "unitTest@purpose.only",
    "password": "123465",
    "firstname": 'firstname',
    "lastname": 'lastname',
    "username": 'username'
}


def testing_creating_invalid_account():
    user["email"] = ""
    if create_account_by_username_and_password(user) == 0:
        print("fail to reject invalid email: 1")
        assert False
    user["password"] = ""
    if create_account_by_username_and_password(user) == 0:
        print("fail to reject invalid password: 1")
        assert False
    user["password"] = "12345"
    if create_account_by_username_and_password(user) == 0:
        print("fail to reject invalid username: 2")
        assert False


def creating_same_email():
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
    delete_user = login_account_with_email_and_password(user)
    delete_account(delete_user)


def testToPullAccountInfo():
    pass

def test_update_account_info():
    # Assuming the user has been created successfully in the previous tests
    temp_user = {"email": "unitTest@purpose.only", "password": "ThisIsJustPassword"}
    user_id = login_account_with_email_and_password(temp_user)

    # Update account information
    updated_info = {
        "user_id": user_id,
        "firstname": "UpdatedFirstName",
        "lastname": "UpdatedLastName",
        "username": "UpdatedUsername"
    }

    try:
        ret = update_user_info(updated_info)
        assert ret == 0 
        print("update_account_info\npass\n")
    except:
        traceback.print_exc()
        print("update_account_info\nfail\n")
        assert False

    # Clean up - delete the user
    delete_account(user_id)


print("\n-----------unit test for account-----------")
testing_creating_invalid_account()
print("testing_creating_invalid_account\npass\n")
creating_same_email()
print("creating_same_email\npass\n")
#test_update_account_info()
print("test_update_account_info\npass\n")
'''