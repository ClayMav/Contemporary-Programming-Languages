# Searchinator

This project contains a Python program designed to help Dr. Doofenshmirtz's temporary employees catalog his collection of inators.

## Setting up a `virtualenv`

You will want to use a [virtualenv](https://virtualenv.pypa.io/en/stable/) for this project.

To set up your virtualenv, simply...

~~~shell
# Change into your project directory (i.e., the directory where this README lives)
$ cd # wherever your directory is

# Create a virtual environment **using the correct version of Python** and name it 'env'
$ virtualenv --python=$(which python3.5) env

# Run `ls` to verify that the env directory was created
$ ls
... requirements.txt env searchinator.py  ...

# Enter the virtualenv
$ source env/bin/activate

# Notice that we have a little doodah at the front of our prompt that indicates
# that we're in the virtualenv now
(env) $

# Now we can install required Python packages
(env) $ pip install -r requirements.txt

# Whenever we're done working, we can run `deactivate` to exit the virtualenv...
(env) $ deactivate

# ...and our little indicator is gone.
$
~~~~

## Running Tests

Running `pip install -r requirements.txt` in your virtualenv will install pytest for you.
To run your tests, do the following:

~~~shell
# Activate your virtualenv (which is already setup and named "env")
$ source env/bin/activate
(env) $ py.test
~~~~

By default, `py.test` should only collect the tests in the `test` directory.
If you want to run tests from a specific file, just pass the file name as a positional argument.

~~~shell
(env) $ py.test test/test_utils.py
~~~

## Running the Program

Running `pip install -r requirements.txt` in your virtualenv installs packages required to run your web application.
To run the web application, do the following:

~~~shell
# Activate your virtualenv (which is already setup and named "env")
$ source env/bin/activate
(env) $ FLASK_APP=searchinator.py flask run --host=<host> --port=<port>
~~~

This application has many functions, and pages such as:
- at the root `/` you can view all inators in a list
- at `/add/` you can add an inator with a form
- at `/view/<ident>` you can view details about a specific inator
- at `/delete/<ident>` you delete specified inator
- at `/login/` you log in to the site (very insecure)
- at `/logout/` you log out of the site
