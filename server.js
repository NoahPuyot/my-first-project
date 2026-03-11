const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'mtgdeck',
	password: 'Il0can0s',
	port: 5432
});

//GETING EVERYTHING
//===================================================================================

//Gets all data from decks
//Get = Read
//Async = Allows for asynchronous operations/allows multiple operations to run.
app.get('/api/Decks', async (req, res)=>{
    try{
        //LEFT JOIN returns all records from left table (decks) and fills null for those that havev no match in the right table (cards).
        const result = await pool.query('SELECT Decks.*, Cards.*, Formats.*, Users.*, Decks_and_Cards.* FROM Decks JOIN Formats ON Decks.FormatID = Formats.FormatID JOIN Users ON Decks.UserID = Users.UserID LEFT JOIN Decks_and_Cards ON Decks.DeckID = Decks_and_Cards.DeckID LEFT JOIN Cards ON Decks_and_Cards.CardID = Cards.CardID')
        res.json(result.rows);
    } catch (err){
        res.status(500).json({ error: err.message});
    }
});

//Gets all formats (For dropdown menu)
app.get('/api/Formats', async (req, res) => {
    try{
        const result = await pool.query('SELECT FormatID, FormatName FROM Formats');
        res.json(result.rows);
    } catch (err){
        res.status(500).json({ error: err.message});
    }
});

//Gets all users (For dropdown menu)
app.get('/api/Users', async (req, res) => {
    try{
        const result = await pool.query('SELECT UserID, UserName FROM Users');
        res.json(result.rows);
    } catch (err){
        res.status(500).json({ error: err.message});
    }
});

//app.get('/api/Decks/:id', async (req, res) =>{
//    try{
//        const deckId = req.params.id;
//    } catch(err){
//        res.status(500).json({ error: err.message});
//    }
//});


//DECK STUFF
//===================================================================================

//Create a new deck (Post = Create)
app.post('/api/Decks', async (req, res)=>{
    try{
        const { DeckName, FormatID, UserID } = req.body;
        //Inserts a new deck with a name, format, and user into the database and then returns the created deck back (For bugfixing purposes?)
        const result = await pool.query('INSERT INTO Decks (deckname, formatid, userid) VALUES ($1, $2, $3) RETURNING *', [DeckName, FormatID, UserID]);
        res.json(result.rows[0]);
    } catch (err){
        res.status(500).json({ error: err.message});
    }
});

//Deletes a deck
app.delete('/api/Decks/:id', async (req, res) => {
    try{
        const deckId = req.params.id;

        const result = await pool.query('DELETE FROM Decks WHERE DeckID = $1 RETURNING *', [deckId]);

        if (result.rows.length === 0) {
            res.status(404).json({error: 'Deck not found'});
        } else{
            res.json({message: 'Deck deleted successfully', deck: result.rows[0]});
        }
    } catch(err){
        res.status(500).json({error: err.message});
    }
});

//Edits a deck
app.put('/api/Decks/:id/cards', async (req, res) => {
    try{
        const deckId = req.params.id;
        const { CardId, Quantity } = req.body;

        const result = await pool.query('INSERT INTO Decks_and_Cards (deckid, cardid, quantity) VALUES ($1, $2, $3) RETURNING *', [deckId, CardId, Quantity])
        res.json(result.rows[0]);
    } catch(err){
        res.status(500).json({error: err.message});
    }
});

//Deletes a card from a deck
app.delete('/api/Decks/:id/cards/:cardId', async (req, res) => {
    try{
        const deckId = req.params.id;
        const cardId = req.params.cardId;

        const result = await pool.query('DELETE FROM Decks_and_Cards WHERE DeckID = $1 AND CardID = $2 RETURNING *', [deckId, cardId]);

        if (result.rows.length === 0) {
            res.status(404).json({error: 'Card not found'});
        } else{
            res.json({message: 'Card deleted successfully from deck', card: result.rows[0]});
        }
    } catch(err){
        res.status(500).json({error: err.message});
    }
})

//USER STUFF
//===================================================================================

//Creates a new user
app.post('/api/Users', async (req, res)=>{
    try{
        const { UserName, Email } = req.body;
        //Inserts a new user with a name into the database and then returns the created user back
        const result = await pool.query('INSERT INTO Users (UserName, Email) VALUES ($1, $2) RETURNING *', [UserName, Email]);
        res.json(result.rows[0]);
    } catch (err){
        res.status(500).json({ error: err.message});
    }
});

//Deletes a user
app.delete('/api/Users/:id', async (req, res) => {
    try{
        const userId = req.params.id;

        const result = await pool.query('DELETE FROM Users WHERE UserID = $1 RETURNING *', [userId]);

        if (result.rows.length === 0) {
            res.status(404).json({error: 'User not found'});
        } else{
            res.json({message: 'User deleted successfully', user: result.rows[0]});
        }
    } catch(err){
        res.status(500).json({error: err.message});
    }
});

//Starts the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
});