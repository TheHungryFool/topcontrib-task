from gevent import monkey
monkey.patch_all()

import sys
import json
import logging
from flask import Flask
from flask_cors import CORS


logging.basicConfig(stream=sys.stdout, level=logging.INFO)

def get_config():
    with open('config.json', 'r') as config_file:
        config = json.load(config_file)

    return config

app = Flask(__name__)
app.config.update(get_config())

CORS(app)

from topcontrib import routes
