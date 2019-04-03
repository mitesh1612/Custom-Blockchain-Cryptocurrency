const Websocket = require('ws');

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
    constructor(blockchain) {
        // Give each peer an instance of the blockchain
        this.blockchain = blockchain;
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
        
        console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
    }

    connectSocket(socket) {
        this.sockets.push(socket);
        console.log("Socket Connected");
    }
}