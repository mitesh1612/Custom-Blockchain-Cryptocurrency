const ChainUtil = require('../chain-util');
const { MINING_REWARD } = require('../config');
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

    // We need to create transaction object with given outputs and sign it. So we reuse the code of newTransaction function 
    // Generate Transaction with Given Outputs
    static transactionWithOutputs(senderWallet, outputs) {
        // senderWallet to sign and outputs to push
        // Create the new transaction
        const transaction = new this();
        // Push Given Outputs
        transaction.outputs.push(...outputs);
        // Sign the Transaction
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;

    }

    static newTransaction(senderWallet, recipient, amount) {
        // senderWallet required to look at their balance and the public key of the wallet to create an output that represents how much currency they should have after the transaction
        // recipient contains the recipients address
        // amount contains the amount we want to send
        // Goal of this function is to return a new instance of transaction class with proper output specified for the sender and recipient

        // Users should not send amount more than their current balance
        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds the Balance`);
            return;
        }

        // First is the remaining balance of user
        // Second is the amount sent. Used destructionary syntax to have same key name

        // Generates the Input Field
        // Create a Transaction with the created outputs
        return Transaction.transactionWithOutputs(senderWallet,[
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey},
            { amount, address: recipient}
        ]);
    }

    static rewardTransaction(minerWallet,blockchainWallet) {
        // blockchainWallet is used to confirm and authenticate reward transactions
        return Transaction.transactionWithOutputs(blockchainWallet,[{
            amount: MINING_REWARD, address: minerWallet.publicKey
        }]);
    }

    static signTransaction(transaction, senderWallet) {
        transaction.input = { 
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.keyPair.sign(ChainUtil.hash(transaction.outputs))
        };
        // What do we sign? We want to generate signature for the entire transaction but doesnt make sense to sign the whole transaction object since we are still creating the input object
        // Also we are using hash in the sign method rather than the actual one because its better to have a constant bit value then some unexpectedly long data. So we use the hash function used in blockchain
        // For now creating the signature directly instead of using the sign function of wallet because it created undefined problems
    }

    static verifyTransaction(transaction) {
        return ChainUtil.verifySignature(transaction.input.address, transaction.input.signature, ChainUtil.hash(transaction.outputs));
    }

}

module.exports = Transaction;