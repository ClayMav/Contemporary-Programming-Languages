"""Utility functions for searchinator."""
import datetime
import functools
import json

from flask import flash, redirect, render_template, session, url_for

from condition import Condition

TIME_FORMAT = "%Y-%m-%dT%H:%M:%S"
"""Expected string format for :class:`datetime.datetime`."""


def load_time(x):
    """Load a :class:`datetime.datetime` from :class:`str`."""
    return datetime.datetime.strptime(x, TIME_FORMAT)


def dump_time(x):
    """Dump a :class:`datetime.datetime` to :class:`str`."""
    return x.strftime(TIME_FORMAT)


def as_inator(dct):
    """Attempt to construct values of an inator with appropriate types."""
    keyset = {'ident', 'name', 'location', 'description', 'condition', 'added'}
    if set(dct.keys()) == keyset:
        try:
            new_dct = dct.copy()
            new_dct['added'] = load_time(new_dct['added'])
            new_dct['condition'] = Condition(int(new_dct['condition']))
            return new_dct
        except ValueError:
            return dct
    else:
        return dct


def from_datetime(obj):
    """Convert :class:`datetime.datetime` objects to string."""
    if isinstance(obj, datetime.datetime):
        return dump_time(obj)
    raise TypeError("{} is not JSON serializable".format(repr(obj)))


def add_data_param(path):
    """Wrap a function to facilitate data storage."""
    def wrapper(func):
        @functools.wraps(func)
        def wrapped(*args, **kwargs):
            try:
                with open(path, 'r') as f:
                    datum = json.loads(f.read(), object_hook=as_inator)
            except (OSError, json.decoder.JSONDecodeError):
                datum = {}
            retval = func(datum, *args, **kwargs)
            with open(path, 'w') as f:
                f.write(json.dumps(datum, default=from_datetime))
            return retval
        return wrapped
    return wrapper


def uses_template(template):
    """Wrap a function to add HTML template rendering functionality."""
    def wrapper(func):
        @functools.wraps(func)
        def wrapped(*args, **kwargs):
            template_path = template
            ctx = func(*args, **kwargs)
            if type(ctx) is dict:
                try:
                    return render_template(template_path,
                                           inators=ctx['inators'])
                except KeyError:
                    try:
                        return render_template(template_path,
                                               inator=ctx['inator'])
                    except KeyError:
                        return render_template(template_path, inators=ctx)
            else:
                return ctx
        return wrapped
    return wrapper


def login_required(func):
    """Wrap a function to enforce user authentication."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        if 'username' in session:
            return func(*args, **kwargs)
        else:
            flash("You must be logged in to access that page.", 'danger')
            return redirect(url_for('login'))
    return wrapper
