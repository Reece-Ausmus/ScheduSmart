from fire_base import *


def testing_creating_invalid_account():
    if create_account_by_username_and_password("", "") == 0:
        print("fail to reject invalid username: 1")
        assert False
    if create_account_by_username_and_password("hello_kitty", "") == 0:
        print("fail to reject invalid password: 1")
        assert False
    if create_account_by_username_and_password("unit_test_account", "ersigubv") == 0:
        print("fail to reject invalid username: 2")
        assert False

#testing_creating_invalid_account()
create_account_by_username_and_password("dev2@test.ing", "123456")
a = login_account_with_username_and_password("dev@test.ing", "123456")
print(a)
