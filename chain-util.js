const EC = require('elliptic').ec;
// The uuid Module. Multiple Versions exist but we use v1 because it's timestamp based
const uuidV1 = require('uuid/v1');
// EC is the Elliptic Cryptography Module. It's a class. To use the methods of this class, we need to create an instance. It takes one parameter, a string, which defines what curve based cryptography implementation this ec instance should use
// Bitcoin uses secp256k1
const ec = new EC('secp256k1');


// We'll be adding a few methods here that relate to the utility side of the cryptocurrency system like generate keys, unique hashes etc
// Since more than one class will use these, we include them in a class called ChainUtil
class ChainUtil {
    static genKeyPair() {
        return ec.genKeyPair();
        // With the key pair object, we can use methods that get the public and private key created in this key pair. It also has a sign method which can be used to generate signature based on givent data
    }
    
    static id() {
        return uuidV1();
    }
}

module.exports = ChainUtil;

// In package.json, we added testEnvironment to node for the random number generator required by ec.genKeyPair()