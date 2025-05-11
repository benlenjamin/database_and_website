-- Purchases
-- Selects for Display/Dynamically Filled Drop-Down
SELECT * FROM purchases;
SELECT * FROM customers;
SELECT * FROM games;
-- Adding to purchases table
INSERT INTO purchases (memberID, gameID, price, purchaseDate, warrantyEndDate) VALUES ('${data.memberID}', '${data.gameID}', '${data.price}', '${data.purchaseDate}', '${data.warrantyEndDate}');
SELECT * FROM purchases;
-- Deleting from purchases table
DELETE FROM purchases WHERE memberID = ? AND gameID = ?;
-- Updating purchases table
UPDATE purchases SET price = ?, purchaseDate = ?, warrantyEndDate = ? WHERE purchases.memberID = ? AND purchases.gameID = ?;

-- Customers
-- Select for display
SELECT * FROM customers;
-- Delete from customers
DELETE FROM customers WHERE memberID = ?;
-- Add new customer
INSERT INTO customers (firstName, lastName, email) VALUES ('${data.firstName}', '${data.lastName}', '${data.email}');
SELECT * FROM customers;
-- Update existing customer
UPDATE customers SET email = ? WHERE customers.memberID = ?;

-- Games
-- Selects for Display/Dynamically Filled Drop-Down
SELECT * FROM games;
SELECT * FROM genres;
SELECT * FROM esrbs;
-- Delete from games table
DELETE FROM games WHERE gameID = ?;
-- Add entry to games table
INSERT INTO games (item, genreID, esrbID) VALUES ('${data.item}', '${data.genreID}', '${data.esrbID}');
SELECT * FROM games;
-- Update games table entry
UPDATE games SET genreID = ?, esrbID = ? WHERE games.gameID = ?;

-- Releases
-- Selects for Display/Dynamically Filled Drop-Down
SELECT * FROM releases;
SELECT * FROM games;
SELECT * FROM studios;
-- Delete from releases table
DELETE FROM releases WHERE gameID = ? AND studioID = ?;
-- Add to releases table
INSERT INTO releases (gameID, studioID, publishDate) VALUES ('${data.gameID}', '${data.studioID}', '${data.publishDate}');
SELECT * FROM releases;
-- Update releases table entry
UPDATE releases SET publishDate = ? WHERE releases.gameID = ? AND releases.studioID = ?;

-- Genres
-- Select for display
SELECT * FROM genres;
-- Delete from genres table
DELETE FROM genres WHERE genreID = ?;
-- Add to genres table
INSERT INTO genres (genreDescription) VALUES ('${data.genreDescription}');
SELECT * FROM genres;
-- Update genres table entry
UPDATE genres SET genreDescription = ? WHERE genres.genreID = ?;

-- Esrbs
-- Select for display
SELECT * FROM esrbs;
-- Delete from esrbs table
DELETE FROM esrbs WHERE esrbID = ?;
-- Add to esrbs table
INSERT INTO esrbs (esrbDescription) VALUES ('${data.esrbDescription}');
SELECT * FROM esrbs;
-- Update esrbs table entry
UPDATE esrbs SET esrbDescription = ? WHERE esrbs.esrbID = ?;

-- Studios
-- Select for display
SELECT * FROM studios;
-- Delete from studios table
DELETE FROM studios WHERE studioID = ?;
-- Add to studios table
INSERT INTO studios (studioDescription) VALUES ('${data.studioDescription}');
SELECT * FROM studios;
-- Update studios table entry
UPDATE studios SET studioDescription = ? WHERE studios.studioID = ?;