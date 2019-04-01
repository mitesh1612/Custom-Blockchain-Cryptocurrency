const Blockchain = require('./blockchain');
const Block = require('./block');

describe("Blockchain", () => {
    let bc;
    
    beforeEach(() => {
        bc = new Blockchain();
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
});