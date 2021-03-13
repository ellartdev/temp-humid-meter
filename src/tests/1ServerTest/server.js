const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {});
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const PORT = 3001;
const SERIAL_PORT = 'COM5';

const port = new SerialPort(SERIAL_PORT, { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

port.on("open", () => {
	console.log(`Serial port ${SERIAL_PORT} is open.`);
});

let getTempData = (cb) => {
    parser.on('data', data => {
        data = JSON.parse(data);
        //console.log(data.temp, data.humid);
        cb(data);
    });
}

app.use('/views', express.static('views'));
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

io.sockets.on('connection', (socket) => {
    // socket.emit('test', {
    //     message: "hello world! :)"
    // });

    socket.on('LCDBacklight', (data) => {
        if (data.pressed) {
            port.write('1\n');
        }
    });

    getTempData((data) => {
        socket.emit('temp-humid', data);
    });
});
