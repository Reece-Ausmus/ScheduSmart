# this is the start of the server, where everything is initialized for flask to run
# to start the server, run "flask --app server.py run" on terminal for windows
from flask import Flask
from flask_cors import CORS
from flask_session import Session
import secrets


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

    # import route that accept signal from React
    from route import account
    app.register_blueprint(account)

    # configure flask sessions
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SECRET_KEY'] = secrets.token_hex(32)

    Session(app)

    return app
