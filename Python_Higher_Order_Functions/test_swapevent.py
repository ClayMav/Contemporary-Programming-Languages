"""Test functions and classes from swapevent module."""

import pytest
from datetime import datetime, timedelta
from swapevent import SwapEvent


def test_constructor_datetime():
    """Raise TypeError for improper constructor use."""
    with pytest.raises(TypeError):
        SwapEvent('1', '2', 'banana')


def test_lt():
    """Less-than operator works."""
    now = datetime.now()
    a_minute_ago = now - timedelta(minutes=1)
    a = SwapEvent('1', '2', now)
    b = SwapEvent('3', '4', a_minute_ago)

    # minute_ago is less than now
    assert b < a

    # not (now less than a minute ago)
    assert not (a < b)


def test_lt_type():
    """Raises a TypeError when we compare with non-SwapEvents."""
    now = datetime.now()
    a = SwapEvent('1', '2', now)

    with pytest.raises(TypeError):
        a < 10


def test_str():
    """Ensure we can convert SwapEvents to strings."""
    time = "2017-08-17T21:24:03"
    dtime = datetime.strptime(time, "%Y-%m-%dT%H:%M:%S")
    strswap = str(SwapEvent('2', '4', dtime))
    assert strswap == "2 swapped with 4 at {}".format(time)
