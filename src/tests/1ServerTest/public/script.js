var temp = document.getElementById("temp");
var humid = document.getElementById("humid");

temp.innerHTML, humid.innerHTML = "Please wait...";

var socket = io();

// socket.on('test', (data) => {
//     console.log(data.message);
// });

socket.on('temp-humid', (data) => {
    console.log(data);
    temp.innerHTML = `${data.temp}°C, ${Math.floor(data.temp * 1.8 + 32)}°F`
    humid.innerHTML = `${data.humid}%`
});

var LCDBacklight = () => {
    socket.emit('LCDBacklight', {pressed: true});
};

//console.log("öö");