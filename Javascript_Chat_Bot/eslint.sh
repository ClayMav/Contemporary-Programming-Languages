#!/bin/bash

# Determine the directory where this bash script lives
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Add node and npm to our PATH. This will enable us to call "node" and
# "npm" directly without a ./bin/ in front of it or anything like
# that.
PATH=$DIR/bin:$PATH

# Check that node is actually installed SOMEWHERE.
which node > /dev/null
if [ "$?" != "0" ]
then
    echo ""
    echo "Looks like Node.js isn't installed anywhere!"
    echo ""
    echo "Try running setup.sh to download and set up Node.js v6.11.X"
    echo "for 64-bit Linux (works on campus Linux machines)."
    echo ""

    exit 1
fi

# Check that we've got the right version of Node.js
if [[ "$(node --version)" != "v6.11."* ]]
then
    echo ""
    echo "Looks like Node.js is the wrong version!"
    echo "Found $(node --version) in your PATH instead of v6.11.X"
    echo ""
    echo "Try running setup.sh to download and set up Node.js v6.11.X"
    echo "for 64-bit Linux (works on campus Linux machines)."
    echo ""

    exit 1
fi

# Check that eslint is actually installed...
if [ ! -e $DIR/node_modules/.bin/eslint ]
then
    echo ""
    echo "OH NO! You don't have eslint installed."
    echo ""
    echo "Run the following first in order to install missing packages:"
    echo ""
    echo -e "\t./bin/npm install -d"
    echo ""

    exit 1
fi

# npm installs the eslint executable within node_modules/.bin, so let's
# add it to our PATH. That way we can run it like....
PATH=$DIR/node_modules/.bin:$PATH

# ... this. Then, we pass all command line arguments received by this
# script to eslint.
eslint "$@"
