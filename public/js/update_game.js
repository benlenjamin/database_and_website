//Built using the cs_340 nodejs starter guide: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Get the objects we need to modify
let updateGameForm = document.getElementById('update-game-form-ajax');

// Modify the objects we need
updateGameForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputItem = document.getElementById("mySelectItem");
    let inputGenreID = document.getElementById("mySelectGenre");
    let inputEsrbID = document.getElementById("mySelectEsrb");

    // Get the values from the form fields
    let itemValue = inputItem.value;
    let genreIDValue = inputGenreID.value;
    let esrbIDValue = inputEsrbID.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    // if (isNaN(fullNameValue)) 
    // {
    //     return;
    // }
    // if (isNaN(titleValue)) 
    // {
    //         return;
    // }
    // if (isNaN(priceValue)) 
    // {
    //         return;
    // }
    // if (isNaN(purchaseDateValue)) 
    // {
    //         return;
    // }
    // if (isNaN(warrantyEndDateValue)) 
    // {
    //         return;
    // }

    // Put our data we want to send in a javascript object
    let data = {
        item: itemValue,
        genreID: genreIDValue,
        esrbID: esrbIDValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-game-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, itemValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, gameID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("games_table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == gameID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td_genreID = updateRowIndex.getElementsByTagName("td")[2];
            let td_esrbID = updateRowIndex.getElementsByTagName("td")[3];
            // Reassign homeworld to our value we updated to
            //td.innerHTML = parsedData[0].name;
            td_genreID.innerHTML = parsedData[0].genreID;
            td_esrbID.innerHTML = parsedData[0].esrbID;
       }
    }
}