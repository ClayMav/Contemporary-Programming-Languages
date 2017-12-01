# OWCA Decryption Library

This project contains a C++ class and a helper function to facilitate
decryption of messages transmitted between OWCA agents.

Documentation for the original encryptionscheme can be found publicly
here: <https://sites.google.com/a/mst.edu/price/courses/cs-1570/hw/2015/fall/assignment-06>.
with updated disk information posted here: <http://cpl.mwisely.xyz/hw/1/>.

To verify that the code works properly, this project contains (or it
will eventually) a suite of unit tests.

## Building the Test Suite

To build the tests, you must have a C++ compiler
installed. Doofenshmirtz Evil Incorporated demands you use `g++`, so
you should do that, or you'll have to answer to
[the boss](http://cpl.mwisely.xyz/hw/1/the_boss.gif).

Ain't nobody want that.

The following commands will build (i.e., compile) the unit tests...

```shell
# If you're using g++
$ g++ -Wall -W -s -pedantic-errors -o test_decrypt *.cpp -lboost_unit_test_framework

# Or, you can just use the provided Makefile
$ make
```

Of course, the `$` is there to indicate the beginning of the bash
prompt. You don't need to type a `$` as part of the commands above.

## Running the Test Suite

Once you've built the test suite, it's time to run it. Simply run the
executable produced by `g++`. If you compiled with the sample command
above or with `make`, then the compiled program is called `test_decrypt`.

```shell
$ ./test_decrypt
Running 6 test cases...
test.cpp(19): fatal error in "test_disk1": Test is not ready yet
test.cpp(31): fatal error in "test_disk2": Test is not ready yet
test.cpp(43): fatal error in "test_disk3": Test is not ready yet
test.cpp(55): fatal error in "test_disk4": Test is not ready yet
test.cpp(67): fatal error in "test_disk5": Test is not ready yet
test.cpp(76): fatal error in "test_decrypt_message": Test is not ready yet

*** 6 failures detected in test suite "DecryptorTest"
```

See those failures? That's why Dr. Doofenshmirtz hired you.

## Checking Code Coverage

We've also included a helper script that will compile, run, and check
code coverage of the unit tests.

You can invoke the coverage helper like this....

```shell
$ ./show-coverage
===== Compiling it =====

===== Running a.out =====
Running 6 test cases...
test.cpp(19): fatal error in "test_disk1": Test is not ready yet
test.cpp(31): fatal error in "test_disk2": Test is not ready yet
test.cpp(43): fatal error in "test_disk3": Test is not ready yet
test.cpp(55): fatal error in "test_disk4": Test is not ready yet
test.cpp(67): fatal error in "test_disk5": Test is not ready yet
test.cpp(76): fatal error in "test_decrypt_message": Test is not ready yet

*** 6 failures detected in test suite "DecryptorTest"

===== Checking coverage =====
File 'funcs.cpp'
Lines executed:6.67% of 15
Creating 'funcs.cpp.gcov'
--
File 'rotor.cpp'
Lines executed:1.05% of 95
Creating 'rotor.cpp.gcov'

===== Cleaning up coverage data files =====
```

As you can see, we've executed `6.67% of 15` lines of code in
`funcs.cpp` and `1.05% of 95` lines of code in `rotor.cpp`. That's not
very good. Surely we can get 100% code coverage...

The `show-coverage` script also produces two files:
`funcs.cpp.coverage` and `rotor.cpp.coverage`. Those two files show us
how many times each line of code was run.

For example, the example run above produced the following `funcs.cpp.coverge`...

```
    -:    0:Source:funcs.cpp
    -:    0:Programs:2
    -:    1:// -*- mode: c++ -*-
    -:    2:/**
    -:    3: * \file funcs.cpp
    -:    4: *
    -:    5: * \brief Decryption Helper Functions
    -:    6: *
    -:    7: * Provides a helper function for decrypting messages that were
    -:    8: * encrypted using OWCA's message encryption program
    -:    9: */
    -:   10:#include "funcs.h"
    -:   11:
#####:   12:string decrypt_message(int disk1, int disk2, int disk3, string encrypted)
    -:   13:{
#####:   14:  Rotor left(disk1);
#####:   15:  Rotor middle(disk2);
#####:   16:  Rotor right(disk3);
    -:   17:
    -:   18:  char current = '\0';
    -:   19:
#####:   20:  string result = "";
    -:   21:
#####:   22:  to_upper(encrypted);
    -:   23:
#####:   24:  for (unsigned int i = 0; i < encrypted.length(); i++)
    -:   25:  {
#####:   26:    current = encrypted[i];
    -:   27:
#####:   28:    if (current != '_')
    -:   29:    {
#####:   30:      current = left.decrypt(current);
#####:   31:      current = middle.decrypt(current);
#####:   32:      current = right.decrypt(current);
    -:   33:    }
#####:   34:    result += current;
    -:   35:  }
    -:   36:
#####:   37:  return result;
    3:   38:}
```

You'll notice a few things:

* The lines are numbered (isn't that nice?)
* Each line is prefixed with `<number of times run>:`.
* Lines run `-` times aren't counted. Comments, braces, that kind of thing.
* All the lines marked `#####` were never run.
* Line 38 was run 3 times, apparently?
