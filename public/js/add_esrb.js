//Built using the cs_340 nodejs starter guide: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Get the objects we need to modify
let addEsrbForm = document.getElementById('add-esrb-form-ajax');

// Modify the objects we need
addEsrbForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputEsrbDescription = document.getElementById("input-esrbDescription");

    // Get the values from the form fields
    let esrbDescriptionValue = inputEsrbDescription.value;

    // Put our data we want to send in a javascript object
    let data = {
        esrbDescription: esrbDescriptionValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-esrb-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputEsrbDescription.value = '';
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
    let currentTable = document.getElementById("esrbs_table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let esrbIDCell = document.createElement("TD");
    let esrbDescriptionCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    esrbIDCell.innerText = newRow.esrbID;
    esrbDescriptionCell.innerText = newRow.esrbDescription;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteEsrb(newRow.genreID);
    };

    // Add the cells to the row 
    row.appendChild(esrbIDCell);
    row.appendChild(esrbDescriptionCell);

    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.esrbID);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // updating
    let selectEsrbMenu = document.getElementById("input-esrbDescription-update");

    let option_esrb = document.createElement("option_esrb");
    option_esrb.text = newRow.esrbDescription;
    option_esrb.value = newRow.esrbID;

    selectEsrbMenu.add(option_esrb);
    ////
}