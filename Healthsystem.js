const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');


// Connection URL and database name
const url = 'mongodb+srv://amrit1254:Rijju1234@cluster0.mtbkfpu.mongodb.net/mydb?retryWrites=true&w=majority';

const dbName = 'mydb';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  // Retrieve data from the collection
  db.collection('Healthsystem').find().toArray(function(err, result) {
    if (err) throw err;

    // Format the data as a JavaScript array
    const data = [['Timestamp', 'Weight (kg)', 'Oxygen (%)', 'Heart Rate (bpm)']];
    result.forEach(function(doc) {
      data.push([doc.ts, doc.sensorData[0].weight.value, doc.sensorData[0].oxygen.value, doc.sensorData[0].heartRate.value]);
    });

    // Use the data to create a chart with the Google Charts API
    google.charts.load('current', {'packages':['bar']});
    google.charts.setOnLoadCallback(function() {
      const dataTable = google.visualization.arrayToDataTable(data);
      const chart = new google.charts.Bar(document.getElementById('chart_div'));
      chart.draw(dataTable, {});
    });
  });

  client.close();
});
