const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
// Automatically imports the index.js file of a directory so we import the directory
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
// Due to this every user will have a unique instance of TransactionPool but we want to share this (Its local)
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');
// We'll use the P2P Server to synchronize

// Need to run mutiple instances of the same app
const HTTP_PORT = process.env.HTTP_PORT || 3001; 
// The Port on which the app will run. Using the process.env thingy, if the user specifies a port using the command line (can be passed as an environment variable like `$HTTP_PORT = 3002 npm run dev`) 

const app = express();
// To use Body Parser JSON
app.use(bodyParser.json()); // Allows us to receive JSON in POST Requests now
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
// 1. We want to be able to add new transactions in the pool to conduct exchanges with other users
// 2. Users must also be able to see all the transactions in the pool
// Create a new instance of the P2p Server using our blockchain and the transaction pool
const p2pServer = new P2pServer(bc, tp);
const miner = new Miner(bc,tp,wallet,p2pServer);

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
    // After mining the block, sync chains to all the peers
    p2pServer.syncChains();
    // Response with showing the updated chain. Redirect to the previous blocks endpoint
    res.redirect('/blocks');
});

app.get('/mine-transactions',(req,res) => {
    const block = miner.mine();
    console.log(`New Block Added: ${block.toString()}`);
    res.redirect('/blocks');
});

app.get('/transactions',(req, res) => {
    res.json(tp.transactions);
});

app.post('/transact',(req, res) => {
    const { recipient, amount } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, tp);
    // Broadcast the transaction we created to the server
    p2pServer.broadcastTransaction(transaction);
    // To see the new transaction
    res.redirect('/transactions');
});

app.get('/public-key',(req, res) => {
    res.json({ publicKey : wallet.publicKey });
})

// To make the app listen
app.listen(HTTP_PORT,() => {
    console.log(`Listening on Port: ${HTTP_PORT}`);
});
// Start the web socket server
p2pServer.listen();

// Scripts added to package.json in start and dev