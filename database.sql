--Tables
CREATE TABLE Cards(
    CardID SERIAL PRIMARY KEY,
    CardName VARCHAR(50) NOT NULL,
    CardText VARCHAR(200) NOT NULL,
    CardType VARCHAR(50) NOT NULL,
    ConvertedManaCost VARCHAR(20) NOT NULL
);

CREATE TABLE Formats(
    FormatID SERIAL PRIMARY KEY,
    FormatName VARCHAR(50) NOT NULL,
    FormatDescription VARCHAR(100) NOT NULL,
    DeckSize INT NOT NULL DEFAULT 60,
    MaxCopies INT NOT NULL DEFAULT 4
);

CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Decks (
    DeckID SERIAL PRIMARY KEY,
    DeckName VARCHAR(50),
    CreationDate DATE DEFAULT CURRENT_DATE,
    FormatID INT,
    UserId INT,
    FOREIGN KEY (UserId) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (FormatID) REFERENCES Formats(FormatID) ON DELETE CASCADE
);

--Junction Table
CREATE TABLE Decks_and_Cards(
    DeckID INT,
    CardID INT,
    Quantity INT NOT NULL DEFAULT 1,
    PRIMARY KEY (DeckID, CardID),
    FOREIGN KEY (DeckID) REFERENCES Decks(DeckID) ON DELETE CASCADE,
    FOREIGN KEY (CardID) REFERENCES Cards(CardID) ON DELETE CASCADE
);

--Filling Tables (AI generated data cause i could care less to spend hours on writing goofy data)
-- Users first (no dependencies)
INSERT INTO Users (UserID, Username, Email) VALUES
(1, 'DarkWizard99', 'darkwizard99@email.com'),
(2, 'CardShark42', 'cardshark42@email.com'),
(3, 'MTGFanatic', 'mtgfanatic@email.com');

-- Formats (no dependencies)
INSERT INTO Formats (FormatID, FormatName, FormatDescription, DeckSize, MaxCopies) VALUES
(1, 'Standard',  'Recently released sets only',          60, 4),
(2, 'Commander', 'Singleton format with a legendary commander', 100, 1),
(3, 'Modern',    'Cards from 8th edition onwards',       60, 4);

-- Cards (no dependencies)
INSERT INTO Cards (CardID, CardName, CardText, CardType, ConvertedManaCost) VALUES
(1, 'Lightning Bolt',    'Deal 3 damage to any target.',                          'Instant',  'R'),
(2, 'Counterspell',      'Counter target spell.',                                 'Instant',  'UU'),
(3, 'Black Lotus',       'Add three mana of any single color.',                   'Artifact', '0'),
(4, 'Serra Angel',       'Flying, vigilance.',                                    'Creature', 'WW3'),
(5, 'Dark Ritual',       'Add three black mana.',                                 'Instant',  'B'),
(6, 'Llanowar Elves',    'Tap: Add one green mana.',                              'Creature', 'G'),
(7, 'Shock',             'Shock deals 2 damage to any target.',                   'Instant',  'R'),
(8, 'Wrath of God',      'Destroy all creatures. They cannot be regenerated.',    'Sorcery',  'WW2'),
(9, 'Birds of Paradise', 'Flying. Tap: Add one mana of any color.',               'Creature', 'G'),
(10,'Brainstorm',        'Draw 3 cards, then put 2 cards from your hand on top.', 'Instant',  'U');

-- Decks (depends on Users and Formats)
INSERT INTO Decks (DeckID, DeckName, CreationDate, FormatID, UserID) VALUES
(1, 'Red Burn',        '2024-01-15', 1, 1),
(2, 'Blue Control',    '2024-02-20', 3, 2),
(3, 'Elven Ramp',      '2024-03-05', 1, 3),
(4, 'Lotus Commander', '2024-04-10', 2, 1);

-- deck_and_cards (depends on Decks and Cards)
INSERT INTO decks_and_cards (DeckID, CardID, Quantity) VALUES
-- Red Burn (lots of burn spells)
(1, 1, 4),  -- 4x Lightning Bolt
(1, 7, 4),  -- 4x Shock

-- Blue Control
(2, 2, 4),  -- 4x Counterspell
(2, 10, 4), -- 4x Brainstorm

-- Elven Ramp
(3, 6, 4),  -- 4x Llanowar Elves
(3, 9, 4),  -- 4x Birds of Paradise

-- Lotus Commander (singleton, max 1 copy per card)
(4, 3, 1),  -- 1x Black Lotus
(4, 4, 1),  -- 1x Serra Angel
(4, 5, 1),  -- 1x Dark Ritual
(4, 8, 1);  -- 1x Wrath of God