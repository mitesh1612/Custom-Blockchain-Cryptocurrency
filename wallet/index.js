const ChainUtil = require('../chain-util');
const { INITIAL_BALANCE } = require("../config");

class Wallet {
    constructor() {
        // Give some initial balace to everyone to give some currency to get the economy going
        // In real cryptocurrencies, wallets dont start with an initial balance for free
        // Assume this initial balance is in config file and thus defined globally
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        // Use the method of keyPair object to get the public key
        // We also encode the public key into its hexadecimal string 
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return `Wallet -
        publicKey   : ${this.publicKey.toString()}
        Balance     : ${this.balance}`

        // Publick Key is an object with its own toString Method
    }

    // Tests in dev-test.js
}

module.exports = Wallet;