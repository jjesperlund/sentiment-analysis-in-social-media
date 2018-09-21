/**
 * Create table
 */

createTable = (table) => {
  // Dummy table
  const dataSize = 20; // Dummy
  //for (let i in dataArray )
  for (let row = 0; row < 35; row++) {

    var newRow = table.insertRow(-1);
    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);
    let cell4 = newRow.insertCell(3);
    
    cell1.innerHTML = 
    '<img src="../static/assets/' + 'twitter' + '_logo.jpg" style="width:55px;height:30px;" alt="social_media_logo"/>';
    cell2.innerHTML = '@' + '--username--';
    cell3.innerHTML = '--comment--';
    cell4.innerHTML = '--timestamp--';
  }
}
