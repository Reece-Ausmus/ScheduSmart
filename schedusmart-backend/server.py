# this is the start of the server, where everything is initialized for flask to run
# to start the server, run "flask --app server.py run" on terminal for windows
from flask import Flask
from flask_cors import CORS
from fire_base import *


def create_app():
    app = Flask(__name__)

    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

    # import route that accept signal from React
    from route import account
    app.register_blueprint(account)

    from route import language
    app.register_blueprint(language)

    return app