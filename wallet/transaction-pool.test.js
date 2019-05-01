const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');

describe("Transaction Pool", () => {
    let tp, wallet, transaction;
    beforeEach(() => {
        tp = new TransactionPool();
        wallet = new Wallet();
        // Reducing the previous manual work to using the wallet's create transaction method
        transaction = wallet.createTransaction('r4nd-4dr355',30,tp);
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

    // Create a situation of valid and corrupt transactions
    describe("Mixing Valid and Corrupt Transactions",() => {
        let validTransactions;
        beforeEach(() => {
            // Spread Operator to add each elements of transactions one at a time
            validTransactions = [...tp.transactions];
            for(let i = 0;i<6;i++) {
                // Create a new wallet each time
                wallet = new Wallet()
                transaction = wallet.createTransaction('r4nd-4dr355',30,tp);
                // Even Transactions are Corrupted and others are valid
                if (i % 2 == 0) {
                    transaction.input.amount = 99999;
                }
                else {
                    validTransactions.push(transaction)
                }
            }
        });
        
        it('Shows a Difference between Valid and Corrupt Transactions',() => {
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });

        it("Grabs Valid Transactions",() => {
            expect(tp.validTransactions()).toEqual(validTransactions);
        });
    });

});