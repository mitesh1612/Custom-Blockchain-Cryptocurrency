const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
// Automatically imports the index.js file of a directory so we import the directory

// Need to run mutiple instances of the same app
const HTTP_PORT = process.env.HTTP_PORT || 3001; 
// The Port on which the app will run. Using the process.env thingy, if the user specifies a port using the command line (can be passed as an environment variable like `$HTTP_PORT = 3002 npm run dev`) 

const app = express();
// To use Body Parser JSON
app.use(bodyParser.json()); // Allows us to receive JSON in POST Requests now
const bc = new Blockchain();

// Returns the blocks of current blockchain
app.get('/blocks',(req, res) => {
    // To send a json to the user. Must return the chain
    res.json(bc.chain);
});

// For POST Requests, we need to receive data in JSON Format and for that we will use Body Parser
// Body Parser that has a middleware function which allows us to receive JSON Data within POST Requests in our Express App
// Middleware acts between intermediary function that either transforms outgoing data or it transforms incoming data 

// Users will use this endpoint to add data to the block
app.post('/mine',(req, res) => {
    // Automatically Express creates the body object and it contains the JSON Data sent by the POST Request
    // Here we assume that there will be a `data` field in the body object
    const block = bc.addBlock(req.body.data);
    // Inform the sender that a new block was added.
    console.log(`New Block Added: ${block.toString()}`);
    // Response with showing the updated chain. Redirect to the previous blocks endpoint
    res.redirect('/blocks');
});

// To make the app listen
app.listen(HTTP_PORT,() => {
    console.log(`Listening on Port : ${HTTP_PORT}`);
});

// Scripts added to package.json in start and dev