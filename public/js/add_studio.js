//Built using the cs_340 nodejs starter guide: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Get the objects we need to modify
let addStudioForm = document.getElementById('add-studio-form-ajax');

// Modify the objects we need
addStudioForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputStudioDescription = document.getElementById("input-studioDescription");

    // Get the values from the form fields
    let studioDescriptionValue = inputStudioDescription.value;

    // Put our data we want to send in a javascript object
    let data = {
        studioDescription: studioDescriptionValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-studio-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputStudioDescription.value = '';
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
    let currentTable = document.getElementById("studios_table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let studioIDCell = document.createElement("TD");
    let studioDescriptionCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    studioIDCell.innerText = newRow.studioID;
    studioDescriptionCell.innerText = newRow.studioDescription;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteStudio(newRow.studioID);
    };

    // Add the cells to the row 
    row.appendChild(studioIDCell);
    row.appendChild(studioDescriptionCell);

    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.studioID);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // updating
    let selectStudioMenu = document.getElementById("input-studioDescription-update");

    let option_studio = document.createElement("option_studio");
    option_studio.text = newRow.studioDescription;
    option_studio.value = newRow.studioID;

    selectStudioMenu.add(option_studio);
    ////
}