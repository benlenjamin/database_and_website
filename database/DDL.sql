SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;
-- First creating the tables
CREATE OR REPLACE TABLE customers (
    memberID int(11) AUTO_INCREMENT,
    firstName varchar(255) NOT NULL,
    lastName varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    PRIMARY KEY(memberID)
);

CREATE OR REPLACE TABLE genres (
    genreID int(11) AUTO_INCREMENT NOT NULL,
    genreDescription varchar(255) NOT NULL,
    PRIMARY KEY(genreID)
);

CREATE OR REPLACE TABLE esrbs (
    esrbID int(11) AUTO_INCREMENT NOT NULL,
    esrbDescription varchar(255) NOT NULL,
    PRIMARY KEY(esrbID)
);

CREATE OR REPLACE TABLE games (
    gameID int(11) AUTO_INCREMENT,
    item varchar(255) NOT NULL,
    genreID int(11),
    esrbID int(11),
    PRIMARY KEY(gameID),
    FOREIGN KEY (genreID) REFERENCES genres(genreID) ON DELETE SET NULL,
    FOREIGN KEY (esrbID) REFERENCES esrbs(esrbID) ON DELETE SET NULL
);

CREATE OR REPLACE TABLE purchases (
    memberID int(11),
    gameID int(11),
    price float(5,2) NOT NULL,
    purchaseDate DATETIME NOT NULL,
    warrantyEndDate DATETIME,
    FOREIGN KEY (memberID) REFERENCES customers(memberID) ON DELETE SET NULL,
    FOREIGN KEY (gameID) REFERENCES games(gameID) ON DELETE SET NULL
);

CREATE OR REPLACE TABLE studios (
    studioID int(11) AUTO_INCREMENT NOT NULL,
    studioDescription varchar(255) NOT NULL,
    PRIMARY KEY(studioID)
);


CREATE OR REPLACE TABLE releases (
    gameID int(11),
    studioID int(11),
    publishDate DATETIME NOT NULL,
    FOREIGN KEY (gameID) REFERENCES games(gameID) ON DELETE SET NULL,
    FOREIGN KEY (studioID) REFERENCES studios(studioID) ON DELETE SET NULL
);

-- Now to insert example data
INSERT INTO customers
(
    firstName,
    lastName,
    email
)
VALUES
(
    "Sara",
    "Smith",
    "smiths@hello.com"
),
(
    "Miguel",
    "Cabrera",
    "mc@hello.com"
),
(
    "Bo",
    "Chan'g",
    "bochang@hello.com"
);

INSERT INTO genres
(
    genreDescription
)
VALUES
(
    "Action RPG"
),
(
    "First Person Shooter"
),
(
    "Adventure Survival"
);

INSERT INTO esrbs
(
    esrbDescription
)
VALUES
(
    "E for Everyone"
),
(
    "T for Teens"
),
(
    "M for Mature"
);

INSERT INTO games
(
    item,
    genreID,
    esrbID
)
VALUES
(
    "RPG Example Game",
    (SELECT genreID from genres where genreDescription = "Action RPG"),
    (SELECT esrbID from esrbs where esrbDescription = "T for Teens")
),
(
    "Minecraft",
    (SELECT genreID from genres where genreDescription = "Adventure Survival"),
    (SELECT esrbID from esrbs where esrbDescription = "E for Everyone")
),
(
    "Call of Duty",
    (SELECT genreID from genres where genreDescription = "First Person Shooter"),
    (SELECT esrbID from esrbs where esrbDescription = "M for Mature")
);

INSERT INTO purchases
(
    memberID,
    gameID,
    price,
    purchaseDate,
    warrantyEndDate
)
VALUES
(
    (SELECT memberID from customers where firstName = "Sara"),
    (SELECT gameID from games where item = "Call of Duty"),
    "59.99",
    "2024-02-02",
    "2024-03-02"
),
(
    (SELECT memberID from customers where firstName = "Miguel"),
    (SELECT gameID from games where item = "Minecraft"),
    "29.99",
    "2024-01-11",
    "2024-02-11"
),
(
    (SELECT memberID from customers where firstName = "Bo"),
    (SELECT gameID from games where item = "RPG Example Game"),
    "19.99",
    "2023-11-26",
    "2024-12-26"
);

INSERT INTO studios
(
    studioDescription
)
VALUES
(
    "Gearbox"
),
(
    "Mojang"
),
(
    "Treyarch"
);

INSERT INTO releases
(
    gameID,
    studioID,
    publishDate
)
VALUES
(
    (SELECT gameID from games where item = "RPG Example Game"),
    (SELECT studioID from studios where studioDescription = "Gearbox"),
    "2018-01-01"
),
(
    (SELECT gameID from games where item = "Minecraft"),
    (SELECT studioID from studios where studioDescription = "Mojang"),
    "2012-05-05"
),
(
    (SELECT gameID from games where item = "Call of Duty"),
    (SELECT studioID from studios where studioDescription = "Treyarch"),
    "2024-10-01"
);

-- End of Import File
SET FOREIGN_KEY_CHECKS=1;
COMMIT;