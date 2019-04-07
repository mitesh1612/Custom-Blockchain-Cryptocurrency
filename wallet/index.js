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

    createTransaction(recipient, amount, transactionPool) {
        // Creates transactions based on a given recipient address and amount
        // Also check if a transaction from this wallet already exists in within a given Transaction Pool. If so, update that
        
        // Check if the amount doesnt exceed the balance first
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
            transactionPool.updateOrAddTransaction(transaction);
        }

        return transaction;
    }
}

module.exports = Wallet;