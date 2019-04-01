const Block = require('./block');

class Blockchain {
    constructor() {
        // Chain with the first block
        this.chain = [Block.genesis()];
    }

    addBlock(data) {
        // Add a new block with the given data. We need the last block and we get it as follows.
        // const lastBlock = this.chain[this.chain.length - 1];
        // We added this directly in our new block creation
        // Generate a new block using the mineBlock function
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);

        return block;
    }
}

module.exports = Blockchain;
