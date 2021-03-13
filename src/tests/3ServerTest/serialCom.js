const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const SERIAL_PORT = 'COM5';
const port = new SerialPort(SERIAL_PORT, { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

port.on("open", () => {
	console.log(`Serial port ${SERIAL_PORT} is open.`);
});

exports.getSerialData = (cb) => {
    parser.on('data', data => {
        data = JSON.parse(data);
        //console.log(data.temp, data.humid);
        cb(data);
    });
};

exports.LCDBlgSwitch = () => {
    return port.write('1\n');
};
