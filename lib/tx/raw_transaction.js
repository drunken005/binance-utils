const Transaction = require('./transaction');
const encoder = require("../encoder");
const {txType} = require('../common');
const Wallet = require('../wallet/wallet');
const parseMsgMapping = require('./parse_msg_mapping');

/**
 * Construct RawTransaction hex string
 */
class RawTransaction {
    constructor(network) {
        network = network || 'mainnet';
        this.transaction = new Transaction(network);
    }
    /**
     * Create rawTransaction, the parameter list corresponds to the parameters of each Transaction, eg. transfer、multiSend、cancelOrder、list and more
     * @example
     * let rawTransaction = new RawTransaction('testnet');
     * const tx = rawTransaction.create('transfer', fromAddress, toAddress, amount, assert, account_number, sequence, memo);
     * @returns {String} unsigned transaction hex string
     */
    create() {
        let args = Array.prototype.slice.apply(arguments);
        let transaction = this.transaction.create.call(this.transaction, ...args);
        return transaction.serializeRawData();
    }

    /**
     * Decode raw transaction data
     * @param data Transaction hex string
     * @returns {{msg, signMsgHex, signMsg}}
     */
    static parseTransaction(data) {
        let decodeMsg = (msgType, rawTransaction) => {
            let transactionStr = Buffer.from(rawTransaction, 'hex').toString();
            let transaction = JSON.parse(transactionStr);

            let parse = parseMsgMapping[msgType];
            if (!parse) {
                throw new Error('msgType is error');
            }
            let _msg = parse(transaction.msgs[0], msgType);
            return {msg: _msg, signMsg: transaction, signMsgHex: rawTransaction};
        };
        let transaction = JSON.parse(Buffer.from(data, 'hex').toString());
        return decodeMsg(transaction.msgType, transaction.rawTransaction);
    }

    /**
     * Sign the raw transaction
     * @param privateKey
     * @param rawTransaction string
     * @param network
     * @returns {string} signed transaction hex string
     */
    static sign(privateKey, rawTransaction, network) {
        let wallet = new Wallet(privateKey, network);
        let transaction = RawTransaction.parseTransaction(rawTransaction);
        let signature = wallet.sign(transaction.signMsgHex);

        let v = Wallet.verifySignature(signature, transaction.signMsgHex, wallet.export().publicKey);
        console.log('Wallet.verifySignature,.........',  v);


        let pubKey = wallet.serializePubKey();
        let signatures = [{
            pub_key: pubKey,
            signature: signature,
            account_number: parseInt(transaction.signMsg.account_number),
            sequence: parseInt(transaction.signMsg.sequence)
        }];

        const stdTx = {
            msg: [transaction.msg],
            signatures: signatures,
            memo: transaction.signMsg.memo,
            source: 1, // web wallet value is 1
            data: "",
            msgType: txType.StdTx
        };
        return encoder.marshalBinary(stdTx);
    }
}

module.exports = RawTransaction;

