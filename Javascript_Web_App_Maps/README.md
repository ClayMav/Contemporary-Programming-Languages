# Delivery Track-inator

This project contains an HTML file and JavaScript files for a delivery tracking app.

## Run the Program

In order to run the app, just open the HTML file (`index.html`) in Firefox.

## Description

> This app depends on a site that may or may not go down, "[https://delivery-trackinator.appspot.com/position.json](https://delivery-trackinator.appspot.com/position.json)". If this goes down, it will default to a static file in the directory structure

After fetching the json encoded file, it will position each of the minions onto the map around the center point.

This app will track when minion deliver the package they are carrying and then remove them from the map. 