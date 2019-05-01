class Miner {
    constructor(blockchain, transactionPool, wallet, p2pServer) {
        // Since we tie the blockchain and transactionPool, we need those
        // Every Miner has an individual wallet 
        // Also have a reference to P2P Server to communicate with other miners
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    mine() {
        // Ties together all the functionality
        // 1. Grabs transactions from the pool
        // 2. Create a block whose data is those transactions
        // 3. Tells the P2P Server to Synchronize the Chain and Include the Block in the Server
        // 4. Clear the Transaction Pool since they are included in the blockchain
        
        // Grab Valid Transactions from the Pool (Do not have incorrect or corrupt data). Use these as new block for the chain
        const validTransactions = this.transactionPool.validTransactions();
        // Include a Reward for the Miner
        // Create a block consisting of the valid transactions
        // Since new block was added, so synchronize the chains in p2p server
        // Clear the transaction pool local to the miner and all the transaction pool in the system so that the transactions arent added again
        // So Clear the Transaction Pool
        // Broadcast to every miner to clear their transaction pools


    }
}

module.exports = Miner;