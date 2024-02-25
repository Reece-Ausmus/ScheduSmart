# This file will contain classes that can implement business logic without accessing the database every time

class Account:
    """User account"""

    # I don't know if password should be included, seems to make sense but I don't know about the security implications
    def __init__(self, username, email, password, firstName, lastName) -> None:
        self.events = Events()
        self.tasks = Tasks()



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

    def __init__(self) -> None:
        self.items = []

    def add_item(self, item) -> None:
        """Add an item to the collection"""
        self.items.append(item)

    def delete_item(self, item_id) -> None:
        """Delete an item with the provided id from the collection"""
        for item in self.items:
            if item.id == item_id:
                self.items.remove(item)
                break

class Tasks(Collection):
    """Collection of Task objects"""

class Events(Collection):
    """Collection of Event objects"""