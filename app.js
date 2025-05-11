// App.js
//Built using the cs_340 nodejs starter guide: https://github.com/osu-cs340-ecampus/nodejs-starter-app
/*
    SETUP
*/
// Database
var db = require('./database/db-connector');

var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

PORT        = 9005;                 // Set a port number at the top so it's easy to change in the future

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/
// app.js
app.get('/', function(req, res)
{
    res.render('index');
});
///////////PURCHASES
app.get('/purchases.hbs', function(req, res)
    {  
        let query1 = "SELECT * FROM purchases;";               // Define our query
        let query2 = "SELECT * FROM customers;"; //for customer name dropdown
        let query3 = "SELECT * FROM games;"; //for game title drop down

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            //first query
            let purchases_list = rows;

            db.pool.query(query2, (error, rows, fields) => {
                let customers_list = rows;

                db.pool.query(query3, (error, rows, fields) => {
                    let games_list = rows;
                    return res.render('purchases', {data: purchases_list, customers_list: customers_list, games_list: games_list});                  // Render the index.hbs file, and also send the renderer
                })
            //res.render('index', {data: purchases_list, customers_list: customers_list});                  // Render the index.hbs file, and also send the renderer
        })                                                       // an object where 'data' is equal to the 'rows' we
    });
});      
    
app.post('/add-purchase-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Capture NULL values
        let memberID = parseInt(data.memberID);
        if (isNaN(memberID))
        {
            memberID = 'NULL'
        }
    
        let gameID = parseInt(data.gameID);
        if (isNaN(gameID))
        {
            gameID = 'NULL'
        }

        let price = data.price;
        if (isNaN(price))
        {
            price = 'NULL'
        }
    
        // Create the query and run it on the database
        let query1 = `INSERT INTO purchases (memberID, gameID, price, purchaseDate, warrantyEndDate) VALUES ('${data.memberID}', '${data.gameID}', '${data.price}', '${data.purchaseDate}', '${data.warrantyEndDate}')`;
        db.pool.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on bsg_people
                let query2 = `SELECT * FROM purchases;`;
                db.pool.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

app.delete('/delete-purchase-ajax/', function(req,res,next)
    {
        let data = req.body;
        let memberID = parseInt(data.memberID);
        let gameID = parseInt(data.gameID);
        //let deleteBsg_Cert_People = `DELETE FROM bsg_cert_people WHERE pid = ?`;
        let deletePurchases= `DELETE FROM purchases WHERE memberID = ? AND gameID = ?`;
      
      
              // Run the 1st query
              //db.pool.query(deleteBsg_Cert_People, [personID], function(error, rows, fields)
                  //if (error) {
      
                  //// Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  //console.log(error);
                  //res.sendStatus(400);
                  //}
      
                  //else
                  //{
                // Run the second query
                db.pool.query(deletePurchases, [memberID, gameID], function(error, rows, fields) {
      
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
    });

///put
// app.put('/put-purchase-ajax', function(req,res,next){
//     let data = req.body;

//     ////let parsedData = JSON.parse(data);
  
//     let fullname = parseInt(data.fullname);
//     let title = parseInt(data.title);
//     let price = parseFloat(data.price);
//     //let purchaseDate = JSON.parse(data.purchaseDate);
//     //let warrantyEndDate = JSON.parse(data.warrantyEndDate);
//     ////let purchaseDate = parsedData[0].purchaseDate;
//     ////let warrantyEndDate = parsedData[0].warrantyEndDate;
//     let purchaseDate = data.purchaseDate;
//     let warrantyEndDate = data.warrantyEndDate;
  
//     let queryUpdate = `UPDATE purchases SET price = ?, purchaseDate = ?, warrantyEndDate = ? WHERE purchases.memberID = ? AND purchases.gameID = ?`;
//     let selectCustomer = `SELECT * FROM customers WHERE memberID = ?`
//     let selectGame = `SELECT * FROM games WHERE gameID = ?`
  
//           // Run the 1st query
//           db.pool.query(queryUpdate, [fullname, title, price, purchaseDate, warrantyEndDate], function(error, rows, fields){
//               if (error) {
  
//               // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
//               console.log(error);
//               res.sendStatus(400);
//               }
  
//               // If there was no error, we run our second query and return that data so we can use it to update the people's
//               // table on the front-end
//               else
//               {
//                   // Run the second query
//                   db.pool.query(selectCustomer, [fullname], function(error, rows, fields) 
//                   {
//                     let customers_list = rows;
//                       if (error) {
//                           console.log(error);
//                           res.sendStatus(400);
//                       } else {
//                           //res.send(rows);
//                       }
                  
//                       //Third query for games
//                   db.pool.query(selectGame, [title], function(error, rows, fields) {
  
//                     if (error) {
//                         console.log(error);
//                         res.sendStatus(400);
//                     } else {
//                         let games_list = rows;
//                          return res.send({customers_list, games_list});
//                     }
//                     })
//                   })
//               }
//   })});

///////
app.put('/put-purchase-ajax', function(req, res, next) {
    let data = req.body;

    ////let parsedData = JSON.parse(data);
  
    let fullname = parseInt(data.fullname);
    let title = parseInt(data.title);
    let price = parseFloat(data.price);
    //let purchaseDate = JSON.parse(data.purchaseDate);
    //let warrantyEndDate = JSON.parse(data.warrantyEndDate);
    ////let purchaseDate = parsedData[0].purchaseDate;
    ////let warrantyEndDate = parsedData[0].warrantyEndDate;
    let purchaseDate = data.purchaseDate;
    let warrantyEndDate = data.warrantyEndDate;
  
    let queryUpdatePurchase = `UPDATE purchases SET price = ?, purchaseDate = ?, warrantyEndDate = ? WHERE purchases.memberID = ? AND purchases.gameID = ?`;

    db.pool.query(queryUpdatePurchase, [price, purchaseDate, warrantyEndDate, fullname, title], function(error, rows, fields){
        if (error) {
            // log error to terminal
            console.log(error);
            res.sendStatus(400);
        }

        //console.log("SENDING TO SQL, ROWS BELOW:");
        //console.log(rows);
        res.send(rows);
    });
})

//////////////CUSTOMERS
app.get('/customers.hbs', function(req, res)
{  
    let query1 = "SELECT * FROM customers;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query
        let customers_list = rows;
        res.render('customers', {data: rows, customers_list: customers_list});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});        
///////////
app.delete('/delete-customer-ajax/', function(req,res,next)
    {
        let data = req.body;
        let memberID = parseInt(data.memberID);
        
        //let deleteBsg_Cert_People = `DELETE FROM bsg_cert_people WHERE pid = ?`;
        let deleteCustomers = `DELETE FROM customers WHERE memberID = ?`;
      
      
              // Run the 1st query
              //db.pool.query(deleteBsg_Cert_People, [personID], function(error, rows, fields)
                  //if (error) {
      
                  //// Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  //console.log(error);
                  //res.sendStatus(400);
                  //}
      
                  //else
                  //{
                // Run the second query
                db.pool.query(deleteCustomers, memberID, function(error, rows, fields) {
      
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
    });

/////////////////
app.post('/add-customer-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO customers (firstName, lastName, email) VALUES ('${data.firstName}', '${data.lastName}', '${data.email}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            let query2 = `SELECT * FROM customers;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

///////////////
app.put('/put-customer-ajax', function(req, res, next) {
    let data = req.body;

    //let parsedData = JSON.parse(data);
    let customer = parseInt(data.fullname);
    let email = data.email;

    let queryUpdateEmail = `UPDATE customers SET email = ? WHERE customers.memberID = ?`;
    //set selectEmail

    db.pool.query(queryUpdateEmail, [email, customer], function(error, rows, fields){
        if (error) {
            // log error to terminal
            console.log(error);
            res.sendStatus(400);
        }

        res.send(rows);
    });
})

////////////////GAMES
/////////////////////
app.get('/games.hbs', function(req, res)
    {  
        let query1 = "SELECT * FROM games;";               // Define our query
        let query2 = "SELECT * FROM genres;"; //for customer name dropdown
        let query3 = "SELECT * FROM esrbs;"; //for game title drop down

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            //first query
            let games_list = rows;

            db.pool.query(query2, (error, rows, fields) => {
                let genres_list = rows;

                db.pool.query(query3, (error, rows, fields) => {
                    let esrbs_list = rows;
                    return res.render('games', {data: games_list, games_list: games_list, genres_list: genres_list, esrbs_list: esrbs_list});                  // Render the index.hbs file, and also send the renderer
                })
            //res.render('index', {data: purchases_list, customers_list: customers_list});                  // Render the index.hbs file, and also send the renderer
        })                                                       // an object where 'data' is equal to the 'rows' we
    });
});      
///////////
app.delete('/delete-game-ajax/', function(req,res,next)
    {
        let data = req.body;
        let gameID = parseInt(data.gameID);
        
        //let deleteBsg_Cert_People = `DELETE FROM bsg_cert_people WHERE pid = ?`;
        let deleteGames = `DELETE FROM games WHERE gameID = ?`;
      
      
              // Run the 1st query
              //db.pool.query(deleteBsg_Cert_People, [personID], function(error, rows, fields)
                  //if (error) {
      
                  //// Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  //console.log(error);
                  //res.sendStatus(400);
                  //}
      
                  //else
                  //{
                // Run the second query
                db.pool.query(deleteGames, gameID, function(error, rows, fields) {
      
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
    });

/////////////////
app.post('/add-game-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let genreID = parseInt(data.genreID);
    let esrbID = parseInt(data.esrbID);

    // if (isNaN(genreID))
    // {
    //     genreID = 'NULL';
    // }

    // if (isNaN(esrbID))
    // {
    //     esrbID = 'NULL';
    // }


    // Create the query and run it on the database
    let query1 = `INSERT INTO games (item, genreID, esrbID) VALUES ('${data.item}', '${data.genreID}', '${data.esrbID}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            let query2 = `SELECT * FROM games;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                    //console.log("SENDING TO SQL, ROWS BELOW:");
                    //console.log(rows);
                }
            })
        }
    })
});

///////////////
app.put('/put-game-ajax', function(req, res, next) {
    let data = req.body;

    //let parsedData = JSON.parse(data);
    let gameID = parseInt(data.item);
    let genreID = parseInt(data.genreID);
    let esrbID = parseInt(data.esrbID);

    let queryUpdateGame = `UPDATE games SET genreID = ?, esrbID = ? WHERE games.gameID = ?`;
    //set selectEmail

    db.pool.query(queryUpdateGame, [genreID, esrbID, gameID], function(error, rows, fields){
        if (error) {
            // log error to terminal
            console.log(error);
            res.sendStatus(400);
        }

        res.send(rows);
    });
})

////////////////RELEASES
app.get('/releases.hbs', function(req, res)
    {  
        let query1 = "SELECT * FROM releases;";               // Define our query
        let query2 = "SELECT * FROM games;"; //for customer name dropdown
        let query3 = "SELECT * FROM studios;"; //for game title drop down

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            //first query
            let releases_list = rows;

            db.pool.query(query2, (error, rows, fields) => {
                let games_list = rows;

                db.pool.query(query3, (error, rows, fields) => {
                    let studios_list = rows;
                    return res.render('releases', {data: releases_list, games_list: games_list, studios_list: studios_list});                  // Render the index.hbs file, and also send the renderer
                })
            //res.render('index', {data: purchases_list, customers_list: customers_list});                  // Render the index.hbs file, and also send the renderer
        })                                                       // an object where 'data' is equal to the 'rows' we
    });
});      
    
app.post('/add-release-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Capture NULL values
        let gameID = parseInt(data.gameID);
        if (isNaN(gameID))
        {
            gameID = 'NULL'
        }
    
        let studioID = parseInt(data.studioID);
        if (isNaN(studioID))
        {
            studioID = 'NULL'
        }
    
        // Create the query and run it on the database
        let query1 = `INSERT INTO releases (gameID, studioID, publishDate) VALUES ('${data.gameID}', '${data.studioID}', '${data.publishDate}')`;
        db.pool.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on bsg_people
                let query2 = `SELECT * FROM releases;`;
                db.pool.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

app.delete('/delete-release-ajax/', function(req,res,next)
    {
        let data = req.body;
        let gameID = parseInt(data.gameID);
        let studioID = parseInt(data.studioID);
        //let deleteBsg_Cert_People = `DELETE FROM bsg_cert_people WHERE pid = ?`;
        let deleteReleases= `DELETE FROM releases WHERE gameID = ? AND studioID = ?`;
      
      
              // Run the 1st query
              //db.pool.query(deleteBsg_Cert_People, [personID], function(error, rows, fields)
                  //if (error) {
      
                  //// Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  //console.log(error);
                  //res.sendStatus(400);
                  //}
      
                  //else
                  //{
                // Run the second query
                db.pool.query(deleteReleases, [gameID, studioID], function(error, rows, fields) {
      
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                        //console.log(rows);
                    }
                })
    });

///put
// app.put('/put-purchase-ajax', function(req,res,next){
//     let data = req.body;

//     ////let parsedData = JSON.parse(data);
  
//     let fullname = parseInt(data.fullname);
//     let title = parseInt(data.title);
//     let price = parseFloat(data.price);
//     //let purchaseDate = JSON.parse(data.purchaseDate);
//     //let warrantyEndDate = JSON.parse(data.warrantyEndDate);
//     ////let purchaseDate = parsedData[0].purchaseDate;
//     ////let warrantyEndDate = parsedData[0].warrantyEndDate;
//     let purchaseDate = data.purchaseDate;
//     let warrantyEndDate = data.warrantyEndDate;
  
//     let queryUpdate = `UPDATE purchases SET price = ?, purchaseDate = ?, warrantyEndDate = ? WHERE purchases.memberID = ? AND purchases.gameID = ?`;
//     let selectCustomer = `SELECT * FROM customers WHERE memberID = ?`
//     let selectGame = `SELECT * FROM games WHERE gameID = ?`
  
//           // Run the 1st query
//           db.pool.query(queryUpdate, [fullname, title, price, purchaseDate, warrantyEndDate], function(error, rows, fields){
//               if (error) {
  
//               // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
//               console.log(error);
//               res.sendStatus(400);
//               }
  
//               // If there was no error, we run our second query and return that data so we can use it to update the people's
//               // table on the front-end
//               else
//               {
//                   // Run the second query
//                   db.pool.query(selectCustomer, [fullname], function(error, rows, fields) 
//                   {
//                     let customers_list = rows;
//                       if (error) {
//                           console.log(error);
//                           res.sendStatus(400);
//                       } else {
//                           //res.send(rows);
//                       }
                  
//                       //Third query for games
//                   db.pool.query(selectGame, [title], function(error, rows, fields) {
  
//                     if (error) {
//                         console.log(error);
//                         res.sendStatus(400);
//                     } else {
//                         let games_list = rows;
//                          return res.send({customers_list, games_list});
//                     }
//                     })
//                   })
//               }
//   })});

///////
app.put('/put-release-ajax', function(req, res, next) {
    let data = req.body;

    ////let parsedData = JSON.parse(data);
    let gameID = parseInt(data.gameID);
    let studioID = parseInt(data.studioID);
    let publishDate = data.publishDate;
  
    //let purchaseDate = JSON.parse(data.purchaseDate);
    //let warrantyEndDate = JSON.parse(data.warrantyEndDate);
    ////let purchaseDate = parsedData[0].purchaseDate;
    ////let warrantyEndDate = parsedData[0].warrantyEndDate;
  
    let queryUpdateRelease = `UPDATE releases SET publishDate = ? WHERE releases.gameID = ? AND releases.studioID = ?`;

    db.pool.query(queryUpdateRelease, [publishDate, gameID, studioID], function(error, rows, fields){
        if (error) {
            // log error to terminal
            console.log(error);
            res.sendStatus(400);
        }

        //console.log("SENDING TO SQL, RELEASES UPDATE, ROWS BELOW:");
        //console.log(rows);
        res.send(rows);
    });
})

/////////////////GENRES
app.get('/genres.hbs', function(req, res)
{  
    let query1 = "SELECT * FROM genres;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query
        let genres_list = rows;
        res.render('genres', {data: rows, genres_list: genres_list});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});        
///////////
app.delete('/delete-genre-ajax/', function(req,res,next)
    {
        let data = req.body;
        let genreID = parseInt(data.genreID);
        
        //let deleteBsg_Cert_People = `DELETE FROM bsg_cert_people WHERE pid = ?`;
        let deleteGenres = `DELETE FROM genres WHERE genreID = ?`;
      
      
              // Run the 1st query
              //db.pool.query(deleteBsg_Cert_People, [personID], function(error, rows, fields)
                  //if (error) {
      
                  //// Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  //console.log(error);
                  //res.sendStatus(400);
                  //}
      
                  //else
                  //{
                // Run the second query
                db.pool.query(deleteGenres, genreID, function(error, rows, fields) {
      
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
    });

/////////////////
app.post('/add-genre-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO genres (genreDescription) VALUES ('${data.genreDescription}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            let query2 = `SELECT * FROM genres;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

///////////////
app.put('/put-genre-ajax', function(req, res, next) {
    let data = req.body;

    //let parsedData = JSON.parse(data);
    let genreID = parseInt(data.genreID);
    let genreDescription = data.genreDescription;
  
    let queryUpdateGenre = `UPDATE genres SET genreDescription = ? WHERE genres.genreID = ?`;
    //set selectEmail

    db.pool.query(queryUpdateGenre, [genreDescription, genreID], function(error, rows, fields){
        if (error) {
            // log error to terminal
            console.log(error);
            res.sendStatus(400);
        }
        //console.log(rows);
        //console.log(genreDescription);
        //console.log(genreID);
        res.send(rows);
    });
})
///////////////////////
///////////////////////
/////////////////ESRBS
app.get('/esrbs.hbs', function(req, res)
{  
    let query1 = "SELECT * FROM esrbs;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query
        let esrbs_list = rows;
        res.render('esrbs', {data: rows, esrbs_list: esrbs_list});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});        
///////////
app.delete('/delete-esrb-ajax/', function(req,res,next)
    {
        let data = req.body;
        let esrbID = parseInt(data.esrbID);
        
        //let deleteBsg_Cert_People = `DELETE FROM bsg_cert_people WHERE pid = ?`;
        let deleteEsrbs = `DELETE FROM esrbs WHERE esrbID = ?`;
      
      
              // Run the 1st query
              //db.pool.query(deleteBsg_Cert_People, [personID], function(error, rows, fields)
                  //if (error) {
      
                  //// Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  //console.log(error);
                  //res.sendStatus(400);
                  //}
      
                  //else
                  //{
                // Run the second query
                db.pool.query(deleteEsrbs, esrbID, function(error, rows, fields) {
      
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
    });

/////////////////
app.post('/add-esrb-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO esrbs (esrbDescription) VALUES ('${data.esrbDescription}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            let query2 = `SELECT * FROM esrbs;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

///////////////
app.put('/put-esrb-ajax', function(req, res, next) {
    let data = req.body;

    //let parsedData = JSON.parse(data);
    let esrbID = parseInt(data.esrbID);
    let esrbDescription = data.esrbDescription;
  
    let queryUpdateEsrb = `UPDATE esrbs SET esrbDescription = ? WHERE esrbs.esrbID = ?`;
    //set selectEmail

    db.pool.query(queryUpdateEsrb, [esrbDescription, esrbID], function(error, rows, fields){
        if (error) {
            // log error to terminal
            console.log(error);
            res.sendStatus(400);
        }
        //console.log(rows);
        //console.log(esrbDescription);
        //console.log(esrbID);
        res.send(rows);
    });
})

//////////////////////
/////////////////STUDIOS
app.get('/studios.hbs', function(req, res)
{  
    let query1 = "SELECT * FROM studios;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query
        let studios_list = rows;
        res.render('studios', {data: rows, studios_list: studios_list});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});        
///////////
app.delete('/delete-studio-ajax/', function(req,res,next)
    {
        let data = req.body;
        let studioID = parseInt(data.studioID);
        
        //let deleteBsg_Cert_People = `DELETE FROM bsg_cert_people WHERE pid = ?`;
        let deleteStudios = `DELETE FROM studios WHERE studioID = ?`;
      
      
              // Run the 1st query
              //db.pool.query(deleteBsg_Cert_People, [personID], function(error, rows, fields)
                  //if (error) {
      
                  //// Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  //console.log(error);
                  //res.sendStatus(400);
                  //}
      
                  //else
                  //{
                // Run the second query
                db.pool.query(deleteStudios, studioID, function(error, rows, fields) {
      
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
    });

/////////////////
app.post('/add-studio-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO studios (studioDescription) VALUES ('${data.studioDescription}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            let query2 = `SELECT * FROM studios;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

///////////////
app.put('/put-studio-ajax', function(req, res, next) {
    let data = req.body;

    //let parsedData = JSON.parse(data);
    let studioID = parseInt(data.studioID);
    let studioDescription = data.studioDescription;
  
    let queryUpdateStudio = `UPDATE studios SET studioDescription = ? WHERE studios.studioID = ?`;
    //set selectEmail

    db.pool.query(queryUpdateStudio, [studioDescription, studioID], function(error, rows, fields){
        if (error) {
            // log error to terminal
            console.log(error);
            res.sendStatus(400);
        }
        //console.log(rows);
        //console.log(esrbDescription);
        //console.log(esrbID);
        res.send(rows);
    });
})

////////////////////////////

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});

