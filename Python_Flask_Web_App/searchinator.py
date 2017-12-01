"""A web application for tracking inators.

This module contains route definitions for a web application. It uses
the Flask microframework.

To run the application, install all package requirements listed in
``requirements.txt`` and run::

  FLASK_APP=searchinator.py flask run

To run the application in debug mode, simply set the ``FLASK_DEBUG``
environment variable to ``1`` ::

  FLASK_APP=searchinator.py FLASK_DEBUG=1 flask run

Note that it is not suitable to run this application (or any web
application) in debug mode if it is running in production. Customers
get scared when they see tracebacks.

"""
import uuid

from flask import abort, Flask, flash, redirect, request, session, url_for
from datetime import datetime

from utils import add_data_param, login_required, uses_template
from condition import Condition

app = Flask(__name__)
app.secret_key = 'very.secret'
app.config['DATA_PATH'] = 'inator_data.json'


@app.route('/')
@login_required
@add_data_param(app.config['DATA_PATH'])
@uses_template('list-inators.html')
def list_inators(data):
    """List all inators."""
    try:
        inators = data['inators']
    except KeyError:
        inators = {}

    by_name = sorted(inators.values(), key=lambda x: x['name'])
    by_cond = sorted(by_name, key=lambda x: x['condition'], reverse=True)

    return {
        'inators': by_cond
    }


@app.route('/add/', methods=['POST', 'GET'])
@login_required
@add_data_param(app.config['DATA_PATH'])
@uses_template('add-inator.html')
def add_inator(data):
    """Add a new inator."""
    if request.method == 'GET':
        return {}
    if request.method == 'POST':
        try:
            inators = data['inators']
        except KeyError:
            data['inators'] = {}
            inators = data['inators']
        try:
            Condition(int(request.form['condition']))
        except ValueError:
            abort(400)

        new_inator = {
            'ident': str(uuid.uuid4()),
            'name': request.form['name'],
            'added': datetime.now(),
            'location': request.form['location'],
            'condition': Condition(int(request.form['condition'])),
            'description': request.form['description']
        }
        inators[new_inator['ident']] = new_inator
        data['inators'] = inators

        flash("Successfully added " + new_inator['name'] + ".", 'success')

        return redirect(url_for('list_inators'))


@app.route('/view/<ident>/', methods=['GET'])
@login_required
@add_data_param(app.config['DATA_PATH'])
@uses_template('view-inator.html')
def view_inator(data, ident):
    """View details of an inator."""
    try:
        return {
            'inator': data['inators'][ident]
        }
    except KeyError:
        flash("No such inator with identifier " + ident + ".", 'danger')
        return redirect(url_for('list_inators'))


@app.route('/delete/<ident>/', methods=['POST', 'GET'])
@login_required
@add_data_param(app.config['DATA_PATH'])
@uses_template('delete-inator.html')
def delete_inator(data, ident):
    """Delete an existing inator."""
    try:
        data['inators'][ident]
    except KeyError:
        flash("No such inator with identifier " + ident + ".", 'danger')
        return redirect(url_for('list_inators'))

    if request.method == 'GET':
        return {
            'inator': data['inators'][ident]
        }

    if request.method == 'POST':
        thing = data['inators'].pop(ident)
        flash("Successfully deleted " + thing['name'] + " (" + ident +
              ").", 'success')
        return redirect(url_for('list_inators'))


@app.route('/login/', methods=['POST', 'GET'])
@add_data_param(app.config['DATA_PATH'])
@uses_template('login.html')
def login(data):
    """Login to the searchinator."""
    if 'username' in session:
        flash("You are already logged in. Log out to log in again.", 'danger')
        return redirect(url_for('list_inators'))

    if request.method == 'GET':
        return {}
    if request.method == 'POST':
        try:
            if not request.form['username'] in data['users']:
                raise KeyError
        except KeyError:
            flash("Cannot find user " +
                  request.form['username'] + ". Try again.", 'danger')
            return redirect(url_for('login'))

        usr = data['users'][request.form['username']]

        if 'password' not in usr:
            flash("Cannot find password for user " +
                  request.form['username'] + "!", 'danger')
            return redirect(url_for('login'))

        if usr['password'] == request.form['password']:
            session['username'] = request.form['username']
            flash("Successfully logged in as " +
                  session['username'] + ".", 'success')
            return redirect(url_for('list_inators'))
        else:
            flash("Incorrect password for user " +
                  request.form['username'] + ".", 'danger')
            return redirect(url_for('login'))


@app.route('/logout/', methods=['POST', 'GET'])
@login_required
@uses_template('logout.html')
def logout():
    """Logout of the searchinator."""
    if request.method == 'GET':
        return {}
    if request.method == 'POST':
        session.pop('username')
        flash("Successfully logged out.", 'success')
        return redirect(url_for('login'))
