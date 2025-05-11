//Built using the cs_340 nodejs starter guide: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Get the objects we need to modify
let addGameForm = document.getElementById('add-game-form-ajax');

// Modify the objects we need
addGameForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputItem = document.getElementById("input-item");
    let inputGenreID = document.getElementById("input-genreID");
    let inputEsrbID = document.getElementById("input-esrbID");

    // Get the values from the form fields
    let itemValue = inputItem.value;
    let genreIDValue = inputGenreID.value;
    let esrbIDValue = inputEsrbID.value;

    // Put our data we want to send in a javascript object
    let data = {
        item: itemValue,
        genreID: genreIDValue,
        esrbID: esrbIDValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-game-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputItem.value = '';
            inputGenreID.value = '';
            inputEsrbID.value = '';
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
    let currentTable = document.getElementById("games_table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let gameIDCell = document.createElement("TD");
    let itemCell = document.createElement("TD");
    let genreIDCell = document.createElement("TD");
    let esrbIDCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    gameIDCell.innerText = newRow.gameID;
    itemCell.innerText = newRow.item;
    genreIDCell.innerText = newRow.genreID;
    esrbIDCell.innerText = newRow.esrbID;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteGame(newRow.gameID);
    };

    // Add the cells to the row 
    row.appendChild(gameIDCell);
    row.appendChild(itemCell);
    row.appendChild(genreIDCell);
    row.appendChild(esrbIDCell);
    row.appendChile(deleteCell);

    row.setAttribute('data-value', newRow.gameID);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // updating
    let selectGameMenu = document.getElementById("mySelectItem");
    //let selectGameMenu = document.getElementById("input-gameID-update");
    
    let option_game = document.createElement("option_game");
    //might need to replace fname and lname with memberid
    option_game.text = newRow.item;
    option_game.value = newRow.item;
    
    //let option_game = document.createElement("option_game");
    //option_game.text = newRow.title;
    //option_game.value = newRow.gameID;
    
    selectGameMenu.add(option_game);

    let selectGenreMenu = document.getElementById("mySelectGenre");

    let option_genre = document.createElement("option_genre");
    option_genre.text = newRow.genreDescription;
    option_genre.value = newRow.genreID;

    selectGenreMenu.add(option_genre);

    let selectEsrbMenu = document.getElementById("mySelectEsrb");

    let option_esrb = document.createElement("option_esrb");
    option_esrb.text = newRow.esrbDescription;
    option_esrb.value = newRow.esrbID;

    selectEsrbMenu.add(option_esrb);
    //selectGameMenu.add(option_game);
}