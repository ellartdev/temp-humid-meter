const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {});
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const MongoClient = require('mongodb').MongoClient;

const mongourl = "mongodb://localhost:27017/";

let getSerialData = (cb) => {
    parser.on('data', data => {
        data = JSON.parse(data);
        //console.log(data.temp, data.humid);
        cb(data);
    });
};

const PORT = 3001;
const SERIAL_PORT = 'COM5';

const port = new SerialPort(SERIAL_PORT, { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

port.on("open", () => {
	console.log(`Serial port ${SERIAL_PORT} is open.`);
});

app.get('/', (req, res) => {
    res.send('Heyyyyy, database testing');
});

server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

getSerialData((data) => {
    //console.log(data);
    MongoClient.connect(mongourl, (err, db) => {
        if (err) throw err;

        let dbo = db.db("mydb");

        let tempObj = {
            temperature: data.temp,
            humidity: data.humid,
            date: new Date(),
        };

        dbo.collection("temps-humids").insertOne(tempObj, (err, res) => {
            if (err) throw err;
            db.close();
        });
    });
});
