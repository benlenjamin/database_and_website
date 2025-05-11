//Built using the cs_340 nodejs starter guide: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Get the objects we need to modify
let updatePurchaseForm = document.getElementById('update-purchase-form-ajax');

// Modify the objects we need
updatePurchaseForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFullName = document.getElementById("input-fullName-update");
    let inputTitle = document.getElementById("input-title-update");
    let inputPrice = document.getElementById("input-price-update");
    let inputPurchaseDate = document.getElementById("input-purchaseDate-update");
    let inputWarrantyEndDate = document.getElementById("input-warrantyEndDate-update");

    // Get the values from the form fields
    let fullNameValue = inputFullName.value;
    let titleValue = inputTitle.value;
    let priceValue = inputPrice.value;
    let purchaseDateValue = inputPurchaseDate.value;
    let warrantyEndDateValue = inputWarrantyEndDate.value;
    
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
        fullname: fullNameValue,
        title: titleValue,
        price: priceValue,
        purchaseDate: purchaseDateValue,
        warrantyEndDate: warrantyEndDateValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-purchase-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, {fullNameValue, titleValue});

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, memberID, gameID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("purchases_table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == {memberID, gameID}) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            //let td_memberID = updateRowIndex.getElementsByTagName("td")[0];
            //let td_gameID = updateRowIndex.getElementsByTagName("td")[1];
            let td_price = updateRowIndex.getElementsByTagName("td")[2];
            let td_purchaseDate = updateRowIndex.getElementsByTagName("td")[3];
            let td_warrantyEndDate = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign homeworld to our value we updated to
            //td.innerHTML = parsedData[0].name;
            //td_memberID.innerHTML = parsedData[0].fullname;
            //td_gameID.innerHTML = parsedData[0].title;
            td_price.innerHTML = parsedData[0].price;
            td_purchaseDate.innerHTML = parsedData[0].purchaseDate;
            td_warrantyEndDate.innerHTML = parsedData[0].warrantyEndDate;
       }
    }
}