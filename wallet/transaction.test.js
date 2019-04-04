const Transaction = require('./transaction');
const Wallet = require('./index');

describe("Transaction",() => {
    let transaction, wallet, recipient, amount;

    beforeEach(() => {
        wallet = new Wallet();
        amount = 50;
        recipient = 'r3c1p13nt';
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it("Outputs the `amount` subtracted from the Wallet Balance", () => {
        // Find the output that matches the public key of the wallet within transaction. Use find method
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount);
    });

    it("Outputs the `amount` added to the recipient", () => {
        expect(transaction.outputs.find(output => output.address === recipient).amount).toEqual(amount);
    });

    it("Inputs the `balance` of the Wallet",() => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it("Validates a Valid Transaction",() => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it("Invalidates a Corrupt Transaction",() => {
        // Corrupt the Transaction First
        transaction.outputs[0].amount = 50000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });

    describe("Transacting with an Amount that Exceeds the Balance",() => {
        beforeEach(() => {
            amount = 50000;
            transaction = Transaction.newTransaction(wallet, recipient, amount);
        });

        it("Does not create a Transaction",() => {
            expect(transaction).toEqual(undefined);
        });

    });
});