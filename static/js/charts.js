class Charts {

    createBubbleChart(canvas) {
        const wrapper = document.getElementById('bubble-chart');
        wrapper.appendChild(canvas);
        const ctx = canvas.getContext('2d');

		const config = {
            type: 'bubble',
            data: {
              datasets: [
                {
                  label: ["Youtube"],
                  backgroundColor: "#de251a66",
                  borderColor: "#de251a",
                  data: [{
                    x: moment('2018-07-01'),
                    y: -5.245
                  }]
                }, {
                  label: ["Twitter"],
                  backgroundColor: "#23cbff7a",
                  borderColor: "#23cbff",
                  data: [{
                    x: moment('2018-07-02'),
                    y: 7.526
                  }]
                }, 
              ]
            },
            options: {
              title: {
                display: true,
                text: 'Distribution over time'
              }, scales: {
                yAxes: [{ 
                  scaleLabel: {
                    display: true,
                    labelString: "Pos - Neg scale"
                  }
                }],
                xAxes: [{ 
                  scaleLabel: {
                    display: true,
                    labelString: "Timestamp"
                  }
                }]
              }
            }
        };
        const bubbleChart = new Chart(ctx, config);

    }

    createBarchart(canvas) {
        const wrapper = document.getElementById('bar-chart');
        wrapper.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        const config = {
            type: 'bar',
            data: {
                labels: ["YouTube", "Twitter"],
                datasets: [{
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        "#de251a66",
                        "#23cbff7a",
                    ],
                    borderColor: [
                        "#de251a",
                        "#23cbff",
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Distribution sum'
                  },
                  legend: {
                    display: false
                  },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        };
        const barChart = new Chart(ctx, config);
    }

}