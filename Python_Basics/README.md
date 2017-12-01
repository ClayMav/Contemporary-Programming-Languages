# Gug-inator

This project contains a Python program designed to help Norm care for his pet.
It has a number of commands:
- food tells Norm what to feed Gug
- walk counts distance for a given walk
- mood modifies a song to help Gug get to sleep, the output to be played by Norm

## Running Your Tests

Tests for this program have been written using [pytest](http://pytest.org).
In order to run these tests, you must have access to a pytest executable.
To make install simpler, a script has been included to install (if necessary) and run pytest automatically.
This script creates a [virtual environment][1] within the project so that no system files are affected.

To run the tests, use the script as shown below:

~~~shell
# Assuming that you are at the top directory of your project
./py.test
~~~

## Running the Program

To run the guginator, simply do the following:

~~~shell
# Assuming that you are at the top directory of your project
python3 guginator.py
~~~

## Commands:
For the food command, called like:
```
# Assuming that you are at the top directory of your project
python3 guginator.py food Monday
Gug wants one gallon of saurkraut
```
You can input any of the following days of the week, case-agnostic and it will give the food response.

|Day       |Food                   |
|----------|-----------------------|
|Sunday    |frozen corn            |
|Monday    |one gallon of saurkraut|
|Tuesday   |drywall                |
|Wednesday |grass clippings        |
|Thursday  |old bananas            |
|Friday    |dirt                   |

For the walk command, called like:
```
# Assuming that you are at the top directory of your project
python3 guginator.py walk 0,0 0,3 2,3 2,2 3,2
(3, 4)
```
Inputting coordinates will net you a response with (the distance north/south, the distance east/west)

For the mood command, called like:
```
# Assuming that you are at the top directory of your project
python3 guginator.py mood aquamablue nopaz
```
Gug  likes his songs very particular. The song starts at 
```
['Db', 'Bb', 'Db', 'F', 'Db', 'F', 'Ab', 'Ab', 'Ab', 'Ab']
```
and according to the table below, shifts according to an offset for the color of each eye.

|Eye Color   |Offset    |
|------------|----------|
|bluce       |0         |
|turporple   |1         |
|aquamablue  |2         |
|nopaz       |3         |

[1]: http://docs.python-guide.org/en/latest/dev/virtualenvs/
