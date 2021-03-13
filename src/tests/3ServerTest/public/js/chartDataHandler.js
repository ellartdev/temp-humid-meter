var ctx = document.getElementById('my-chart').getContext('2d');
var ctx2 = document.getElementById('my-chart2').getContext('2d');

socket.emit('GetDataFromDB-hourly', {initialized: true});
socket.on('GetDataFromDB-hourly', (data) => {
    /**
     * Incoming data:
     * data[0] - Timestamps
     * data[1] - Calculated average temperatures
     * data[2] - Calculated average humidity rates
     * 
     * all of them should have the same amount of values
     */
    console.log(data);
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data[0],
            datasets: [{
                label: 'Average temperature (°C)',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: data[1]
            }]
        },
        options: {}
    });
    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: data[0],
            datasets: [
                {
                    label: 'Average humidity (%)',
                    backgroundColor: 'rgb(132, 99, 255)',
                    borderColor: 'rgb(132, 99, 255)',
                    data: data[2]
                }
            ]
        }
    });
});
