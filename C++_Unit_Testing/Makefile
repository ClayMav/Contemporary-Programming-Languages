# This Makefile contains a single target that builds the test suite in
# test.cpp.
#
# To use it, just run: make
#
# The make program will look for this Makefile and compile your code
# as specified below.

default: funcs.h funcs.cpp rotor.h rotor.cpp test.cpp
	g++ -Wall -W -s -pedantic-errors -o test_decrypt funcs.cpp rotor.cpp test.cpp -lboost_unit_test_framework
