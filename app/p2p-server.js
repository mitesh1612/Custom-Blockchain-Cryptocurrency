const Websocket = require('ws');

// Type field types for different messages
const MESSAGE_TYPES = {
    chain: "CHAIN",
    transaction: "TRANSACTION",
    clear_transactions: "CLEAR_TRANSACTIONS"
}

// Default Port is 5001 or define a port specifically (like done previously)
const P2P_PORT = process.env.P2P_PORT || 5001;

// Using an Environment Variable, a string, containing a list of websocket addresses that this websocket connects to a peer
// Web socket address are stored as 'ws://localhost:5001' (Use ws:// protocol instead of http)
// We combine multiple peers using string "ws://localhost:5001,ws://localhost:5002" (seperated by comma)
// Example `HTTP_PORT=3002 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5003 npm run dev`. This is an instance of the application that will actually connect to some peers on the system
// Then we will actually run this command later to explore our class
// This constant checks if a peers environment variable has been declared
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pServer {
    constructor(blockchain, transactionPool) {
        // Give each peer an instance of the blockchain
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.sockets = [];
    }
    
    // Function to start up a server and create it first of all 
    listen() {
        // Create a Web Socket Server. Server is static and requires some options. We pass the port
        const server = new Websocket.Server({ port: P2P_PORT });
        
        // Setup an event listener through a function on the server object called 'on'
        // Event Listener is a special function that can listen for incoming types of messages sent to the websocket server
        // First argument is the event that we'll listen for (string). By listening for connection events, we can fire up some code whenever a socket connects to this server 
        // We also give a callback function to interact with that socket whose parameter is that one socket object that is created as a result of this connection (Using a helper function here)
        server.on('connection', socket => this.connectSocket(socket));

        // To handle later instances of applications to connect to peers that are specified when they are started
        this.connectToPeers();

        console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);

    }

    connectToPeers() {
        // Run some code for each peers in the array
        peers.forEach(peer => {
            // peer is an address of type 'ws://localhost:5001' (Basically peer is an address of the peer)
            // Creates a socket object like the one above
            const socket = new Websocket(peer);
            // Open another event listener for the open event for this because when we specify peers for the application, we might not have started the server at localhost:5001
            // By using this on('open') event listener, we can run some code if that server is started later even though it is specified as a peer first
            socket.on('open',() => this.connectSocket(socket));
        });
    }

    connectSocket(socket) {
        this.sockets.push(socket);
        console.log("Socket Connected");

        // Thus our sockets are ready to receive messages
        this.messageHandler(socket);

        // We have to send messages containing the blockchain object to the sockets we connect to
        // We want to send a message to each socket that our web socket server receives as a peer connection
        // Our socket sends the stringified version of the chain we have
        this.sendChain(socket);
    }
    
    messageHandler(socket) {
        // Occurs whenever a message is received that was sent via the sent function. Callback contains the message object
        // We assume that are messages are stringified objects
        socket.on('message',message => {
            // Convert the stringified message to JSON
            const data = JSON.parse(message);
            switch(data.type) {
                case MESSAGE_TYPES.chain:
                    // Now we try to update our blockchain using the chain received
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MESSAGE_TYPES.transaction: 
                    // Update or add the incoming transaction to the transaction pool
                    this.transactionPool.updateOrAddTransaction(data.transaction);
                    break;
                case MESSAGE_TYPES.clear_transactions:
                    this.transactionPool.clear();
                    break;
            }
        });
        // We need to attach the handler to the sockets
        // Since all sockets run through the connectSocket function, we attach the message handler there

    }
    sendChain(socket) {
        // Add the type and key
        socket.send(JSON.stringify({type: MESSAGE_TYPES.chain,
            chain: this.blockchain.chain
        }));
    }

    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({type: MESSAGE_TYPES.transaction,
            transaction
        }));
        // Sets the transaction key to the transaction object
        // Now since the socket's message handler assumes that the received message is a chain, it tries to replace the blockchain
        // To solve this, we can attach type fields to the data we send over messages

    }

    syncChains() {
        // Synchronize the chain to all other sockets
        this.sockets.forEach(socket => this.sendChain(socket));
    }

    // Broadcast a new transaction to all the sockets
    broadcastTransaction(transaction) {
        // Send to all sockets
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction))
    }

    broadcastClearTransactions() {
        this.sockets.forEach(socket => socket.send(JSON.stringify({
            type: MESSAGE_TYPES.clear_transactions
        })));
    }
}

module.exports = P2pServer;