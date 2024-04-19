import os
import pytest
#from project import create_app
from flask import Flask, Blueprint
from server import *


@pytest.fixture(scope='module')
def client():
    app = create_app()

    app.config['TESTING'] = True
    with app.app_context():
        client = app.test_client()
        yield client

