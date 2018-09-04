#!/bin/bash

# Install virtualenv for python
python3 -m pip install virtualenv

# Set up virtualenv
virtualenv venv
source venv/bin/activate

# Install flask
python3 -m pip install flask

