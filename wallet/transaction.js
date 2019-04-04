const ChainUtil = require('../chain-util');

class Transaction {
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        // Output have 2 components, 1. How much currency we want to send and 2. How much currency is left after transaction
        this.outputs = [];
    }

    update(senderWallet, recipient, amount) {
        // Deliver more of the sender's currency, thus update the resulting amount so we find the original output
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);
        // Consider case where they transact with amount less than what they have
        if (amount > senderOutput.amount) {
            console.log(`Amount: ${amount} exceeds the Balance`);
            return;
        }
        // If the amount is valid, then we update
        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({ amount, address: recipient});
        // Original Signature won't be valid, so update the signature
        Transaction.signTransaction(this, senderWallet);

        return this;
    }

    static newTransaction(senderWallet, recipient, amount) {
        // senderWallet required to look at their balance and the public key of the wallet to create an output that represents how much currency they should have after the transaction
        // recipient contains the recipients address
        // amount contains the amount we want to send
        // Goal of this function is to return a new instance of transaction class with proper output specified for the sender and recipient
        const transaction =  new this();

        // Users should not send amount more than their current balance
        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds the Balance`);
            return;
        }

        // ... is the spread operator that pushes array element one by one
        transaction.outputs.push(...[
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey},
            { amount, address: recipient}
        ]);
        // First is the remaining balance of user
        // Second is the amount sent. Used destructionary syntax to have same key name

        // Generates the Input Field
        Transaction.signTransaction(transaction, senderWallet);

        return transaction;
    }

    static signTransaction(transaction, senderWallet) {
        transaction.input = { 
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        };
        // What do we sign? We want to generate signature for the entire transaction but doesnt make sense to sign the whole transaction object since we are still creating the input object
        // Also we are using hash in the sign method rather than the actual one because its better to have a constant bit value then some unexpectedly long data. So we use the hash function used in blockchain
    }

    static verifyTransaction(transaction) {
        return ChainUtil.verifySignature(transaction.input.address, transaction.input.signature, ChainUtil.hash(transaction.outputs));
    }

}

module.exports = Transaction;