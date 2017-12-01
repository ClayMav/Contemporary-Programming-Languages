import argparse
import sys


# Implement missing functions and exception classes here

class UserInputError(Exception):
    """
    Raised when input provided by the user is invalid or inappropriately
    formatted, preventing the program from proceeding.
    """
    pass


def food(args):
    """
    Determine which food to feed Gug for a given day of the week.
    Parameters: args (argparse.Namespace) – A Namespace object. args.day should
        be a day of the week. It must be a str.
    Returns: A message explaining what to feed Gug
    Return type: str
    Raises: UserInputError – if args.day is not a valid day of the week
    """
    days = {
        "sunday": "frozen corn",
        "monday": "one gallon of saurkraut",
        "tuesday": "hot dog water",
        "wednesday": "drywall",
        "thursday": "grass clippings",
        "friday": "old bananas",
        "saturday": "dirt"
        }
    try:
        out = "Gug wants " + days[args.day.lower()]
    except KeyError:
        raise UserInputError(args.day + " is not a valid day of the week")
    return out


def walk(args):
    """
    Calculates the east-west and north-south Manhattan distances traveled by
    walking Gug through the Downtown section of the Tri-State Area.

    The path provided must be a list of coordinates as strings with format x,y,
    where x and y are integers corresponding to the x- and y-coordinates of a
    map of Downtown.
    Parameters: args (argparse.Namespace) – A Namespace object. args.path
        should be a list of x,y coordinates as str.
    Returns: A tuple of the form (east-west distance, north-south distance)
    Return type: tuple of int
    Raises: UserInputError – if args.path contains invalid coordinates
    """
    xtotal = 0
    ytotal = 0
    previous = 0, 0
    for i in args.path:
        current = i.split(',')
        try:
            current = int(current[0]), int(current[1])
        except ValueError:
            raise UserInputError(str(i) + " is an invalid coordinate")
        xtotal += abs(current[0] - previous[0])
        ytotal += abs(current[1] - previous[1])
        previous = current
    return xtotal, ytotal


def mood(args):
    """
    Computes Gug’s bedtime song based on the color of his eyes.
    Parameters: args (argparse.Namespace) – A Namespace object. args.right
        should be a str: the color of Gug’s right eye. args.left should be a
        str: the color of Gug’s left eye.
    Returns: The notes to play for Gug
    Return type: list of str
    Raises: UserInputError – if args.right is not a valid color
        UserInputError – if args.left is not a valid color
    """
    song = ['Db', 'Bb', 'Db', 'F', 'Db', 'F', 'Ab', 'Ab', 'Ab', 'Ab']
    offsets = ["bluce", "turporple", "aquamablue", "nopaz"]
    rightOffset = None
    leftOffset = None

    if args.right.lower() not in offsets:
        raise UserInputError(args.right + " is not a valid color")
    if args.left.lower() not in offsets:
        raise UserInputError(args.left + " is not a valid color")

    for i, j in enumerate(offsets):
        if j == args.right.lower():
            rightOffset = -1 * i
        if rightOffset == 0:
            rightOffset = None
        if j == args.left.lower():
            leftOffset = i
    out = song[leftOffset:rightOffset]
    return out


def main():
    """Parses command line arguments and calls helper functions
    accordingly.

    There is no need to change anything in this function. It is
    complete as it is.

    """

    # Set up our command line parser
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers(title='subcommands')
    parser.set_defaults(func=lambda x: parser.format_help())

    # Handle the "food" subcommand
    food_subparser = subparsers.add_parser('food', help='Identify food')
    food_subparser.add_argument('day', help='The day of the week')
    food_subparser.set_defaults(func=food)

    # Handle the "walk" subcommand
    walk_subparser = subparsers.add_parser('walk', help='Calculate walk')
    walk_subparser.add_argument('path', nargs='+', help='The path you walked')
    walk_subparser.set_defaults(func=walk)

    # Handle the "mood" subcommand
    mood_subparser = subparsers.add_parser('mood', help='Handle mood')
    mood_subparser.add_argument('left', help='The color of Gug\'s left eye')
    mood_subparser.add_argument('right', help='The color of Gug\'s right eye')
    mood_subparser.set_defaults(func=mood)

    # Parse the arguments from the command line
    args = parser.parse_args()

    try:
        # Invoke the function the user requested (food, walk, or mood)
        # and print the return value
        print(args.func(args))
    except UserInputError as e:
        # If the invoked function raised a UserInputError, print out
        # the error message and return a non-zero exit code.
        sys.exit("Error! {}".format(e))


if __name__ == '__main__':
    # Don't change this either.
    main()
