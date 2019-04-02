const express = require('express');
const Blockchain = require('../blockchain')
// Automatically imports the index.js file of a directory so we import the directory

// Need to run mutiple instances of the same app
const HTTP_PORT = process.env.HTTP_PORT || 3001; 
// The Port on which the app will run. Using the process.env thingy, if the user specifies a port using the command line (can be passed as an environment variable like `$HTTP_PORT = 3002 npm run dev`) 

const app = express();
const bc = new Blockchain();

// Returns the blocks of current blockchain
app.get('/blocks',(req, res) => {
    // To send a json to the user. Must return the chain
    res.json(bc.chain);
});

// To make the app listen
app.listen(HTTP_PORT,() => {
    console.log(`Listening on Port : ${HTTP_PORT}`);
});

// Scripts added to package.json in start and dev