var config = {
    apiKey: "AIzaSyCgei0nBpSfLsEg5LpyvVUCnpUnd2H__QQ",
    authDomain: "trainbase-6b708.firebaseapp.com",
    databaseURL: "https://trainbase-6b708.firebaseio.com",
    projectId: "trainbase-6b708",
    storageBucket: "",
    messagingSenderId: "1055425515767"
  };
  firebase.initializeApp(config);

var database = firebase.database();

var IDList = [];

$('#addTrainBtn').on('click', function() {
    event.preventDefault();
    // Get data from HTML and store it in Object.
    var newTrain = {
            name: $('#trainName').val().trim(),
            destination: $('#destination').val().trim(),
            firstTrain: $('#firstTrain').val().trim(),
            frequency: $('#frequency').val().trim()
        }
    // Log the object to check
    // Push Object to Database with unique reference.
    var pushedTrain = database.ref().push(newTrain);

    var ID = pushedTrain.key;

    IDList.push(ID)
    // Reset the values in the HTML.
    $("#trainName").val('');
    $("#destination").val('');
    $("#firstTrain").val('');
    $("#frequency").val('');

    // push the current time to database

    var time = moment();
    currentTime = moment(time).format('hh:mm');
    database.ref().child(ID).update({
        time: currentTime
    });

    var firstTime = newTrain.firstTrain
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    //console.log(firstTimeConverted)

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    //console.log("DIFFERENCE IN TIME: " + diffTime);

    var frequency = parseInt(newTrain.frequency)
    var tRemainder = diffTime % frequency;
    //console.log(tRemainder);

    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    var nextTrainTime = moment(moment(time), 'hh:mm').add(parseInt(tMinutesTillTrain), 'minutes')
    //console.log("THE NEXT TRAIN ARRIVES AT: " + nextTrainTime)

    var arrival = moment(nextTrainTime).format('hh:mm')




    database.ref().child(ID).update({
        timeUntil: tMinutesTillTrain,
    });

    database.ref().child(ID).update({
        arrival: arrival,
    });

});

database.ref().on('child_added', function(snapshot) {

    var key = database.ref(snapshot.key);

    key.on('value', function(snapshot) {

        item = snapshot.val();

        console.log(item.arrival);

        var newRow = $('<tr>');

        var name = $('<td>');
        name.text(item.name);

        var dest = $('<td>');
        dest.text(item.destination);

        var freq = $('<td>')
        freq.text(item.frequency);

        var arrive = $('<td>');
        arrive.text(item.arrival);

        var min = $('<td>');
        min.text(item.timeUntil)

        newRow.append(name);
        newRow.append(dest);
        newRow.append(freq);
        newRow.append(arrive);
        newRow.append(min);

        $('#tableBody').append(newRow);
    })
})
