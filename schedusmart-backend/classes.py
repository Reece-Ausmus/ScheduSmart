# This file will contain classes that can implement business logic without accessing the database every time

class Account:
    """User account"""

    # I don't know if password should be included, seems to make sense but I don't know about the security implications
    def __init__(self, username, email, password, firstName, lastName, ) -> None:
        pass

class Task:
    """Tasks created by the user"""

    def __init__(self) -> None:
        pass

class Event:
    """Events created by the user"""

    def __init__(self) -> None:
        pass

class Collection:
    """Parent class for all collections of items such as tasks or events"""

    def __init__(self, items) -> None:
        self.items = items

class Tasks(Collection):
    """Collection of Task objects"""

class Events(Collection):
    """Collection of Event objects"""