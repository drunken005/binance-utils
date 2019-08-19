const crypto = require("../crypto");
const bip39 = require("bip39");
const encoder = require("../encoder");
const {UVarInt} = require("../encoder/varint");
const Transaction = require('../tx/transaction');
const RawTransaction = require('../tx/raw_transaction');
const {txType} = require('../common/index');


const NETWORK_PREFIX_MAPPING = {
    "testnet": "tbnb",
    "mainnet": "bnb"
};

const NERWORK = {
    "testnet": "testnet",
    "mainnet": "mainnet"
};

const HDPATH = "44'/714'/0'/0/0";

/**
 * Binance wallet
 */
class BnbWallet {

    /**
     * Create or import privateKey wallet
     * @param privateKey
     * @param network Network default 'mainnet'
     */
    constructor(privateKey, network) {
        this.network = network || NERWORK.mainnet;
        this.addressPrefix = NETWORK_PREFIX_MAPPING[this.network];
        this.privateKey = privateKey || crypto.generatePrivateKey();
        this.publicKey = crypto.getPublicKeyFromPrivateKey(this.privateKey);
        this.address = crypto.getAddressFromPrivateKey(this.privateKey, this.addressPrefix);

    }

    /**
     * Export current privateKey keystore object, and returns the private key and address.
     * @param password  keystore object password
     * @returns {{privateKey: (*|string), address: *, keystore: {id, version, crypto}, publicKey: (string|*)}}
     */
    exportKeystore(password) {
        this.privateKey = this.privateKey || crypto.generatePrivateKey();
        const keystore = crypto.generateKeyStore(this.privateKey, password);
        return {
            privateKey: this.privateKey,
            publicKey: this.publicKey,
            address: this.address,
            keystore
        }
    }

    /**
     * Serializes current wallet public key in a 33-byte compressed format.
     * @returns {Buffer}
     */
    serializePubKey() {
        let unencodedPubKey = crypto.generatePubKey(this.privateKey);
        let format = 0x2;
        if (unencodedPubKey.y && unencodedPubKey.y.isOdd()) {
            format |= 0x1
        }
        let pubBz = Buffer.concat([
            UVarInt.encode(format),
            unencodedPubKey.x.toArrayLike(Buffer, "be", 32)
        ]);
        // prefixed with length
        pubBz = encoder.encodeBinaryByteArray(pubBz);
        // add the amino prefix
        pubBz = Buffer.concat([Buffer.from("EB5AE987", "hex"), pubBz]);
        return pubBz
    }

    /**
     * Generates a signature (64 byte <r,s>) for a transaction based on current wallet privateKey
     * @param transaction Unsigned transaction hex string or Transaction instance
     * @returns {String}
     */
    sign(transaction) {
        let _sign = (tx) => {
            return crypto.generateSignature(tx, Buffer.from(this.privateKey, "hex"));
        };

        if (typeof transaction === 'string') {
            transaction = RawTransaction.parseTransaction(transaction);
        }

        if (!(transaction instanceof Transaction)) {
            throw new TypeError(`the transaction type error.`)
        }

        const signBytes = encoder.convertObjectToSignBytes(transaction.signMsg);
        const signature = _sign(signBytes.toString("hex"));
        let pubKey = this.serializePubKey();

        const signatures = [{
            pub_key: pubKey,
            signature: signature,
            account_number: transaction.account_number,
            sequence: transaction.sequence,
        }];

        let msg = transaction.msgs[0];
        const stdTx = {
            msg: [msg],
            signatures: signatures,
            memo: transaction.memo,
            source: 1, // web wallet value is 1
            data: "",
            msgType: txType.StdTx
        };
        const bytes = encoder.marshalBinary(stdTx);
        return bytes.toString("hex");
    }

    /**
     * Export wallet account info
     * @returns {{privateKey: (*|string), path: string, address: *, seed: string, mnemonic: *, publicKey: (string|*), network: (*|string)}}
     */
    export() {
        let _wallet_ = {
            privateKey: this.privateKey,
            publicKey: this.publicKey,
            address: this.address,
            mnemonic: this.mnemonic,
            network: this.network,
            path: this.path,
            seed: this.seed,
        };

        for (let i in _wallet_) {
            !_wallet_[i] && delete _wallet_[i]
        }
        return _wallet_;
    }


    /**
     * Create or import mnemonic HD wallet
     * @param mnemonic The mnemonic phrase words
     * @param network Binance chain network, supported 'mainnet/testnet', default: 'mainnet'
     * @returns {BnbWallet}
     */
    static createMnemonicWallet(mnemonic, network) {
        mnemonic = mnemonic || crypto.generateMnemonic();
        const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
        const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic);
        let wallet = new BnbWallet(privateKey, network);
        wallet.mnemonic = mnemonic;
        wallet.seed = seed;
        wallet.path = HDPATH;
        return wallet;

    }

    /**
     * Import keystore object wallet
     * @param keystore Keystore object
     * @param password
     * @param network Binance chain network, supported 'mainnet/testnet', default: 'mainnet'
     * @returns {BnbWallet}
     */
    static importKeystoreWallet(keystore, password, network) {
        let privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);
        return new BnbWallet(privateKey, network)

    }

    /**
     * Checks whether an address is valid.
     * @param address
     * @param network
     * @returns {boolean}
     */
    static checkAddress(address, network) {
        let prefix = NETWORK_PREFIX_MAPPING[network];
        return crypto.checkAddress(address, prefix)
    }


    /**
     * Verifies a signature (64 byte <r,s>) given the sign bytes and public key.
     * @param sigHex The signature hexstring.
     * @param signBytesHex Unsigned transaction sign bytes hexstring.
     * @param publicKeyHex  The public key.
     * @returns {Buffer}
     */
    static verifySignature(sigHex, signBytesHex, publicKeyHex) {
        return crypto.verifySignature(sigHex, signBytesHex, publicKeyHex);

    }


}

module.exports = BnbWallet;
