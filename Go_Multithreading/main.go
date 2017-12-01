package main

import (
	"bufio"
	"errors"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
	"unicode/utf8"
)

const usage = `
This program calculates the smartness of UTF-8 encoded books.

It accepts one or more URLs as positional arguments.
Each URL should point to a UTF-8 encoded ".txt" file.

`

func parseCLI() (numWorkers uint, links []string) {
	// Set the usage message for the cli parser
	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, "Usage: %s [options] URL [URL ...]\n", os.Args[0])
		fmt.Fprintf(os.Stderr, usage)
		flag.PrintDefaults()
	}

	// Setup the flags we're looking for
	flag.UintVar(&numWorkers, "workers", 1, "The number of workers to use.")

	// Parse the flags
	flag.Parse()

	// Need at least one worker
	if numWorkers < 1 {
		fmt.Fprintf(os.Stderr, "Number of workers must be greater than 0.\n\n")
		flag.Usage()
		os.Exit(1)
	}

	// Need at least one link to process
	if flag.NArg() < 1 {
		fmt.Fprintf(os.Stderr, "Need at least one link to process.\n\n")
		flag.Usage()
		os.Exit(1)
	}

	links = flag.Args()
	return
}

type Result struct {
	link      string  // The link to a book
	smartness float64 // The smartness of the book
	err       error   // Error information, if any
}

func (r Result) String() string {
	if r.err != nil {
		return fmt.Sprintf("%v\n\terror: %v", r.link, r.err)
	} else {
		return fmt.Sprintf("%s\n\tsmartness: %.4f", r.link, r.smartness)
	}
}

func calculateSmartness(s io.Reader) (float64, error) {
	scanner := bufio.NewScanner(s)
	scanner.Split(bufio.ScanWords)
	var count, letters float64
	for scanner.Scan() {
		if utf8.ValidString(scanner.Text()) {
			count++
			letters += float64(utf8.RuneCountInString(scanner.Text()))
		} else {
			return 0, errors.New("Input is not valid UTF-8")
		}
	}
	if scanner.Err() != nil {
		return 0, errors.New("brokenReader is always broken.")
	}
	if count > 0 {
		return letters / count, nil
	} else {
		return 0, nil
	}
}

func fetchAndCalculate(links chan string, results chan Result) {
	for link := range links {
		if string(link[len(link)-4:]) != ".txt" {
			rip := errors.New("Link must end with \".txt\"")
			results <- Result{link, 0, rip}
			continue
		}

		response, err := http.Get(link)
		if err != nil {
			results <- Result{link, 0, err}
			continue
		}
		if response.StatusCode != 200 {
			rip := errors.New("Did not receive 200 OK")
			results <- Result{link, 0, rip}
			continue
		}

		smarts, err := calculateSmartness(response.Body)
		if err != nil {
			results <- Result{link, 0, err}
			continue
		}
		out := Result{link, smarts, nil}
	        results <- out

	}
}

func main() {
	numWorkers, links := parseCLI()
	linksChan := make(chan string)
	results := make(chan Result, len(links))
	for i := 0; uint(i) < numWorkers; i++ {
		go fetchAndCalculate(linksChan, results)
	}
	for i := 0; i < len(links); i++ {
		linksChan <- links[i]
	}
        close(linksChan)

	for i := 0; i < len(links); i++ {
		fmt.Println(<-results)
	}
}
