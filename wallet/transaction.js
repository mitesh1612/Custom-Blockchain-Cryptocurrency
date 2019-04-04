const ChainUtil = require('../chain-util');

class Transaction {
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        // Output have 2 components, 1. How much currency we want to send and 2. How much currency is left after transaction
        this.outputs = [];
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

        return transaction;
    }
}