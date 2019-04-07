class TransactionPool {
    constructor() {
        // Used to represent a collection of transaction objects
        this.transactions = [];
    }

    updateOrAddTransaction(transaction) {
        // Parameter : Incoming Transaction Object
        // By default, adds the incoming transaction to the transactions array
        // However, there is a possibility that a transaction might come in that already exists in the array (Because we have the ability to update transactions by adding outputs)
        // This means that a transaction could exist in the pool with the same id and input and however if its updated and gets re submitted to the pool, we dont want that transaction to appear as a seperate transaction in the pool
        // We want the updated transaction in place of the original. So we find it
        let transactionWithId = this.transactions.find(t => t.id === transaction.id);
        // This finds a transaction that has the matching id with the incoming transaction
        if(transactionWithId) {
            // If such an transaction occurs
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
        }
        else {
            // If no such transaction, occurs, then add it
            this.transactions.push(transaction);
        }
    }

    existingTransaction(address) {
        return this.transactions.find(t => t.input.address === address);
    }

}

module.exports = TransactionPool;