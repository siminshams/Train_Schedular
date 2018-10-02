// Initialize Firebase
var config = {
    apiKey: "AIzaSyDQHxn8IF8gcx6uuqpB_WjavVnrmTdTCIs",
    authDomain: "train-schedular-42ba5.firebaseapp.com",
    databaseURL: "https://train-schedular-42ba5.firebaseio.com",
    projectId: "train-schedular-42ba5",
    storageBucket: "train-schedular-42ba5.appspot.com",
    messagingSenderId: "1000759601415"
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

//Initial Valuse
var trainVal = "";
var destinationVal = "";
var time = "";
var frequency = 0;
var currentTime = moment();
// console.log(currentTime);


//Capture Button Click
$("#submit").on("click", function (event) {
    event.preventDefault();

//Grabs user input 
    trainVal = $("#train-name").val().trim();
    destinationVal = $("#destination").val().trim();
    time = $("#first-train-time").val().trim();
    frequency = $("#frequency").val().trim();
    ;


    console.log(trainVal + " " + destinationVal + " " + time + " " + frequency);

    database.ref().push({
        trainName: trainVal,
        destination: destinationVal,
        firstTrainTime : time,
        trainFrequency : frequency
    });
   

   $("#train-name").val("");
   $("#destination").val("");
   $("#first-train-time").val("");
   $("#frequency").val("");
});

//Create Firebase event for adding to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot){
 
// First Time (pushed back 1 year to make sure it comes before current time)
 var startTimeConverted = moment(childSnapshot.val().firstTrainTime, "hh:mm").subtract(1, "years");
 
 // Difference between the current time and first train time
 var timeDiff = moment().diff(moment(startTimeConverted));

//Calculate the arricval of the next train
 var timeRemain = timeDiff % childSnapshot.val().trainFrequency;
 var minToArrival = childSnapshot.val().trainFrequency - timeRemain;
 var nextTrain = moment().add(minToArrival, "minutes");

 
var newRow = $("<tr>");
  newRow.append('<th scope="row">' + childSnapshot.val().trainName + "</th>");
  newRow.append("<td>" + childSnapshot.val().destination + "</td>");
  newRow.append("<td>" + childSnapshot.val().trainFrequency + "</td>");
  newRow.append($("<td>" + moment(nextTrain).format("LT") + "</td>"));
  newRow.append($("<td>" + minToArrival + "</td>"));
  $("#results").append(newRow);
 
});