/**
 * Create table
 */

createTable = (table, data) => {
  // Dummy table
  const dataSize = data.length; 
  // Shuffle data array content
  data = data.sort(() => Math.random() - 0.5);

  for (let row = 0; row < dataSize; row++) {

    let item = data[row];

    var newRow = table.insertRow(-1);
    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);
    let cell4 = newRow.insertCell(3);
    

    cell1.innerHTML = 
    '<img src="../static/assets/' + item.socialMedia + 
    '_logo.png" style="max-height:25px" alt="social_media_logo"/>';
    cell2.innerHTML = 
    '<img src="' + item.authorProfileImageUrl + 
    '" style="width:30px;height:30px;border-radius:50%;" alt="social_media_logo"/>' + 
    '&ensp;' + item.authorDisplayName;
    cell3.innerHTML = item.tweetText;
    cell4.innerHTML = moment(item.timestamp).format('YYYY-MM-DD HH:SS');
  }
}
