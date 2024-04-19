firebaseConfig = {
  'apiKey': "AIzaSyC53hV188tV2CxH8dWhgSSuIbIWuGDLl6A",
  'authDomain': "schedusmart-483d7.firebaseapp.com",
  'projectId': "schedusmart-483d7",
  'storageBucket': "schedusmart-483d7.appspot.com",
  'messagingSenderId': "442656439492",
  'appId': "1:442656439492:web:fbff447025b995d1f89d91",
  'measurementId': "G-LKY6EYQRS4",
  'databaseURL': "https://schedusmart-483d7-default-rtdb.firebaseio.com/"}

import pyrebase
from flask import jsonify


def __task_list_exist(task_list_id):
    try:
        task_list = db.child("Task_lists").child(task_list_id).get()
        task_list = task_list[0]
    except TypeError:
        return False
    return True

firebase = pyrebase.initialize_app(firebaseConfig)
db = firebase.database()
auth = firebase.auth()
storage = firebase.storage()

#calendarIDList = db.child("User").child("calendars").get()
#for calendar in calendarIDList.each():

'''
temp = db.child("User").child('LznJONmYqkWdTRLaqP9GHqkW1dj1').child("calendars").get().val()

for key, val in temp.items():
    print(val['calendar_id'])
print(temp)


from datetime import datetime, timedelta
loc_dt = datetime.today() 
time_del = timedelta(minutes=3) 
new_dt = loc_dt + time_del 
datetime_format = new_dt.strftime("%Y/%m/%d %H:%M:%S")
loc_dt_format = loc_dt.strftime("%Y/%m/%d %H:%M:%S")
temp_time = '2024/04/05 20:04:02'
datetime_object = datetime.strptime(temp_time, "%Y/%m/%d %H:%M:%S")
time_del = timedelta(days=3) 
temp_dt = datetime_object + time_del
temp_str = temp_dt.strftime("%Y/%m/%d %H:%M:%S")
print(loc_dt_format)
print(datetime_format)
print(datetime_format > loc_dt)


data_event_ids = db.child("Calendars").child('18781b3a5ca19b580562cb99e656dd42').child("Events").get()
if(data_event_ids.val() == None):
    print('fwef')
print(data_event_ids.val())

events = []
for event_id in data_event_ids.each():
    print(event_id.val()['event_id'])
    event = event_id.val()
    e = db.child("Events").child(event["event_id"]).get().val()
    #print(e)
    #print('-------------------------------------------------------')
    e["event_id"] = event["event_id"]
    print(e)
    print('-------------------------------------------------------')

import pyrebase
from firebaseConfig import firebaseConfig
import secrets
import traceback
from datetime import datetime, timedelta


def f_get_events(calendar):
    try:
        # data_events = db.child("Calendars").child(calendar["calendar_id"]).child("Events").get()
        # data_event_counter = 0
        # data_event = []
        # for data in data_events.each():
        #    data_event.append(data.val())
        # return {"data": data_event}

        data_event_ids = db.child("Calendars").child(calendar["calendar_id"]).child("Events").get()
        events = []
        for event_id in data_event_ids.each():
            event = event_id.val()
            #print('wew')
            #print(event)
            #print('qwd')
            e = db.child("Events").child(event["event_id"]).get().val()
            
            e["event_id"] = event["event_id"]
            events.append(e)
        return {"data": events}
    except Exception as e:
        print(f"fail to retrieve events data: \n{e}")
        return 1



user_id = 'Kz2ACbvPfQco4o1cZJ5YTw7iUc92'
timeRange = '15'

# get all calendar

calendars = db.child("User").child(user_id).child("calendars").get().val()
earlist_start_time = ''
earlist_end_time = ''

loc_dt = datetime.today() 
time_del = timedelta(minutes=5)  
earlist_start_time = loc_dt + time_del
time_del = timedelta(minutes=int(timeRange))
earlist_end_time = earlist_start_time + time_del
earlist_start_time = earlist_start_time.strftime("%Y-%m-%d %H:%M")
earlist_end_time = earlist_end_time.strftime("%Y-%m-%d %H:%M")


for key, val in calendars.items():

    #if val['calendar_id'] == '18781b3a5ca19b580562cb99e656dd42':
    #    continue
    
    data_event_ids = db.child("Calendars").child(val['calendar_id']).child("Events").get()

    print(data_event_ids.val())
    if data_event_ids.val() == None:
        continue
    
    for event_id in data_event_ids.each():
        print(event_id.val()['event_id'])
        event = event_id.val()
        e = db.child("Events").child(event["event_id"]).get().val()
        #print(e)
        #print('-------------------------------------------------------')
        #e["event_id"] = event["event_id"]
        print(e)
        print('-------------------------------------------------------')
        if e['start_date'] == '' and e['start_time'] == '' and e['end_date'] == '' and e['end_time'] == '':
            continue
        start_time = e['start_date'] + ' ' + e['start_time']
        end_time = e['end_date'] + ' ' + e['end_time']
        if start_time < earlist_end_time:
            temp_time = datetime.strptime(end_time, "%Y-%m-%d %H:%M")
            time_del = timedelta(minutes=5)  
            temp_start = temp_time + time_del
            time_del = timedelta(minutes=int(timeRange))  
            temp_end = temp_start + time_del
            earlist_start_time = temp_start.strftime("%Y-%m-%d %H:%M")
            earlist_end_time = temp_end.strftime("%Y-%m-%d %H:%M")
    

time = earlist_start_time + ' - ' + earlist_end_time

# get user email
email = db.child("User").child(user_id).child('email').get().val()
ret = {'time': time, 'email':email}

print(ret)



from datetime import datetime, timedelta
# get all calendar
calendars = db.child("User").child('Kz2ACbvPfQco4o1cZJ5YTw7iUc92').child("calendars").get().val()

loc_dt = datetime.today()
now = loc_dt.strftime("%Y-%m-%d %H:%M")
event_list = []

for key, val in calendars.items():
    # get all events from all calendars
    data_event_ids = db.child("Calendars").child(val['calendar_id']).child("Events").get()
    if data_event_ids.val() == None:
        continue

    for event_id in data_event_ids.each():
        event = event_id.val()
        e = db.child("Events").child(event["event_id"]).get().val()
        if e['start_date'] == '' and e['start_time'] == '' and e['end_date'] == '' and e['end_time'] == '':
            continue

        # check if event is done    
        end_time = e['end_date'] + ' ' + e['end_time']
        if end_time < now:
            event_list.append(e)

print(event_list)

user_id = 'UmkEPUjA7xfopiibKSCPpQDIpV42'
calendar_id = db.child("User").child(user_id).child("calendars").child("Personal").get().val()['calendar_id']
print(calendar_id)
'''