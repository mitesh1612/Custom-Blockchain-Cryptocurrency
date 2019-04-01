// Strictly for Testing and Development Purposes
// Import the Block class from the current director
const Block = require('./block');

// Since fooBlock is the first one so we add a Genesis Block. Store the foo string in fooBlock 
const fooBlock = Block.mineBlock(Block.genesis(),'foo');
console.log(fooBlock.toString());
