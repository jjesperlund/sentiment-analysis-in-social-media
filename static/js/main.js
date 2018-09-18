var category = window.location.search.split('=')[1]
console.log(category)
$.get( "/category=" + category, function(data){
    var sentiment_data = $.parseJSON(data);
    console.log(sentiment_data)
})
