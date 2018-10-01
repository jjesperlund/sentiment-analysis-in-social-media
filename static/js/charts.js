class Charts {

    createLineChart(canvas, data, sentiment) {
        const wrapper = document.getElementById('line-chart');
        wrapper.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        let twitterData = [], youtubeData = [];
        let legend;
        
        for (let prop in data) {
          const item = data[prop];
          if (sentiment === 'positive') {
            twitterData.push(item.twitter.positive);
            youtubeData.push(item.youtube.positive);
            legend = 'Development of Positive Comments';
          } else {
            twitterData.push(item.twitter.negative);
            youtubeData.push(item.youtube.negative);
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

    createPiechart(canvas, data) {
        const wrapper = document.getElementById('pie-chart');
        wrapper.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        const config = {
            type: 'pie',
            data: {
              labels: ["Positive comments", "Negative comments"],
              datasets: [{
                //label: "Population (millions)",
                backgroundColor: ["#3de253", "#db3f34"],
                data: [data.twitter.positive + data.youtube.positive, data.twitter.negative + data.youtube.negative]
              }]
            },
            options: {
              title: {
                display: true,
                text: 'Total percentage of positive and negative comments'
              }
            }
        }
        const pieChart = new Chart(ctx, config);
    }

}