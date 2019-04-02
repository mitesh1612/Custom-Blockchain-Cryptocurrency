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

    // Function to check the validity of the incoming chain. If the chain is invalid then it returns False otherwise true.
    isValidChain(chain) {
        // Check whether the chain has proper Genesis Block
        // Stringify the blocks to compare
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;
        
        // Now we run validations on every following block after the genesis block in the incoming chain
        for (let i = 1;i < chain.length;i++) {
            const block = chain[i];
            const lastBlock = chain[i-1];
            // Current block's last hash must match the hash of the last block
            
            // If the block's data is tampered and it's generated hash is incorrect
            // Check that the current block's hash matches a generated hash for the current block
            // We need a static hash function in Block class called 'blockHash' (added)!
            if (block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block)) {
                return false;
            }
             
        }

        // If all tests passed, then return true
        return true;
    }

    replaceChain(newChain) {
        // Also check if the new chain is longer or not than our current chain
        // Make sure if it's a valid chain
        if(newChain.length <= this.chain.length) {
            console.log("Received Chain is Not Longer than the Current Chain");
            return;
        } else if (!this.isValidChain(newChain)) {
            console.log("Received Chain is Not Valid");
        }
        
        // If all tests pass then we can replace the chain so
        console.log("Replacing the Block Chain with a New Chain");
        this.chain = newChain;
    }
}

module.exports = Blockchain;
