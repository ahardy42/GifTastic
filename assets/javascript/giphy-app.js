$(document).ready(function () {
    // ------------------------------- global variables go here -----------------------------------

    // initial buttons array
    var buttonsArray = ["Blues Brothers", "Star Wars", "28 Days Later", "Zombie Land", "Alice in Wonderland", "Goonies"];
    // ------------------------------- page building code goes here -------------------------------
    function newButton(value) {
        // create a button using jQuery
        var button = $("<button>");
        button.attr("data-name", value);
        button.addClass("gif-search");
        button.text(value);

        // grab the div these go in and start adding them to the page
        $(".button-land").append(button);
    }

    // makes the button to load more GIFs 
    function moreGifsButton(value, offset) {
        var button = $("<button>");
        button.attr({ "data-offset": offset, "data-value": value });
        button.addClass("more-gifs");
        button.text("Display 10 More GIFs");
        var lastDiv = $(".gif-div").last();
        lastDiv.after(button);
        lastDiv.after("<div class='gif-divider'>");
    }

    function makeGifDiv(data, index) {
        // make the image tag for each data value
        var gifImg = $("<img>");
        gifImg.attr({
            src: data.images.fixed_height_still.url,
            "data-animate": data.images.fixed_height.url,
            "data-still": data.images.fixed_height_still.url,
            "data-state": "still",
            "class": "gif-img",
            "id": "img-number-" + index
        });
        // make the <p> element to put the rating info in
        var ratingP = $("<p>");
        ratingP.addClass("gif-rating");
        ratingP.text(data.rating.toUpperCase());
        // make a <div> to wrap the img and p in
        var gifDiv = $("<div>");
        gifDiv.attr({
            "id": "gif-number-" + index,
            "draggable": "true"
        })
        gifDiv.addClass("gif-div");
        gifDiv.append(gifImg, ratingP);
        // append the div with rating and image to the page at the div w/ class gif-tag
        $(".gif-land").append(gifDiv);
    }

    // ------------------------------ Objects Constructor and Global functions --------------------

    // make the buttons from the initial array
    buttonsArray.forEach(function (name) {
        newButton(name);
    });

    // drag and drop functions
    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }

    function drop(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        console.log(data);
        ev.target.appendChild(document.getElementById(data));
    }

    // ----------------------------- Event Handlers go here --------------------------------------

    $("#search-button").on("click", function () {
        // first, prevent the default behavior of a button!
        event.preventDefault();

        // empty the gif-land div
        $(".gif-land").empty();

        // reset offset for the more gifs button
        var offset = 10;

        // save the value of the form to a variable, as long as the value is a string of some kind and then make a new button
        var value = $("#search-field").val();
        if (value !== "") {
            newButton(value);
            // clear the search field value
            $("#search-field").val("");
        }

        // search the GIPHY api for the value and get 10 results
        var apiKey = "7yoI0Q9V3e6BZA3icwdVrvDDVdqqaLqt";
        var queryUrl = "https://api.giphy.com/v1/gifs/search?api_key=" + apiKey + "&q=" + value + "&limit=10&offset=0&rating=R&lang=en";
        // grab some info from the giphy API
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function (response) {
            response.data.forEach(function (data, index) {
                // make the image div for each data value
                makeGifDiv(data, index);
            });
            // make the more gifs button and add it to the page
            moreGifsButton(value, offset);
        });
    });

    // onclick function for the buttons
    $("body").on("click", ".gif-search", function () {
        // empty the gif-land div
        $(".gif-land").empty();
        // reset offset for the more gifs button
        var offset = 10;
        // save the value of the form to a variable, as long as the value is a string of some kind and then make a new button
        var value = $(this).attr("data-name");

        // search the GIPHY api for the value
        var apiKey = "7yoI0Q9V3e6BZA3icwdVrvDDVdqqaLqt";
        var queryUrl = "https://api.giphy.com/v1/gifs/search?api_key=" + apiKey + "&q=" + value + "&limit=10&offset=0&rating=R&lang=en";
        // grab some info from the giphy API
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            response.data.forEach(function (data, index) {
                // make the image div for each data value
                makeGifDiv(data, index);
            });
            // make the more gifs button and add it to the page
            moreGifsButton(value, offset);
        });

    });

    // onclick function to animate the GIFs on the page
    $("body").on("click", ".gif-img", function () {
        if ($(this).attr("data-state") === "still") {
            // if the state of the pic is "still" then animate the GIF
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        } else {
            // if the state of the pic is "animate" then make the GIF still!
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    });

    // onclick function for the show ten more gifs button 
    $("body").on("click", ".more-gifs", function () {
        // search the "data-value" value and append 10 new resulting GIFs using a search offset. 
        var offset = $(this).attr("data-offset");
        var value = $(this).attr("data-value");
        // removes the button prior to loading the new GIFs before re-creating the button below all the GIFs
        $(".more-gifs").remove();
        // search the GIPHY api for the value
        var apiKey = "7yoI0Q9V3e6BZA3icwdVrvDDVdqqaLqt";
        var queryUrl = "https://api.giphy.com/v1/gifs/search?api_key=" + apiKey + "&q=" + value + "&limit=10&offset=" + offset + "&rating=R&lang=en";
        // grab some info from the giphy API
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function (response) {
            response.data.forEach(function (data, index) {
                // make the image div for each data value
                makeGifDiv(data, index);
            });
            // re-creating the button below the GIFs and assigning a new offset value
            moreGifsButton(value, offset);
        });
        // set offset to a new value so GIFs won't be repeated.
        offset = parseInt(offset) + 10;
        $(this).attr("data-offset", offset);
    });

    // drag and drop event handler functions for grabbing favorites and putting them in the favorites section.
    $("#favorite-box").on("dragover", function () {
        allowDrop(event);
    });

    $("#favorite-box").on("drop", function () {
        drop(event);
    });

    $("body").on("dragstart", ".gif-div", function () {
        drag(event);
    })

















});
