const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {});
const MongoClient = require('mongodb').MongoClient;

const { getSerialData, LCDBlgSwitch } = require('./serialCom');
const { sortArray, sortTimes } = require('./sorting')
const { round10 } = require('./decAdjust');

const mongourl = "mongodb://localhost:27017/";
const PORT = 3001;

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

app.use('/views', express.static('views'));
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

io.sockets.on('connection', (socket) => {
    socket.on('LCDBacklight', (data) => {
        if (data.pressed) {
            LCDBlgSwitch();
        };
    });

    socket.on('GetDataFromDB-hourly', (recvData) => {
        if (recvData.initialized) {
            let currDate = new Date().toDateString();
            let hours = [],
                avgTemps = [],
                avgHumids = [];

            let times = 0;
            for (let i = 0; i < 24; i++) {
                MongoClient.connect(mongourl, async (err, db) => {
                    if (err) throw err;
                    let dbo = db.db("mydb");
                    let query = {
                        date: {
                            $gte: new Date(`${currDate} ${i}:00:00 GMT+0300`),
                            $lte: new Date(`${currDate} ${i}:59:59 GMT+0300`)
                        }
                    }
                    let result = await dbo.collection("temps-humids").find(query, {}).toArray()
                    if (result.length) {

                        hours.push(`${i}:00`);
                        //console.log(`${i}:00-${i}:59:`);
                        let temps = [];
                        let humids = [];

                        for (let j in result) {
                            temps.push(result[j].temperature);
                            humids.push(result[j].humidity);
                        };

                        let avgTemp = round10(average(temps), -1);
                        let avgHumid = round10(average(humids), -1);;

                        avgTemps.push(avgTemp);
                        avgHumids.push(avgHumid);
                    };
                    await db.close();
                    times++
                    
                    if (times == 24) {
                        sendEmOver();
                        return;
                    };
                });
            };

            async function sendEmOver() {
                let arrays = [hours, avgTemps, avgHumids];
                let sorted = await sortArray(arrays, 0, sortTimes);
                socket.emit('GetDataFromDB-hourly', sorted);
            };
        };
    });

    getSerialData((data) => {
        socket.emit('temp-humid', data);
    });

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
