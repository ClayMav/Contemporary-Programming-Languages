import datetime


class SwapEvent:

    def __init__(self, m1, m2, time):
        """
        Construct a SwapEvent.m1

        Parameters:

        m1 (str) – The ID of minion 1
        m2 (str) – The ID of minion 2
        time (datetime.datetime) – The time the swap occurred

        Raises: TypeError – if time is not an instance of datetime.datetime
        """
        self.m1 = m1
        self.m2 = m2
        if not isinstance(time, datetime.datetime):
            raise TypeError
        else:
            self.time = time

    def __lt__(self, other):
        """
        Compare two SwapEvent s according to time stamp.

        If we have two SwapEvent s, a and b, a is less than b if a ‘s time
        stamp occurs before b ‘s time stamp.

        Parameters: other (SwapEvent) – the other SwapEvent
        Raises: TypeError – if other is not a SwapEvent
        """
        if not isinstance(other, SwapEvent):
            raise TypeError
        return self.time < other.time

    def __str__(self):
        """
        Return a string representation of a SwapEvent object.
        """
        timeobject = self.time.strftime("%Y-%m-%dT%H:%M:%S")
        return "{} swapped with {} at {}".format(self.m1, self.m2, timeobject)


def to_swapevent(iterable):
    """
    Convert items from an iterable to SwapEvent s.

    Returns an iterable that attempts to convert items yielded from iterable
    into SwapEvent objects and yields the results. In other words, this
    generator iterates through iterable, converts each item to a SwapEvent, and
    yields the resulting SwapEvent.m1 iterable should yield strings with the
    following format:

    ID1 swapped with ID2 at TIME

    Where:

    ID1 is an integer
    ID2 is an integer
    TIME is a date/time formatted as %Y-%m-%dT%H:%M:%S per Python’s
    datetime.strptime documentation.

    Fields must be separated by a single space.
    Parameters: iterable – An iterable that yields str
    """
    for i in iterable:
        words = i.split()
        yield SwapEvent(
            words[0],
            words[3],
            datetime.datetime.strptime(words[5], "%Y-%m-%dT%H:%M:%S")
        )
