//Built using the cs_340 nodejs starter guide: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Get the objects we need to modify
let addPurchaseForm = document.getElementById('add-purchase-form-ajax');

// Modify the objects we need
addPurchaseForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputMemberID = document.getElementById("input-memberID");
    let inputGameID = document.getElementById("input-gameID");
    let inputPrice = document.getElementById("input-price");
    let inputPurchaseDate = document.getElementById("input-purchaseDate");
    let inputWarrantyEndDate = document.getElementById("input-warrantyEndDate");

    // Get the values from the form fields
    let memberIDValue = inputMemberID.value;
    let gameIDValue = inputGameID.value;
    let priceValue = inputPrice.value;
    let purchaseDateValue = inputPurchaseDate.value;
    let warrantyEndDateValue = inputWarrantyEndDate.value;

    // Put our data we want to send in a javascript object
    let data = {
        memberID: memberIDValue,
        gameID: gameIDValue,
        price: priceValue,
        purchaseDate: purchaseDateValue,
        warrantyEndDate: warrantyEndDateValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-purchase-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputMemberID.value = '';
            inputGameID.value = '';
            inputPrice.value = '';
            inputPurchaseDate.value = '';
            inputWarrantyEndDate.value = '';
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
    let currentTable = document.getElementById("purchases_table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let memberIDCell = document.createElement("TD");
    let gameIDCell = document.createElement("TD");
    let priceCell = document.createElement("TD");
    let purchaseDateCell = document.createElement("TD");
    let warrantyEndDateCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    memberIDCell.innerText = newRow.memberID;
    gameIDCell.innerText = newRow.gameID;
    priceCell.innerText = newRow.price;
    purchaseDateCell.innerText = newRow.purchaseDate;
    warrantyEndDateCell.innerText = newRow.warrantyEndDate;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePurchase(newRow.memberID, newRow.gameID);
    };

    // Add the cells to the row 
    row.appendChild(memberIDCell);
    row.appendChild(gameIDCell);
    row.appendChild(priceCell);
    row.appendChild(purchaseDateCell);
    row.appendChild(warrantyEndDateCell);
    row.appendChile(deleteCell);

    row.setAttribute('data-value', newRow.memberID, newRow.gameID);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // updating
    let selectMemberMenu = document.getElementById("input-fullName-update");
    let selectGameMenu = document.getElementById("input-title-update");
    
    let option_member = document.createElement("option_member");
    //might need to replace fname and lname with memberid
    option_member.text = newRow.firstName + ' ' + newRow.lastName;
    option_member.value = newRow.memberID;
    
    let option_game = document.createElement("option_game");
    option_game.text = newRow.title;
    option_game.value = newRow.gameID;
    
    selectMemberMenu.add(option_member);
    selectGameMenu.add(option_game);
}