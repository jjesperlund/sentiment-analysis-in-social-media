
// Function to concatenate comments depending on sentiment.
function concatComments(data) {
  var positive_comments
  var negative_comments
  data.forEach((d) => {
    if (d.sentiment == "positive") {
      positive_comments += d.comment;
    } else if (d.sentiment == "negative") {
      negative_comments += d.comment
    }
  })
  return [positive_comments, negative_comments];
}

// Get top 20 frequency words.
function getTopFreq(hash_map) {
  var result = Object.keys(hash_map).map(function (key) {
    return {
      key: key,
      value: this[key]
    };
  }, hash_map);
  result.sort(function (p1, p2) {
    return p2.value - p1.value;
  });
  var topFreq = result.slice(0, 40);
  var word_count = {}
  topFreq.forEach((d) => {
    word_count[d.key] = d.value
  })
  return word_count
}

// Clean concatenated sentence for word cloud.
function regexClean(text_string) {
  text_string = text_string.replace(/(?:https?|ftp):\/\/[\n\S]+/g, ''); //Remove URL
  text_string = text_string.replace(/(@[A-Za-z0-9_]+)/g, ''); //Remove @user
  text_string = text_string.replace(/(#[A-Za-z0-9_]+)/g, ''); //Remove hashtags
  text_string = text_string.replace(/\n/g, '') // Remove '\n'
  text_string = text_string.replace(/(&[A-Za-z0-9_]+)/g, ''); //Remove &amp, &gt etc..
  text_string = text_string.replace(/\s\d+/g, '');

  return text_string.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '') //Remove emojis.
}


function drawWordCloud(data, cloudId) {
  var sentiment_vec = concatComments(data)
  var text_string = ""
  if(cloudId == '#cloud-pos'){
     text_string = sentiment_vec[0]
  }
  else{
    text_string = sentiment_vec[1]
  }

  text_string = text_string.removeStopWords();

  var word_count = {};
  text_string = regexClean(text_string)
  var words = text_string.split(/[ '\-\(\)\*":;\[\]|{},.!?]+/);
  
  if (words.length == 1) {
    word_count[words[0]] = 1;
  } else {
    words.forEach(function (word) {
      var word = word.toLowerCase();
      if (word != "" && adjectives.indexOf(word) != -1 && word.length > 1) {
        if (word_count[word]) {
          word_count[word]++;
        } else {
          word_count[word] = 1;
        }
      }
    })
  }

  var svg_location = cloudId;
  var topFreqWord = getTopFreq(word_count)

  var width = $(cloudId).width();
  var height = $(cloudId).height();

  var fill = d3.scale.category20();

  var word_entries = d3.entries(topFreqWord);

  var xScale = d3.scale.linear()
    .domain([0, d3.max(word_entries, function (d) {
      return d.value;
    })])
    .range([10, 100]);

  d3.layout.cloud().size([width, height])
    .timeInterval(20)
    .words(word_entries)
    .fontSize(function (d) {
      return xScale(+d.value);
    })
    .text(function (d) {
      return d.key;
    })
    .rotate(function () {
      return ~~(Math.random() * 2) * 90;
    })
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
      .style("font-size", function (d) {
        return xScale(d.value) + "px";
      })
      .style("font-family", "Impact")
      .style("fill", function (d, i) {
        return fill(i);
      })
      .attr("text-anchor", "middle")
      .attr("transform", function (d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function (d) {
        return d.key;
      });
  }
  d3.layout.cloud().stop();
}