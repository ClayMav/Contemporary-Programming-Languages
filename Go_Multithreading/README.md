# Smartness-Determinator

This tool is designed to help Dr. Doofenshmirtz determine the smartness of various books, so that he can impress his fancy new friends.

## Setup Go 1.9.2

~~~shell
$ bash setup.sh
$ GOROOT="$(pwd)/go" ./go/bin/go version
go version go1.9.2 linux/amd64
~~~

## Run the Program

Build and run with `go run`

~~~shell
# List links
$ GOROOT="$(pwd)/go" ./go/bin/go run main.go http://cpl.mwisely.xyz/hw/7/books/Alices-Adventures-in-Wonderland.txt
~~~
> If that didn't work, it is because that link is dead. Feel free to replace that link with any other UTF-8 txt link

Or build an executable with `go build`.
Don't forget to recompile!

~~~shell
$ GOROOT="$(pwd)/go" ./go/bin/go build main.go
$ ./main http://cpl.mwisely.xyz/hw/7/books/Alices-Adventures-in-Wonderland.txt
$ ./main -workers 4 http://cpl.mwisely.xyz/hw/7/books/Alices-Adventures-in-Wonderland.txt http://cpl.mwisely.xyz/hw/7/books/Fritiofs-Saga.txt http://cpl.mwisely.xyz/hw/7/books/Metamorphosis.txt
~~~
> If that didn't work, it is because that link is dead. Feel free to replace that link with any other UTF-8 txt link

## Description
This application will accept a `-workers` flag with a number of goroutines to run, and as many links as you want.

It will go through every link and calculate the smartness, or average word length.