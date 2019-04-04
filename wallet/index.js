const { INITIAL_BALANCE } = require("../config");

class Wallet {
    constructor() {
        // Give some initial balace to everyone to give some currency to get the economy going
        // In real cryptocurrencies, wallets dont start with an initial balance for free
        // Assume this initial balance is in config file and thus defined globally
        this.balance = INITIAL_BALANCE;
        this.keyPair = null;
        this.publicKey = null;
    }

    toString() {
        return `Wallet -
        publicKey   : ${this.publicKey.toString()}
        Balance     : ${this.balance}`

        // Publick Key is an object with its own toString Method
    }
}

module.exports = Wallet;