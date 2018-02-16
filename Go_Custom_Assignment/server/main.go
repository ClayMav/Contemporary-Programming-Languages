package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"
)

var gugTurn = true

var grid = [3][3]string{{"N", "N", "N"}, {"N", "N", "N"}, {"N", "N", "N"}}

func main() {
	// Final port is saved as a string
	port := ":8000"

	// Seed the random number generator so that we can use that for our "AI"
	rand.Seed(time.Now().Unix())

	// Configure http route
	http.HandleFunc("/", gameSender)

	// Start the server on localhost and log any errors
	log.Println("HTTP server starting at", port)
	log.Fatal(http.ListenAndServe(port, nil))
}

// This function is responsible for sending out the json whenever someone asks for the site
func gameSender(w http.ResponseWriter, r *http.Request) {
	// Makes it so that an url can access this json
	w.Header().Add("Access-Control-Allow-Origin", "*")

	// if good is false, that means the board is full and the game needs to reset
	good := false
	for y := range grid {
		for x := range grid[y] {
			if grid[y][x] == "N" {
				good = true
				break
			}
		}
	}

	for good == true {
		// Get random position on the board
		y := rand.Intn(3)
		x := rand.Intn(3)
		// if it is empty, play the corresponding players letter
		if grid[y][x] == "N" {
			if gugTurn == true {
				grid[y][x] = "X"
				gugTurn = false
			} else {
				grid[y][x] = "O"
				gugTurn = true
			}
			// Print the grid to the response
			fmt.Fprintf(w, outputGrid())
			return
		}
	}

	// if this is reached, that means that there is no more space on the board, I.E. game over
	grid = [3][3]string{{"N", "N", "N"}, {"N", "N", "N"}, {"N", "N", "N"}}
	fmt.Fprintf(w, outputGrid())
	return
}

// This function takes the grid and makes it a single string
func outputGrid() string {
	var out string

	for y := range grid {
		for x := range grid[y] {
			out += grid[y][x] + " "
		}
	}
	out = "{ \"game\": \"" + out + "\" }"
	log.Println(out)
	return out
}
