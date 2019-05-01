const Wallet = require('./index');
const Transaction = require('./transaction');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain');
const { INITIAL_BALANCE } = require('../config');

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

    describe("Calculating a Balance",() => {
        let addBalance; // Define how much currency we exchange in each transaction
        let repeatAdd; // Number of times we repeat the transaction
        let senderWallet;
        
        beforeEach(() => {
            senderWallet = new Wallet();
            addBalance = 100;
            repeatAdd = 3;
            // Note repeatAdd*addBalance < Initial Balance of Wallet
            for (let i=0;i<repeatAdd;i++) {
                senderWallet.createTransaction(wallet.publicKey,addBalance,bc,tp);
            }
            // Need a blockchain with the above transactions
            bc.addBlock(tp.transactions);  
        });

        it("Calculates the Balance for Blockchain Transaction Matching the Recipient",() => {
            expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + addBalance*repeatAdd);
        });

        it("Calculates the Balance for Blockchain Transaction Matching the Sender",() => {
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - addBalance*repeatAdd);
        });

        describe("Recipient Conducts a Transaction",() => {
            let subtractBalance, recipientBalance;
            beforeEach(() => {
                // Clear the old pool
                tp.clear();
                subtractBalance = 60;
                recipientBalance = wallet.calculateBalance(bc);
                // Create a new transaction
                wallet.createTransaction(senderWallet.publicKey,subtractBalance,bc,tp);
                // Add the new Transaction to the Blockchain
                bc.addBlock(tp.transactions);
                // Now Calculate Balance Function should find the balance according to this current transaction only
            });

            describe("And the Sender Sends Another Transaction to the Recipient",() => {
                beforeEach(() => {
                    tp.clear();
                    // Clear Pool to create fresh set of transaction
                    senderWallet.createTransaction(wallet.publicKey,addBalance,bc,tp);
                    bc.addBlock(tp.transactions);
                });

                it("Calculate the Recipient Balance Only using Transactions since its most Recent One",() => {
                    expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - subtractBalance + addBalance);
                });
            });
        });
    });
}); 