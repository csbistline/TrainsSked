// Initialize Firebase
var config = {
    apiKey: "AIzaSyAvpokNmaDpN5q8WziieQtRkKskz4CePmA",
    authDomain: "trainsked-b75cb.firebaseapp.com",
    databaseURL: "https://trainsked-b75cb.firebaseio.com",
    projectId: "trainsked-b75cb",
    storageBucket: "trainsked-b75cb.appspot.com",
    messagingSenderId: "239289413591"
};
firebase.initializeApp(config);

// shortcut to database
var trainsked = firebase.database();

// add train button
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // get user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainStart = moment($("#first-input").val().trim(), "HH:mm").format("X");
    var trainFrequency = $("#frequency-input").val().trim();

    // create object record to push to firebase
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        start: trainStart,
        frequency: trainFrequency
    };

    // push new train to firebase
    trainsked.ref().push(newTrain);

    alert("Train schedule added")

    // clear form
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-input").val("");
    $("#frequency-input").val("");
});

// add row to sked table from database whenver updated
trainsked.ref().on("child_added", function (snap) {
    // retrieve values

    console.log(snap);
    console.log(snap.val());
    console.log(snap.val().name);
    
    var trainNameSnap = snap.val().name;
    var trainDestinationSnap = snap.val().destination;
    var trainStartSnap = snap.val().start;
    var trainFrequencySnap = snap.val().frequency;
    var trainStartConverted = moment.unix(trainStartSnap);

    // calculate next arrival time
    var currentTime = moment();
    var timeDiff = currentTime.diff(trainStartConverted, "minutes");
    var tRemainder = timeDiff % trainFrequencySnap;
    var tMinutesTillTrain = trainFrequencySnap - tRemainder;
    var nextTrain = (currentTime.add(tMinutesTillTrain, "minutes")).format("h:mm A");

    // Create a new row
    var trainRow = $("<tr>").append(
        $("<td>").text(trainNameSnap),
        $("<td>").text(trainDestinationSnap),
        $("<td>").text(trainFrequencySnap),
        $("<td>").text(nextTrain),
        $("<td>").text(tMinutesTillTrain)
    );

    // Append the new row to the table
    $("#train-sked > tbody").append(trainRow);

    // update the clock
    $("#clock").text("Current Time: " + moment().format("h:mm A"))

});
