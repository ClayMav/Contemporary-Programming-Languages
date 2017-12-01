"""Tests for guginator module

"""
import pytest

from guginator import UserInputError, food, walk, mood


class FakeNamespace(object):
    """This is a dummy class used to imitate an argparse.Namespace object.
    Simply assign member variables as necessary.

    """
    pass


def test_invalid_day():
    """Ensure we raise an exception when given a bogus day"""
    # Create a fake namespace and set its "day" to something dumb
    n = FakeNamespace()
    n.day = "Foosday"

    with pytest.raises(UserInputError):
        food(n)


def test_valid_day():
    """Ensure we get proper output and no errors when given a correct day"""
    # Create fake namespace
    n = FakeNamespace()

    try:
        n.day = "Monday"
        assert food(n) == "Gug wants one gallon of saurkraut"
        n.day = "monday"
        assert food(n) == "Gug wants one gallon of saurkraut"
    except UserInputError:
        raise pytest.fail("DID RAISE {0}".format(UserInputError))


def test_invalid_walk():
    """Make sure invalid params raise UserInputError"""
    n = FakeNamespace()
    n.path = [
        "0,0", "0,bob"
    ]

    with pytest.raises(UserInputError):
        walk(n)

    n.path = [
        "0,jim", "0,bob"
    ]

    with pytest.raises(UserInputError):
        walk(n)

    n.path = [
        "0,0", "0,,3"
    ]

    with pytest.raises(UserInputError):
        walk(n)


def test_valid_walk():
    """Make sure we're computing the example walk correctly"""
    # Create a fake namespace and set its "path"
    n = FakeNamespace()
    n.path = [
        "0,0", "0,3", "2,3", "2,2", "3,2", "3,3",
        "4,3", "4,1", "2,1", "2,0", "0,0"
    ]

    assert walk(n) == (8, 8)


def test_invalid_mood():
    """Make sure invalid colors raise UserInputError"""
    n = FakeNamespace()
    n.left = "blue"
    n.right = "bluce"

    with pytest.raises(UserInputError):
        mood(n)

    n.left = "bluce"
    n.right = "red"

    with pytest.raises(UserInputError):
        mood(n)


def test_valid_mood():
    """Make sure valid colors output proper result and no errors are raised"""
    n = FakeNamespace()
    try:
        n.left = "bluce"
        n.right = "bluce"

        assert mood(n) == [
            'Db', 'Bb', 'Db', 'F', 'Db',
            'F', 'Ab', 'Ab', 'Ab', 'Ab'
        ]

        n.left = "aquamablue"
        n.right = "nopaz"

        assert mood(n) == ['Db', 'F', 'Db', 'F', 'Ab']
    except UserInputError:
        raise pytest.fail("DID RAISE {0}".format(UserInputError))
