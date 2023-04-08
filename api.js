const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const mongoose = require('mongoose');
const axios = require('axios');

const url = 'mongodb+srv://amrit1254:Rijju1234@cluster0.mtbkfpu.mongodb.net/mydb?retryWrites=true&w=majority';

const client = new MongoClient(url);
app.get('/', (req,res)=>{
  res.send(`<a href="/healthdata">Healthdata</a>`)
})

app.get('/healthdata', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('mydb');
    const result = await db.collection('Healthsystem').find().toArray();
    const data = [['Timestamp', 'Weight (kg)', 'Oxygen (%)', 'Heart Rate (bpm)']];
    result.forEach(function(doc) {
      data.push([doc.ts, doc.sensorData[0].weight.value, doc.sensorData[0].oxygen.value, doc.sensorData[0].heartRate.value]);
    });

    google.charts.load('current', {'packages':['bar']});
    google.charts.setOnLoadCallback(function() {
      const dataTable = google.visualization.arrayToDataTable(data);
      const chart = new google.charts.Bar(document.getElementById('chart_div'));
      chart.draw(dataTable, {});
    });

    console.log(result);
    res.send(JSON.stringify(data));
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving data from database');
  }
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
