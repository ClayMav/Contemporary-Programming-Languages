package main

import (
	"errors"
	"regexp"
	"strings"
	"testing"
)

// brokenReader implements the io.Reader interface, and it never works.
type brokenReader struct{}

// Read immediately returns an error with a static message.
func (b brokenReader) Read(p []byte) (n int, err error) {
	return 0, errors.New("brokenReader is always broken.")
}

func TestResultStringFormat(t *testing.T) {
	r := Result{link: "link1"}
	if expected, actual := "link1\n\tsmartness: 0.0000", r.String(); actual != expected {
		t.Errorf("Expected %q to equal %q", actual, expected)
	}

	r = Result{link: "link2", smartness: 10.12345}
	if expected, actual := "link2\n\tsmartness: 10.1235", r.String(); actual != expected {
		t.Errorf("Expected %q to equal %q", actual, expected)
	}

	r = Result{link: "link3", smartness: 10.12345, err: errors.New("oh no")}
	if expected, actual := "link3\n\terror: oh no", r.String(); actual != expected {
		t.Errorf("Expected %q to equal %q", actual, expected)
	}
}

func TestSmartnessCalculationASCII(t *testing.T) {
	r := strings.NewReader("Here are some words. We'll see what the smartness is.")
	expected := 4.4
	actual, err := calculateSmartness(r)
	switch {
	case err != nil:
		t.Error("Encountered unexpected error when calculating smartness:", err)
	case expected != actual:
		t.Errorf("Expected smartness to be %f, not %f", expected, actual)
	}
}

func TestSmartnessCalculationUnicode(t *testing.T) {
	r := strings.NewReader("Der Halt war außerplanmäßig.")
	expected := 6.25
	actual, err := calculateSmartness(r)
	switch {
	case err != nil:
		t.Error("Encountered unexpected error when calculating smartness:", err)
	case expected != actual:
		t.Errorf("Expected smartness to be %f, not %f", expected, actual)
	}
}

func TestSmartnessCalculationBadUTF8(t *testing.T) {
	r := strings.NewReader("Let's insert a garbage  byte: \xFF. That'll show 'em.")
	_, err := calculateSmartness(r)
	message := "Input is not valid UTF-8"

	switch {
	case err == nil:
		t.Error("Error was non-nil")
	case err != nil && err.Error() != message:
		t.Errorf("Expected error message to be \"%s\", not %v", message, err)
	}
}

func TestSmartnessCalculationScanError(t *testing.T) {
	r := brokenReader{}
	_, err := calculateSmartness(r)
	message := "brokenReader is always broken."

	switch {
	case err == nil:
		t.Error("Error was non-nil")
	case err != nil && err.Error() != message:
		t.Errorf("Expected error message to be \"%s\", not %v", message, err)
	}
}

func TestFetchAndCalculateBadExtension(t *testing.T) {
	links := make(chan string)
	results := make(chan Result)

	go fetchAndCalculate(links, results)

	link := "http://cpl.mwisely.xyz/bad-extension"
	links <- link
	actual := <-results
	message := "Link must end with \".txt\""

	switch {
	case actual.link != link:
		t.Errorf("Expected actual.link to be \"%q\" but got \"%q\"", link, actual)
	case actual.err.Error() != message:
		t.Errorf("Expected actual.err to be \"%q\" but got \"%q\"", message, actual)
	}
}

func TestFetchAndCalculate404(t *testing.T) {
	links := make(chan string)
	results := make(chan Result)

	go fetchAndCalculate(links, results)

	link := "http://cpl.mwisely.xyz/does-not-exist.txt"
	links <- link
	actual := <-results
	message := "Did not receive 200 OK"

	switch {
	case actual.link != link:
		t.Errorf("Expected actual.link to be \"%q\" but got \"%q\"", link, actual)
	case actual.err.Error() != message:
		t.Errorf("Expected actual.err to be \"%q\" but got \"%q\"", message, actual)
	}
}

func TestFetchAndCalculateBadDomain(t *testing.T) {
	links := make(chan string)
	results := make(chan Result)

	go fetchAndCalculate(links, results)
	link := "http://nope.mwisely.xyz/does-not-exist.txt"
	links <- link
	actual := <-results

	messageRe := regexp.MustCompilePOSIX("^Get http://nope.mwisely.xyz/does-not-exist.txt: dial tcp: lookup nope.mwisely.xyz on .+: no such host$")

	switch {
	case actual.link != link:
		t.Errorf("Expected actual.link to be \"%q\" but got \"%q\"", link, actual)
	case !messageRe.MatchString(actual.err.Error()):
		t.Errorf("Expected actual.err to match \"%q\" but got \"%q\"", messageRe, actual)
	}

}
