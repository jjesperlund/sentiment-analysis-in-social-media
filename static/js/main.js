window.onload = () => {

  var charts = new Charts();
  var table = document.getElementById("table");
  let tab = document.getElementById('Overview');
  let lineChartCanvas1 = document.getElementById('line-chart-canvas1');
  let lineChartCanvas2 = document.getElementById('line-chart-canvas2');
  let pieChartCanvas = document.getElementById('pie-chart-canvas');


  tab.style.display = "block";
  tab.className += " active";

  var category = window.location.search.split('=')[1]
  console.log('Fetching data about: ', category); 

  /*
  $.get( "/category=" + category, function(data){
      var sentiment_data = $.parseJSON(data);
      console.log(sentiment_data)
  })
  */

  document.getElementById('category-name').innerHTML = 'Category: ' + '<b>'+ category + '</b>';

  const occurrencesPerDay = calculateOccurences(testData);
  const sum = sumOccurrences(occurrencesPerDay);

  // Sort by date
  var occurrencesPerDay_sorted = {};
  Object.keys(occurrencesPerDay).sort(function(a, b) {
      return moment(a, 'YYYY-MM-DD').toDate() - moment(b, 'YYYY-MM-DD').toDate();
  }).forEach(function(key) {
    occurrencesPerDay_sorted[key] = occurrencesPerDay[key];
  })

  //console.log(occurrencesPerDay_sorted);
  //console.log(sum);
  
  createTable(table, testData);
  charts.createLineChart(lineChartCanvas1, occurrencesPerDay_sorted, 'positive'); //Positive chart
  charts.createLineChart(lineChartCanvas2, occurrencesPerDay_sorted, 'negative'); // Negative chart
  charts.createPiechart(pieChartCanvas, sum);

}

// Calculate occurrences for pos and neg comments for each social media
calculateOccurences = (data) => {
  occurences = {};
  data.forEach((item) => {

    const formatted_timestamp = moment(item.timestamp).format('YYYY-MM-DD');

    // If date already exists, add number of comments in correct key
    if (occurences[formatted_timestamp]) {
      occurences[formatted_timestamp][item.socialMedia][item.sentiment] += 1;
    } else {
      occurences[formatted_timestamp] = {
        twitter: {
          positive: 0,
          negative: 0
        },
        youtube: {
          positive: 0,
          negative: 0
        }
      };
      occurences[formatted_timestamp][item.socialMedia][item.sentiment] += 1;
    }
  });
  return occurences;
}

sumOccurrences = (data) => {
  let sum = {
    twitter: {
      positive: 0,
      negative: 0,
    },
    youtube: {
      positive: 0,
      negative: 0,
    }
  };
  for (let date in data) {
    sum.youtube.positive += data[date].youtube.positive;
    sum.youtube.negative += data[date].youtube.negative;
    sum.twitter.positive += data[date].twitter.positive;
    sum.twitter.negative += data[date].twitter.negative;
  };
  return sum;
}

