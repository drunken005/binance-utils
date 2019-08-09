const crypto = require("../crypto");
const bip39 = require("bip39");
const encoder = require("../encoder");
const {UVarInt} = require("../encoder/varint");


const NETWORK_PREFIX_MAPPING = {
    "testnet": "tbnb",
    "mainnet": "bnb"
};

const NERWORK = {
    "testnet": "testnet",
    "mainnet": "mainnet"
};

const HDPATH = "44'/714'/0'/0/0";


class BnbWallet {

    /**
     *
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

    sign(data) {
        return crypto.generateSignature(data, Buffer.from(this.privateKey, "hex"));
    }

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

    static importKeystoreWallet(keystore, password, network) {
        let privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);
        return new BnbWallet(privateKey, network)

    }


    static checkAddress(address, network) {
        let prefix = NETWORK_PREFIX_MAPPING[network];
        return crypto.checkAddress(address, prefix)
    }


    static verifySignature(sigHex, signBytesHex, publicKeyHex) {
        return crypto.verifySignature(sigHex, signBytesHex, publicKeyHex);

    }


}

module.exports = BnbWallet;
