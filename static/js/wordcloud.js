//var text_string = "I'm kind of on the fence with no Switch but I saw this game and FIFA19 and am considering purchasing.\\n\\nI'm a little late to this discussion but I sort of agree with you. \\n\\nWild Pokemon quickly became a nuisance rather than fun and excitement. Getting stopped every 3-5 seconds with a battle cutscene when I'm trying to get somewhere is rough. There's a reason they had those repellent potions.\\n\\nPokemon Go never really caught me either. My down time was often in the office or at home and getting up and walking around was not an option. I caught a few Pokemon, got a few levels but ended up dropping it. \\n\\nI think some balancing between Pokemon Go and the oldschool Gameboy Pokemon series can be a good thing. \\n\\nThere are not guarantees to be sure but I'm not as gloomy as many others.";

// Function to concatenate comments depending on sentiment.
function concatComments(data){
  var positive_comments
  var negative_comments
  data.forEach((d) => {
    if(d.sentiment == "positive"){
      positive_comments += d.comment;
    }
    else if(d.sentiment == "negative"){
      negative_comments += d.comment
    }
  })
  return [positive_comments, negative_comments];
}

// Get top 20 frequency words.
function getTopFreq(hash_map){  
  var result = Object.keys(hash_map).map(function(key) {
    return { key: key, value: this[key] };
  }, hash_map);
  result.sort(function(p1, p2) { return p2.value - p1.value; });
  var topFreq = result.slice(0, 20);
  var word_count = {}
  topFreq.forEach((d)=>{
    word_count[d.key] = d.value
  })
  return word_count
}

//drawWordCloud(text_string);

function drawWordCloud(data){
  var sentiment_vec = concatComments(data) 
  var text_string = sentiment_vec[0]
  text_string = text_string.removeStopWords();

  var common = "poop,i,me,my,myself,we,us,our,ours,ourselves,you,your,yours,yourself,yourselves,he,him,his,himself,she,her,hers,herself,it,its,itself,they,them,their,theirs,themselves,what,which,who,whom,whose,this,that,these,those,am,is,are,was,were,be,been,being,have,has,had,having,do,does,did,doing,will,would,should,can,could,ought,i'm,you're,he's,she's,it's,we're,they're,i've,you've,we've,they've,i'd,you'd,he'd,she'd,we'd,they'd,i'll,you'll,he'll,she'll,we'll,they'll,isn't,aren't,wasn't,weren't,hasn't,haven't,hadn't,doesn't,don't,didn't,won't,wouldn't,shan't,shouldn't,can't,cannot,couldn't,mustn't,let's,that's,who's,what's,here's,there's,when's,where's,why's,how's,a,an,the,and,but,if,or,because,as,until,while,of,at,by,for,with,about,against,between,into,through,during,before,after,above,below,to,from,up,upon,down,in,out,on,off,over,under,again,further,then,once,here,there,when,where,why,how,all,any,both,each,few,more,most,other,some,such,no,nor,not,only,own,same,so,than,too,very,say,says,said,shall";

  var word_count = {};
  text_string = text_string.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
  text_string = text_string.replace('&amp', "");
  var words = text_string.split(/[ '\-\(\)\*":;\[\]|{},.!?]+/);
  
    if (words.length == 1){
      word_count[words[0]] = 1;
    } else {
      words.forEach(function(word){
        var word = word.toLowerCase();
        if (word != "" && common.indexOf(word)==-1 && word.length>1){
          if (word_count[word]){
            word_count[word]++;
          } else {
            word_count[word] = 1;
          }
        }
      })
    }

  var svg_location = "#cloud";
  var topFreqWord = getTopFreq(word_count)
  console.log(topFreqWord)

  var width = $(document).width();
  var height = $(document).height();

  var fill = d3.scale.category20();

  var word_entries = d3.entries(topFreqWord);

  var xScale = d3.scale.linear()
     .domain([0, d3.max(word_entries, function(d) {
        return d.value;
      })
     ])
     .range([10,100]);

  d3.layout.cloud().size([width, height])
    .timeInterval(20)
    .words(word_entries)
    .fontSize(function(d) { return xScale(+d.value); })
    .text(function(d) { return d.key; })
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .font("Impact")
    .on("end", draw)
    .start();

  function draw(words) {
    d3.select(svg_location).append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + [width >> 1, height >> 1] + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return xScale(d.value) + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.key; });
  }

  d3.layout.cloud().stop();
}