// Your web app's Firebase configuration
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
  var tfrequency;
  var firstTime = "";
  var minsToArrive = "";

  function currentTime() {
    var current = moment().format('llll');
    $("#current-datetime").html(current);
    setTimeout(current, 1000);
  };

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
    $("#frequency").val("0");

  });

  database.ref().on("child_added", function(childSnapshot) {
    var inputName = childSnapshot.val().trainName;
    var inputDestination = childSnapshot.val().destination;
    var inputFirstTrain = childSnapshot.val().firstTime;
    var inputFrequency = childSnapshot.val().frequency;

    var firstTimeConverted = moment(inputFirstTrain, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var timeRemaining = diffTime % inputFrequency;
    var minsToArrive = inputFrequency - timeRemaining;
    var nextTrain = moment().add(minsToArrive, "minutes");

    var addNewRow = $("<tr>").append (
      $("<td>").text(inputName),
      $("<td>").text(inputDestination),
      $("<td>").text(inputFrequency),
      $("<td>").text(moment(nextTrain).format("hh:mm A")),
      $("<td>").text(minsToArrive)
    );

    $("#train-data > tbody").append(addNewRow);
  });

  currentTime();

});








//   $(".form-field").on("keyup", function () {
//     var trainData = $("#train-name").value().trim();
//     var cityData = $("#destination").val().trim();
//     var timeData = $("#first-train").val().trim();
//     var frequencyData = $("#frequency").val().trim();

//     sessionStorage.setItem("trainD", trainData);
//     sessionStorage.setItem("cityD", cityData);
//     sessionStorage.setItem("timeD", timeData);
//     sessionStorage.setItem("frequencyD", frequencyData);
//   });

//   $("#train-name").val(sessionStorage.getItem("trainD"));
//   $("#destination").val(sessionStorage.getItem("cityD"));
//   $("first-train").val(sessionStorage.getItem("timeD"));
//   $("frequency").val(sessionStorage.getItem("frequencyD"));

//   $("submit").on("click", function (event) {
//     event.preventDefault();

//       trainName = $("#train-name").value().trim();
//       destination = $("#destination").val().trim();
//       firstTime = $("#first-train").val().trim();
//       frequency = $("#frequency").val().trim();

//       $(".form-field").val("");

//       database.ref().push({
//         trainName: trainName,
//         destination: destination,
//         frequency: frequency,
//         firstTime: firstTime,
//         dateAdded: firebase.database.ServerValue.TIMESTAMP
//       });
//       sessionStorage.clear();
    

//   });

//   database.ref().on("child_added", function (childSnapshot) {
//     var firstTimeConverted = moment(childSnapshot.val().firstTime, "hh:mm").subtract(1, "years");
//     var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
//     var timeRemain = timeDiff % childSnapshot.val().frequency;
//     var minToArrival = childSnapshot.val().frequency - timeRemain;
//     var nextTrain = moment().add(minToArrival, "minutes");
//     var key = childSnapshot.key;

//     var newrow = $("<tr>");
//     newrow.append($("<td>" + childSnapshot.val().trainName + "</td>"));
//     newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));
//     newrow.append($("<td class='text-center'>" + childSnapshot.val().frequency + "</td>"));
//     newrow.append($("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>"));
//     newrow.append($("<td class='text-center'>" + minToArrival + "</td>"));
//     newrow.append($("<td class='text-center'><button class='arrival btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));

//     if (minToArrival < 6) {
//       newrow.addClass("info");
//     }

//     $("#train-data").append(newrow);

//   });

//   $(document).on("click", ".arrival", function () {
//     keyref = $(this).attr("data-key");
//     database.ref().child(keyref).remove();
//     window.location.reload();
//   });

//   // currentTime();

//   setInterval(function () {
//     window.location.reload();
//   }, 60000);

//   currentTime();




// trying to create drop down box that populate train name and destination
// var trainOption = {
//   northLineTiger: ["Doby Gaut", "Somerset", "Orchard Road", "Newton", "Toa Payoh", "Bradell", "Bishan", "Ang Mo Kio", "Yio Chu Kang", "Khatib", "Yishun"],
//   southLinePanda: ["City Hall", "Raffles Place", "Marina Bay"],
// };
// var mySelect = $("#train-name");
// $.each(trainOption, function(val) {
//   mySelect.append(val(val));
// });
