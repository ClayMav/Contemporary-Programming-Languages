"""Test unswapping behavior."""

import pytest

from datetime import datetime
from swapevent import SwapEvent, to_swapevent
from main import unswap, load_and_unswap


class FakeNamespace(object):
    pass


def load_time(t):
    """Return a datetime by parsing *t*."""
    return datetime.strptime(t, "%Y-%m-%dT%H:%M:%S")


def test_unswap_swapevents():
    """Unswap works with instances of SwapEvent."""
    initial = {
        "0": "Gerald",
        "1": "Wayne",
        "2": "Nicholas",
        "3": "Norbert",
        "4": "Dennis"
    }

    swaps = [
        SwapEvent('1', '4', load_time('2017-09-07T20:40:11')),
        SwapEvent('3', '4', load_time('2017-09-07T20:40:20')),
        SwapEvent('3', '2', load_time('2017-09-07T20:39:50')),
        SwapEvent('0', '1', load_time('2017-09-07T20:39:55')),
        SwapEvent('3', '4', load_time('2017-09-07T20:40:51')),
        SwapEvent('0', '3', load_time('2017-09-07T20:40:42')),
        SwapEvent('3', '1', load_time('2017-09-07T20:40:03')),
        SwapEvent('1', '3', load_time('2017-09-07T20:40:37')),
        SwapEvent('4', '1', load_time('2017-09-07T20:40:27')),
        SwapEvent('1', '3', load_time('2017-09-07T20:40:17')),
        SwapEvent('2', '4', load_time('2017-09-07T20:40:45')),
    ]

    solution = {
        "0": "Nicholas",
        "1": "Dennis",
        "2": "Wayne",
        "3": "Norbert",
        "4": "Gerald"
    }

    assert unswap(initial, swaps) == solution


def test_unswap_swaptext():
    """Unswap works with instances of SwapEvent loaded from strings."""
    initial = {
        "0": "Norbert",
        "1": "Dave",
        "2": "Kyle",
        "3": "Dennis",
        "4": "Vincent",
        "5": "Bryan",
        "6": "Dylan",
        "7": "Andrew",
        "8": "Joseph",
        "9": "Bob"
    }

    swap_text = [
        '5 swapped with 8 at 2017-09-07T20:40:40',
        '3 swapped with 9 at 2017-09-07T20:40:20',
        '8 swapped with 4 at 2017-09-07T20:39:59',
        '8 swapped with 6 at 2017-09-07T20:40:52',
        '5 swapped with 0 at 2017-09-07T20:39:52',
        '9 swapped with 2 at 2017-09-07T20:40:12',
        '0 swapped with 5 at 2017-09-07T20:39:44',
        '2 swapped with 9 at 2017-09-07T20:39:37',
        '8 swapped with 6 at 2017-09-07T20:40:07',
        '2 swapped with 6 at 2017-09-07T20:40:50',
        '2 swapped with 4 at 2017-09-07T20:40:30',
    ]

    solution = {
        "0": "Norbert",
        "1": "Dave",
        "2": "Vincent",
        "3": "Bob",
        "4": "Kyle",
        "5": "Dylan",
        "6": "Bryan",
        "7": "Andrew",
        "8": "Joseph",
        "9": "Dennis"
    }

    swaps = to_swapevent(swap_text)

    assert unswap(initial, swaps) == solution


def test_filenotfounderror():
    args = FakeNamespace()
    args.swap_file = "./testfiles/swaps.txt"
    args.state_file = "./testfiles/gersmack.txt"

    with pytest.raises(FileNotFoundError):
        load_and_unswap(args.state_file, args.swap_file)


def test_isdirectoryerror():
    args = FakeNamespace()
    args.swap_file = "./testfiles/"
    args.state_file = "./testfiles/initial.json"

    with pytest.raises(IsADirectoryError):
        load_and_unswap(args.state_file, args.swap_file)


def test_id_not_there():
    args = FakeNamespace()
    args.id = "400"
    args.swap_file = "./testfiles/swaps.txt"
    args.state_file = "./testfiles/initial.json"

    minions = load_and_unswap(args.state_file, args.swap_file)

    with pytest.raises(KeyError):
        minions[args.id]
