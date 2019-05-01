const ChainUtil = require('../chain-util');
const { INITIAL_BALANCE } = require("../config");
const Transaction = require('./transaction');

class Wallet {
    constructor() {
        // Give some initial balace to everyone to give some currency to get the economy going
        // In real cryptocurrencies, wallets dont start with an initial balance for free
        // Assume this initial balance is in config file and thus defined globally
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        // Use the method of keyPair object to get the public key
        // We also encode the public key into its hexadecimal string 
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return `Wallet -
        publicKey   : ${this.publicKey.toString()}
        Balance     : ${this.balance}`

        // Publick Key is an object with its own toString Method
    }

    // Tests in dev-test.js

    sign(dataHash) {
        // Use the dataHash to generate a signature using the private and public keys
        this.keyPair.sign(dataHash);
    }
    // Not using the above method right now since there is some issue

    createTransaction(recipient, amount, blockchain, transactionPool) {
        // Creates transactions based on a given recipient address and amount
        // Also check if a transaction from this wallet already exists in within a given Transaction Pool. If so, update that
        // 3rd Parameter as Blockchain to use for balance

        // Check if the amount doesnt exceed the balance first
        
        this.balance = this.calculateBalance(blockchain);
        if (amount > this.balance) {
            console.log(`Amount: ${amount} Exceeds the Current Balance ${this.balance}`);
            return;
        }

        // Check if a transaction associated with the sender exists in the pool
        let transaction = transactionPool.existingTransaction(this.publicKey);

        if(transaction) {
            // Transaction associated with the sender exists so we want to update
            transaction.update(this, recipient, amount);
        }
        else {
            // Transaction doesnt exist so create a new one
            transaction = Transaction.newTransaction(this, recipient, amount);
            // Shouldnt this be outside the else block?
            transactionPool.updateOrAddTransaction(transaction);
        }

        return transaction;
    }

    calculateBalance(blockchain) {
        let balance = this.balance;
        let transactions = []
        // Blockchain has blocks which has list of transactions 
        blockchain.chain.forEach(block => block.data.forEach(transaction => {
            transactions.push(transaction)
        }));
        // Array of transactions whose input was created by this wallet
        const walletInputTs = transactions.filter(transaction => transaction.input.address === this.publicKey);
        
        let startTime = 0

        if (walletInputTs.length > 0) {
            // We cant reduce an empty array so if InputTs, value gets undefined so apply a check
            // Mainly want the recent transactions that this wallet created
            // So we collect objects since the highest timestamp
            // Gives the most recent transaction. 
            const recentInputT = walletInputTs.reduce((prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current);
            // Balance should correspond to the output object of this recent transaction
            balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
            // Add up the received currency 
            startTime = recentInputT.input.timestamp;
        }
        transactions.forEach(transaction => {
            // Only look for outputs where the transaction time stamp is bigger than the 
            if(transaction.input.timestamp > startTime) {
                // Initially startTime is 0 because if no transctions are looked at yet
                transaction.outputs.find(output => {
                    if(output.address === this.publicKey) {
                        balance += output.amount;
                    }
                });
            }
        });

        return balance;
    }

    static blockchainWallet() {
        const blockchainWallet = new this();
        // To make it as the blockchain's wallet, we change it's address
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }
}

module.exports = Wallet;