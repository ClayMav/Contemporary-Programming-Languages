# Friend-inator

The Friend-inator is a [Hubot](http://hubot.github.com) designed to keep Norm busy.

This project contains several scripts (within the `scripts/` directory) that will enable a Hubot to perform several useful actions.

## Running the code

~~~ shell
$ bash setup.sh

# ... a bunch of output ...

node-v6.11.4-linux-x64.tar.xz: OK
$ ./bin/node
>
~~~

Hooray!

## Install Prerequisite Packages

~~~ shell
$ ./bin/npm install -d
~~~~

This will have `npm` install the necessary packages listed in the `package.json` file.
You'll have to run this before you run your Hubot, the tests, or the style checker.

You will see a lot (like, a **lot**) of output fly by.
Be patient.

## Run Tests

~~~ shell
$ ./mocha.sh
~~~~

This will run the `Mocha` package which runs the tests in the `test` directory.
The options in `test/mocha.opts` tells `mocha` to compile any CoffeeScript files from the Hubot library into JavaScript prior to executing them.

**Don't rename or remove the `test` directory, `mocha` needs this.**

## Run the Program

~~~ shell
$ ./hubot.sh
Hubot>
~~~

This will invoke Hubot.
Hubot will then look in `scripts/` for Friend-inator's custom scripts.

Say `Hubot help` to get commands information!

<!-- LocalWords: executables REPL js Hubot hubot -->
<!-- LocalWords: npm json eslint -inator -inator's -->
