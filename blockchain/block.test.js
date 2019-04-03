const Block = require("./block");

// Describe serves as a description for the test. Second parameter is an arrow function that contains a series of tests that jest will execute once it finds a describe block function
let data, lastBlock, block;
describe("Block",() => {
    //Before Each allows us to run the same code before each following unit tests 
    // For unit tests, we use "it" function. First Parameter is Description. Second is an arrow function that has the code to execute the test
    
    beforeEach(() => {
        data = "bar";
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock,data);
    });

    // These variables are limited to scope of beforeEach so we declare them before the describe and assign in the beforeEach block
    
    it('Sets the `data` to match the Input',() => {
        //Expect takes one piece of data and then we can chain methods after the expect function to describe what we expect the inputted data to be
        expect(block.data).toEqual(data);
        // This expects that the block created where the data of the block should match the data
    });
    
    it('Sets the `lastHash` to the Hast of the Last Block',() => {
        expect(block.lastHash).toEqual(lastBlock.hash);
        // This expects the blocks last hash to be equal to the previous block's hash
    });

    it('Generates a Hash that matches the Difficulty',() => {
        expect(block.hash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty));
    });

    it('Lowers the difficulty for Slowly Mined Blocks',() => {
        // Give the Timestamp of the New Block to be absurdly high to see that difficulty is reduced
        expect(Block.adjustDifficulty(block,block.timestamp+360000)).toEqual(block.difficulty - 1);
    });

    it('Raises the difficulty for Quickly Mined Blocks',() => {
        // Give the Timestamp of the New Block to be absurdly high to see that difficulty is reduced
        expect(Block.adjustDifficulty(block,block.timestamp+1)).toEqual(block.difficulty + 1);
    });
});

// Update the package.json now in scripts now. There we put 'jest --watchAll' (watchAll is similar to nodemon which restarts on changes)

