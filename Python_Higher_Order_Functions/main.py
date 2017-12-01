"""Unswaps minion name tags.

This module can be used as a library or as a program. For program
usage, please run the program as shown::

  python3.5 main.py --help

"""

import argparse
import json
import sys

from swapevent import to_swapevent
from functools import reduce
from copy import deepcopy


def swap_nametags(acc, sw):
    """Create a new ID/Name dict with swapped entries.

    Creates a copy of *acc* and uses *sw* to swap the names in the
    copy.  *acc* **is not modified**. Instead, this function returns a
    **modified copy** of *acc*.

    :param dict acc: A dict mapping minion IDs to names.

    :param SwapEvent sw: A :class:`swapevent.SwapEvent` describing a
        name tag swap

    :return: A **copy** of *acc* with names swapped according to *sw*
    :rtype: dict

    """
    # deepcopy so as not to modify acc
    swapped = deepcopy(acc)

    # swaps relevant nametags
    temp = swapped[sw.m1]
    swapped[sw.m1] = swapped[sw.m2]
    swapped[sw.m2] = temp

    return swapped


def unswap(initial, swaps):
    """Unswap names according to initial state and swap data.

    Follows a list of :class:`swapevent.SwapEvent` s to determine the original
    mapping of minion IDs to names (i.e. their actual names).

    **The code in the body of this function should not be modified.**

    :param dict initial: A dict of the **most recent** mapping of
        minion IDs to names. The result of playing their game.
    :param swaps: The swaps that occurred to mess up the name/id mapping
    :type swaps: list of :class:`swapevent.SwapEvent`
    :return: The original mapping of minion IDs to their name tags
    :rtype: dict

    """
    # Note that the body of this function is complete,
    # code-wise. Just address the TODO comments.

    # Sorts a list of SwapEvents in order from newest to oldest
    sorted_swaps = sorted(swaps, reverse=True)

    # Runs swap_nametags with the list of sorted swaps and undoes every swap.
    # each item in sorted swaps gets called on the same dict, which evolves
    # each iteration.
    return reduce(swap_nametags, sorted_swaps, initial)


def load_and_unswap(state_file, swap_file):
    """Load data from provided file paths and returns unswapped names.

    **The code in the body of this function should not be modified.**

    :param str state_file: Path to the file containing JSON-formatted
        ID/name data
    :param str swap_file: Path to the file containing swap data
    :return: A mapping of minion IDs to their actual names
    :rtype: dict

    """
    # Open the initial state file
    with open(state_file) as state, open(swap_file) as swap:
        # Output the JSON-serialized mapping of minion ID to original
        # name tag
        return unswap(json.load(state), to_swapevent(swap))


def main():
    """Configure CLI args and unswap data."""
    # Set up CLI argument parser
    parser = argparse.ArgumentParser()
    parser.add_argument('--id',
                        help='Output the name of the minion with this ID')
    parser.add_argument('swap_file', help='A file containing swap data')
    parser.add_argument('state_file', help='A file containing name tag state')
    args = parser.parse_args()

    # Try to process the files in the command, if it fails from file
    # foolishness, will be caught by different possibilities
    try:
        minions = load_and_unswap(args.state_file, args.swap_file)
    except FileNotFoundError as e:
        sys.exit("Error! File does not exist! {}".format(e))
    except IsADirectoryError as e:
        sys.exit("Error! One of those was a directory! {}".format(e))
    except OSError as e:
        sys.exit("Error! File shenanigans are occuring! {}".format(e))
    # Try to print the output for the id flag, then if no id flag was given,
    # print the minions in json format. If it fails, give an error message
    try:
        if args.id is not None:
            print("{}: {}".format(args.id, minions[args.id]))
        else:
            print(json.dumps(minions))
    except KeyError:
        print("Error! ID {} does not exist!".format(args.id))


if __name__ == '__main__':
    main()
