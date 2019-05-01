const Wallet = require('./index');
const Transaction = require('./transaction');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain')

describe("Wallet", () => {
    let wallet, tp, bc;
    
    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransactionPool();
        bc = new Blockchain();
    });

    describe("Creating a Transaction", () => {
        let transaction, sendAmount, recipient;
        
        beforeEach(() => {
            sendAmount = 50;
            recipient = 'r4nd0m-4ddr335';
            transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
        });

        describe("And Doing the Same Transaction", () => {
            
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, bc, tp);
            });

            it("Doubles the `sendAmount` subtracted from the Wallet Balance", () => {
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - sendAmount * 2);
            });

            it("Clones the `sendAmount` Output for the Recipient",() => {
                expect(transaction.outputs.filter(output => output.address === recipient).map(output => output.amount)).toEqual([sendAmount, sendAmount]);
            });
        });
    });
});