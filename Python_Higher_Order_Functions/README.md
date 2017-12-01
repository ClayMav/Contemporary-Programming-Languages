# Awkward Situation Avoid-inator

This project contains a Python program designed to help Dr. Doofenshmirtz determine the names of his temporary employees.

## Run The Tests

To run your tests, do the following:

~~~shell
# Assuming that you are at the top directory of your project
./py.test
~~~~

## Running the Program

To run the Avoid-inator, do the following:

~~~shell
# Assuming that you are at the top directory of your project
# This will print out the usage for your program
python3.5 main.py --help
~~~

## Usage Description
Long story short, the minions made a game of swapping name tags, and Dr. Doofenschmirtz can’t tell what their names actually are anymore. Now it’s your job to figure out who is who.

Dr. Doofenshmirtz has a super-accurate GPS doodad that tracks minions by employee ID number. Dr. D already asked Norm to walk up to each minion and determine its ID, so now we have a file that tell us which minion ID maps to which (probably incorrect) name tag.

Additionally, Dr. Doofenshmirtz figured out how to get the GPS doodad to output swap data. It turns out to be pretty straightforward: if two minions were close enough to swap name tags, they swapped name tags.

So here’s the data we have:

**Swap data**
  > Describes at what time two minions swapped name tags, identifying minions by employee ID

**Final name tag mapping**
  > Maps a minion’s employee ID to the name tag it is currently wearing. This is the result of playing that ridiculous game. It is likely that most minions are not wearing the correct nametag.

To begin, you can have it reverse the swaps on a specified data set.

Below is an example, you can test with 5, 10, and 100 minions and 10, 100, 1000 swaps.
To access the sample data for each the directory will be `data/<numMinions>/<numSwaps>/<file>`
```
# Assuming that you are at the top directory of your project
python3.5 main.py data/5/10/swaps.txt data/5/10/initial.json
```

If you use the `--id` flag, you can specify a minion ID to see the name of after fixing the swaps.
```
# Assuming that you are at the top directory of your project
python3.5 main.py --id=0 data/5/10/swaps.txt data/5/10/initial.json
```
