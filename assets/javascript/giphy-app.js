$(document).ready(function() {
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

// ------------------------------ Objects Constructor and Global functions --------------------

// make the buttons from the initial array
buttonsArray.forEach(function (name) {
    newButton(name);
});

// ----------------------------- Event Handlers go here --------------------------------------

$("#search-button").on("click", function() {
    // first, prevent the default behavior of a button!
    event.preventDefault();

    // save the value of the form to a variable, as long as the value is a string of some kind and then make a new button
    var value = $("#search-field").val();
    if (value !== "") {
        newButton(value);
        // clear the search field value
        $("#search-field").val("");
    }

});















});
