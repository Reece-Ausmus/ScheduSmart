import json
import requests
import flask
from time import gmtime, strftime
from fire_base import *
from calendar_route import *
from server import *

# Sprint 1 User Story #5: add events
def test_create_event(client):
    headers = {
        'Content-type':'application/json', 
        'Accept':'application/json'
    }

    time = strftime("%H:%M", gmtime())

    data = {
        "name": "create_event_test1",
        "desc": "unit test",
        "start_time": time,
        "end_time": time,
        "start_date": "2024-03-01",
        "end_date": "2024-03-02",
        "conferencing_link": "http://",
        "location": "",
        "calendar": "aaff4596801999b1973fdb4709c4b378",
        "repetition_type": "none",
        "repetition_unit": "",
        "repetition_val": 1,
        "selected_days": [],
        "user_id": "UmkEPUjA7xfopiibKSCPpQDIpV42",
        "emails": [],
        "type": 'event',
    }
    

    response = client.post('/create_event', headers=headers, data=json.dumps(data))
    assert response.status_code == 201
    assert response.json['message'] == 'Done'


# Sprint 1 User Story #5: get all events with all info
def test_get_events(client):
    headers = {
        'Content-type':'application/json', 
        'Accept':'application/json'
    }



    data = {
        "calendar_id": "3fa6b343e274ab611889f66d87e635d8",
        "event_filter": "all"
    }
    
    response = client.post('/get_events', headers=headers, data=json.dumps(data))
    assert response.status_code == 201
    assert response.json["data"] != None


# Sprint 1 User Story #6: add assignment
def test_add_assignment(client):
    headers = {
        'Content-type':'application/json', 
        'Accept':'application/json'
    }

    time = strftime("%H:%M", gmtime())

    data = {
        "name": "create_event_test1",
        "desc": "unit test",
        "start_time": time,
        "end_time": time,
        "start_date": "2024-02-01",
        "end_date": "2024-02-02",
        "conferencing_link": "http://",
        "location": "",
        "calendar": "3fa6b343e274ab611889f66d87e635d8",
        "repetition_type": "none",
        "repetition_unit": "",
        "repetition_val": 1,
        "selected_days": [],
        "user_id": "UmkEPUjA7xfopiibKSCPpQDIpV42",
        "emails": [],
        "type": "",
    }
    

    response = client.post('/create_event', headers=headers, data=json.dumps(data))
    assert response.status_code == 201
    assert response.json['message'] == 'Done'