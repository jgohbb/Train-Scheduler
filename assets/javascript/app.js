var firebaseConfig = {
  apiKey: "AIzaSyAhTZMODNHWJjQtDVI2PSVcC3t0OhZ0G58",
  authDomain: "trainscheduler-4ed12.firebaseapp.com",
  databaseURL: "https://trainscheduler-4ed12.firebaseio.com",
  projectId: "trainscheduler-4ed12",
  storageBucket: "trainscheduler-4ed12.appspot.com",
  messagingSenderId: "801163293599",
  appId: "1:801163293599:web:ac47e14c815e93a76603aa",
  measurementId: "G-9HP4MQP6QJ"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

$(document).ready(function() {

  var trainName = "";
  var destination = "";
  var frequency;
  var firstTime = "";
  var minsToArrive = "";

  function currentTime() {
    var current = moment().format('llll');
    $("#current-datetime").html(current);
  };
  currentTime();

  $("#submit").on("click", function(event) {
    event.preventDefault();
    var inputName = $("#train-name").val().trim();
    var inputDestination = $("#destination").val().trim();
    var inputFirstTrain = $("#first-train").val().trim();
    var inputFrequency = $("#frequency").val().trim();

    var dataTrain = {
      trainName: inputName,
      destination: inputDestination,
      firstTime: inputFirstTrain,
      frequency: inputFrequency
    }

    database.ref().push(dataTrain);

    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train").val("");
    $("#frequency").val("");

  });

    database.ref().on("child_added", function(childSnapshot) {
    var inputName = childSnapshot.val().trainName;
    var inputDestination = childSnapshot.val().destination;
    var inputFirstTrain = childSnapshot.val().firstTime;
    var inputFrequency = childSnapshot.val().frequency;
    var key = childSnapshot.key;

    var firstTimeConverted = moment(inputFirstTrain, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var timeRemaining = diffTime % inputFrequency;
    var minsToArrive = inputFrequency - timeRemaining;
    var nextTrain = moment().add(minsToArrive, "minutes");

    var addNewRow = $("<tr>");
    addNewRow.append($("<td class='font-weight-bold'>" + inputName + "</td>"));
    addNewRow.append($("<td>" + inputDestination + "</td>"));
    addNewRow.append($("<td class='text-center'>" + inputFrequency + "</td>"));
    addNewRow.append($("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>"));
    addNewRow.append($("<td class='text-center'>" + minsToArrive + "</td>"));
    addNewRow.append($("<td class='text-center font-weight-bold'><button class='remove btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));

    $("#train-data").append(addNewRow);
  
  });

  $(document).on("click", ".remove", function() {
    keyref = $(this).attr("data-key");
    database.ref().child(keyref).remove();
    window.location.reload();
  });

});

setInterval(function() {
  window.location.reload();
}, 30000);


// trying to create drop down box that populate train name and destination
// var trainOption = {
//   northLineTiger: ["Doby Gaut", "Somerset", "Orchard Road", "Newton", "Toa Payoh", "Bradell", "Bishan", "Ang Mo Kio", "Yio Chu Kang", "Khatib", "Yishun"],
//   southLinePanda: ["City Hall", "Raffles Place", "Marina Bay"],
// };
// var mySelect = $("#train-name");
// $.each(trainOption, function(val) {
//   mySelect.append(val(val));
// });
