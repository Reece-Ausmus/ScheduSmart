from fire_base import *


def get_friend_list():
    pass


def __check_friend():
    pass


def __get_user_id(name):
    users = db.child("User").get()
    for user in users.each():
        try:
            if name == user.val()["user_name"]:
                return user.key()
        except KeyError as e:
            pass
    return None


def add_friend(add_friend_data):
    room_id = create_room(add_friend_data)
    friend_data = {
        "name": add_friend_data["name"],
        "confirm": False,
        "chat_room": room_id
    }

    friend_id = __get_user_id(friend_data["name"])

    if friend_id is not None:
        db.child("User").child(add_friend_data["user_id"]).child("friendManager").child("friend").push(friend_data)
        friend_data["name"] = get_user({"user_id": friend_id})["user_name"]
        db.child("User").child(friend_id).child("friendManager").child("friend").push(friend_data)


def create_room(data):
    username = get_user(data)["user_name"]
    chat_room_data = {
        "user1": username,
        "user2": data["name"],
        "confirmation": False
    }
    a = db.child("Chat_Room").push(chat_room_data)
    return a["name"]


def get_message():
    pass


def add_message():
    pass


data = {
    "user_id": "3eB0n2XFmDgeI8LXjwotNqNvl5l1",
    "name": "gloria_xu"
}

add_friend(data)
