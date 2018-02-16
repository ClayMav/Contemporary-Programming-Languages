"use strict";

let url = "http://localhost:8000";
let data;

function update() {
    // Get the output from the go server as an object
    $.getJSON(url, function(response) {
        data = response.game.split(" ");
        // clear the board
        $("#grid").empty();
        // for each element on the board
        for(let i = 0; i < 9; i++) {
            var tile = document.createElement("div");
            // If space is not empty, print
            if(data[i] != "N") {
                var tileMsg = document.createTextNode(data[i]);
                tile.appendChild(tileMsg);
            }
            $("#grid").append(tile);
        }
    });
}

update();