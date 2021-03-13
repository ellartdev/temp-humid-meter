const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const PORT = 'COM5'

const port = new SerialPort(PORT, { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

// Read the port data
port.on("open", () => {
	console.log(`Serial port ${PORT} is open.`);
});

parser.on('data', data => {
	
	// Arduino sends (e.g.):
	// {"temp": 23, "humid": 56}
	data = JSON.parse(data);
	
	// print out temperature and humidity
	console.log(data.temp, data.humid);
});
