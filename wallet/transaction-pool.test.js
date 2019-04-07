const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');

describe("Transaction Pool", () => {
    let tp, wallet, transaction;
    beforeEach(() => {
        tp = new TransactionPool();
        wallet = new Wallet();
        transaction = Transaction.newTransaction(wallet, 'r4nd-4dr355', 30);
        tp.updateOrAddTransaction(transaction);
    });

    it("Adds a Transaction to the Pool",() => {
        // Look for transactions with matching id and then compare those objects
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    });

    it("Updates a Transaction in the Pool",() => {
        // Update the Transaction First and then pass that to the function 
        // Also take a copy of the original
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet, 'foo-4ddr335', 40);
        tp.updateOrAddTransaction(newTransaction);
        // Then we check if the transaction in the pool has the updated information
        // Thus stringified version should not equal to the old transaction
        expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id))).not.toEqual(oldTransaction);
    });

});