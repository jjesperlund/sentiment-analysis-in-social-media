window.onload = () => {

  let tab = document.getElementById('Overview');
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

  var table = document.getElementById("table");
  createTable(table);
}



