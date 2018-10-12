class Charts {

    createLineChart(canvas, data, sentiment) {
        const wrapper = document.getElementById('line-chart');
        wrapper.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        let twitterData = [], youtubeData = [], redditData = [];
        let legend;
        
        for (let prop in data) {
          const item = data[prop];
          if (sentiment === 'positive') {
            twitterData.push(item.twitter.positive);
            youtubeData.push(item.youtube.positive);
            redditData.push(item.reddit.positive);
            legend = 'Development of Positive Comments';
          } else {
            twitterData.push(item.twitter.negative);
            youtubeData.push(item.youtube.negative);
            redditData.push(item.reddit.negative);
            legend = 'Development of Negative Comments';
          }
        }

		const config = {
            type: 'line',
            data: {
              labels: Object.keys(data),
              datasets: [{ 
                  data: youtubeData,
                  label: "Youtube",
                  borderColor: "#ea1010",
                  fill: false
                }, { 
                  data: twitterData,
                  label: "Twitter",
                  borderColor: "#00C6FF",
                  fill: false
                }, {
                  data: redditData,
                  label: "Reddit",
                  borderColor: '#FF4500',
                  fill: false
                }
              ]
            },
            options: {
              title: {
                display: true,
                text: legend,
                fontFamily: 'Quicksand',
                fontSize: 16,
              }
            }
          };
        const lineChart = new Chart(ctx, config);

    }

    createBarchart(canvas, data) {
      const wrapper = document.getElementById('bar-chart');
      wrapper.appendChild(canvas);
      const ctx = canvas.getContext('2d');
      const config = {
        type: 'horizontalBar',
        data: {
          labels: ['Positive', 'Negative'],
          datasets: [
            {
              label: "Number of comments",
              backgroundColor: ["#3de253", "#db3f34"],
              data: [data.twitter.positive + data.youtube.positive + data.reddit.positive, 
                data.twitter.negative + data.youtube.negative + data.reddit.negative
               ]
            }
          ]
        },
        options: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Distribution of Comments'
          },
          scales: {
            xAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true 
                }
            }]
        }
        }
    };
    const barchart = new Chart(ctx, config);
    }

}