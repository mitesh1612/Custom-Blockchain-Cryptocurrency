const Blockchain = require('./blockchain');
const Block = require('./block');

describe("Blockchain", () => {
    let bc,bc2;
    
    beforeEach(() => {
        bc = new Blockchain();
        bc2 = new Blockchain();
    });

    it("Starts with the Genesis Block",() => {
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it("It adds a New Block",() => {
        const data = 'foo';
        bc.addBlock(data);
        // Check if the data of last block matches the data we used
        expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
    });

    // 3 Cases for isValidChain Function.
    // 1. Ensure that it validates a valid chain
    // 2. Invalidates a chain with a corrupt genesis block
    // 3. Invalidates a chain with a corrupt block that is not genesis block

    it("Validates a Valid Chain",() => {
        bc2.addBlock('foo');
        
        // toBe used for True/False Assertions in Jest 
        expect(bc.isValidChain(bc2.chain)).toBe(true);
    });

    it("Invalidates a Chain with a Corrupted Genesis Block",() => {
        // Corrupt the second chain's Genesis Block
        bc2.chain[0].data = "Bad Data";
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it("Invalidates a Corrupt Chain",() => {
        bc2.addBlock('foo');
        bc2.chain[1].data = 'Not foo';
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    // 2 Tests for replaceChain Function.
    // 1. Ensure that the chain is indeed replaced if the given chain is valid as input
    // 2. Ensure chain is not replaced if the chain is less than or equal to length
    it("Replaces the Chain with a Valid Chain",() => {
        bc2.addBlock('foo');
        bc.replaceChain(bc2.chain);
        // Should be valid and replace
        expect(bc.chain).toEqual(bc2.chain);
    });

    it("It doesn't replace the Chain with One of Less than or Equal to Length",() => {
        // Make sure original chain has some blocks
        bc.addBlock('foo');
        bc.replaceChain(bc2.chain);
        // Should Invalid and Not Replace
        expect(bc.chain).not.toEqual(bc2.chain);
    });
});