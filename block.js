// To get the SHA256 Algorithm
const SHA256 = require('crypto-js/sha256');

class Block {
    // Attributes the Block Needs
    constructor(timestamp, lastHash, hash, data) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    // Used for Debugging
    toString() {
        // Template String to show the block
        // Since hashes are long (about 32 characters, we only print the first 10 characters using the substring function)
        return `Block - 
            Time Stamp: ${this.timestamp}
            Last Hash : ${this.lastHash.substring(0,10)}
            Hash      : ${this.hash.substring(0,10)}
            Data      : ${this.data}`;
    }

    // For the Genesis Block
    // We can call the Genesis Function without any instance of the Block Class so we make it static
    // Must return a block of this class and we create some default values
    static genesis() {
        // Using this to call the constructor of this class
        return new this('Genesis Time','-----','f1r57-h45h',[]);
    }

    // We provide the lastBlock information and the data we want to insert
    static mineBlock(lastBlock, data) {
        // Create a timestamp
        const timestamp = Date.now();
        // Set the hash of previous block
        const lastHash = lastBlock.hash;
        const hash = Block.hash(timestamp,lastHash,data);
        // We already have our data so we can return a new block now
        return new this(timestamp,lastHash,hash,data);
    }

    // Will represent the unique data that we want to generate the hash for
    static hash(timestamp, lastHash, data) {
        // Using the Template String to combine the data
        // Using toString because the function returns an object
        return SHA256(`${timestamp}${lastHash}${data}`).toString();
    }
}

// To share the Block class to other modules
module.exports = Block;