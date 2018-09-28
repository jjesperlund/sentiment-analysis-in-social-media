window.onload = () => {

  var charts = new Charts();
  var table = document.getElementById("table");
  let tab = document.getElementById('Overview');
  let bubbleCanvas = document.getElementById('bubble-chart-canvas');
  let barCanvas = document.getElementById('bar-chart-canvas');


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
  
  createTable(table);
  charts.createBubbleChart(bubbleCanvas, /* data */);
  charts.createBarchart(barCanvas, /* data */);
}

