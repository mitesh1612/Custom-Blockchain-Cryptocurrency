// To get the SHA256 Algorithm
const SHA256 = require('crypto-js/sha256');

const { DIFFICULTY, MINE_RATE } = require("../config");

class Block {
    // Attributes the Block Needs
    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY; // If first block, then nothing specified in constructor and thus use the system's difficulty
    }

    // Used for Debugging
    toString() {
        // Template String to show the block
        // Since hashes are long (about 32 characters, we only print the first 10 characters using the substring function)
        return `Block - 
            Time Stamp : ${this.timestamp}
            Last Hash  : ${this.lastHash.substring(0,10)}
            Hash       : ${this.hash.substring(0,10)}
            Nonce      : ${this.nonce}
            Difficulty : ${this.difficulty}
            Data       : ${this.data}`;
    }

    // For the Genesis Block
    // We can call the Genesis Function without any instance of the Block Class so we make it static
    // Must return a block of this class and we create some default values
    static genesis() {
        // Using this to call the constructor of this class
        // Default Nonce Value for Genesis Block is 0
        return new this('Genesis Time','-----','f1r57-h45h',[],0,DIFFICULTY);
    }

    // We provide the lastBlock information and the data we want to insert
    static mineBlock(lastBlock, data) {
        let hash, timestamp;
        // Set the hash of previous block
        const lastHash = lastBlock.hash;
        // Difficulty of each block depends on the difficulty of the last block so we need to access it
        let { difficulty } = lastBlock;
        let nonce = 0;
        // Need to ensure that our block has number of leading 0's passing the proof of work condition and thus need to generate hashes accordingly
        do {
            nonce++;
            // Need to Recalculate the TimeStamp with every iteration
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp,lastHash,data,nonce,difficulty);
        } while (hash.substring(0,difficulty) !== '0'.repeat(difficulty)); // Proof of Work Condition
        // We already have our data so we can return a new block now
        return new this(timestamp,lastHash,hash,data,nonce,difficulty);
    }

    // Will represent the unique data that we want to generate the hash for
    static hash(timestamp, lastHash, data, nonce, difficulty) {
        // Using the Template String to combine the data
        // Using toString because the function returns an object
        return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    // To Generate Hash of a Block
    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty } = block;
        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }

    // To adjust the difficulty of the block
    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        // Increase the Difficulty if the block was mined before the MINE_RATE time or less by one otherwise
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }
}

// To share the Block class to other modules
module.exports = Block;