import datetime
import pytz

def get_user_timezone():
    # Get user's current timezone
    user_timezone = datetime.datetime.now(pytz.timezone('UTC')).astimezone().tzinfo
    return user_timezone

def get_formatted_time(timezone):
    # Get curr time in the user's timezone
    current_time = datetime.datetime.now(timezone).strftime("%I:%M")
    
    # Get AM or PM
    am_or_pm = datetime.datetime.now(timezone).strftime("%p")
    
    # Get timezone abbrev
    time_zone = datetime.datetime.now(timezone).strftime("%Z")

    return time_zone, current_time, am_or_pm

def get_full_timezone_format(time_zone, current_time, am_or_pm):
    # Create full timezone format
    full_timezone_format = f"{current_time} {am_or_pm} - {time_zone}"
    return full_timezone_format

if __name__ == "__main__":
    user_timezone = get_user_timezone()
    time_zone, current_time, am_or_pm = get_formatted_time(user_timezone)
    full_timezone = get_full_timezone_format(time_zone, current_time, am_or_pm)

    print(f"time_zone = \"{time_zone}\"")
    print(f"current_time = \"{current_time}\"")
    print(f"am_or_pm = \"{am_or_pm}\"")
    print(f"full_timezone = \"{full_timezone}\"")
