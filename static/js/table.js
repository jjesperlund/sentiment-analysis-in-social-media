/**
 * Create table
 */

createTable = (table) => {
  // Dummy table
  const dataSize = 20; // Dummy
  //for (let i in dataArray )
  for (let row = 0; row < 35; row++) {

      var newRow = table.insertRow(-1);
      // Loop number of cells in each row
      for (let col = 0; col <= 3; col++) {
          let cell = newRow.insertCell(col);
          cell.innerHTML = 'some data prop';
      }

  }
}
