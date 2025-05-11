//Built using the cs_340 nodejs starter guide: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Get the objects we need to modify
let addReleaseForm = document.getElementById('add-release-form-ajax');

// Modify the objects we need
addReleaseForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputGameID = document.getElementById("input-gameID");
    let inputStudioID = document.getElementById("input-studioID");
    let inputPublishDate = document.getElementById('input-publishDate');

    // Get the values from the form fields
    let gameIDValue = inputGameID.value;
    let studioIDValue = inputStudioID.value;
    let publishDateValue = inputPublishDate.value;

    // Put our data we want to send in a javascript object
    let data = {
        gameID: gameIDValue,
        studioID: studioIDValue,
        publishDate: publishDateValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-release-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputGameID.value = '';
            inputStudioID.value = '';
            inputPublishDate.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// purchases
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("releases_table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let gameIDCell = document.createElement("TD");
    let studioIDCell = document.createElement("TD");
    let publishDateCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    gameIDCell.innerText = newRow.gameID;
    studioIDCell.innerText = newRow.studioID;
    publishDateCell.innerText = newRow.publishDate;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteRelease(newRow.gameID, newRow.studioID);
    };

    // Add the cells to the row 
    row.appendChild(gameIDCell);
    row.appendChild(studioIDCell);
    row.appendChild(publishDateCell);
    row.appendChile(deleteCell);

    row.setAttribute('data-value', newRow.gameID, newRow.studioID);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // updating

    let selectGameMenu = document.getElementById("input-gameID-update");
    let selectStudioMenu = document.getElementById("input-studioID-update");

    let option_game = document.createElement("option_game");
    option_game.text = newRow.item;
    option_game.value = newRow.item;

    selectGameMenu.add(option_game);

    let option_studio = document.createElement("option_studio");
    option_studio.text = newRow.studioDescription;
    option_studio.value = newRow.studioID;

    selectStudioMenu.add(option_studio);
}