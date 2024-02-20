# this is the start of the server, where everything is initialized for flask to run
# to start the server, run "flask --app server.py run" on terminal for windows
from flask import Flask


def create_app():
    app = Flask(__name__)

    # import route that accept signal from React
    from route import account
    app.register_blueprint(account)

    return app
