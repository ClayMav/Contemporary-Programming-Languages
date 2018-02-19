## Takeaways
- Using go in servers
- Handler functions

## Relevant Resources
- Go packages
  - Specifically [net/http](https://golang.org/pkg/net/http/)
  - Refer to the imports listed at the top of each source file. Documentation can be found on [golang.org](golang.org).

## Tic-Tac-Gug-inator
*Gug has gone rogue. Having gotten ahold of Dr. Doofenshmirtz's prized "Intro to Artificial (Lack of) Intelligence" Gug has uploaded himself to the cloud.*

### Our Story Continues
After stumbling into your job, tired and lazy as always, you find a note from Gug. "Wish me luck, I'm gonna be on the net."

After some careful digging, you find a full web application where Gug has set up to play himself versus an AI of his own creation.

Problem is, Gug never payed attention in the Golang lectures in school, and failed to make his AI work properly and is now trapped in a dead Golang application.

## Your Task
You need to save Gug
- Finish the Golang backend for Gug's fancy new Tic-Tac-Gug site that can
  - Be accessed at `/`
  - Show a json object that contains the game
  - Print the game in the proper way

## Application Description
Your application should:

When accessed, show a JSON object

### Program Design
All you really need to do is read over the code a little bit. The front end is fully complete and is accessible in the client folder.

- Guarantee that the board looks the way it should
- Guarantee that it connects correctly.

### Output Format
The output only requires one line.
```json
{ "game": "X O X O N O X X N " }
```

## Working on the Program
### Setting up the right version of Go
Refer to the setup instructions for [Homework 7](http://cpl.mwisely.xyz/hw/7/#setting-up-the-right-version-of-go).

### Running it
All you have to do is run in the root directory
```bash
$ GOROOT="$(pwd)/go" GOPATH="$(pwd)" ./go/bin/go run server/main.go
```

To see your progress, go to either `http://localhost:<port>` or to see the actual board, open the `client/index.html` file in your (grid-supported) brower of choice

### Output
Make sure your program's output looks like Tic Tac Toe

## Further Details
### Approaching this Assignment
##### You should tackle this assignment as follows:
- Read this entire posting and docs (you'll likely do this more than once).
- Clone the code.
- Run `setup.sh` to download, verify, and unpack Go 1.9.2.
- Implement all features.
- Make sure output fits.
- Run `go fmt`.
- Submit and check GitLab
