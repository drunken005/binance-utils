const Transaction = require('./transaction');
const parseMsgMapping = require('./parse_msg_mapping');
const {CHAINID_NETWORK_MAPPING} = require('../common');
const encoder = require("../encoder");

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
        const signBytes = encoder.convertObjectToSignBytes(transaction.signMsg);
        let std = {
            msgType: transaction.type,
            signStr: signBytes.toString('hex')
        };
        return Buffer.from(JSON.stringify(std)).toString('hex');
    }


    /**
     * Converts the rawTransaction string to Transaction
     * @param rawTransaction
     * @returns {Transaction}
     */
    static parseTransaction(rawTransaction) {
        let tx;
        try {
            tx = JSON.parse(Buffer.from(rawTransaction, 'hex').toString());
        } catch (e) {
            throw new TypeError(`The rawTransaction must be Transaction serialization hex string.`)
        }

        if (!tx.hasOwnProperty('msgType') || !tx.hasOwnProperty('signStr')) {
            throw new TypeError(`Deserialization transaction error.`)
        }

        let {msgType} = tx;
        let signStr = Buffer.from(tx.signStr, 'hex').toString();
        let signMsg = JSON.parse(signStr);
        let parse = parseMsgMapping[msgType];
        if (!parse) {
            throw new Error(`does not support transaction type: ${msgType}`);
        }
        let msg = parse(signMsg.msgs[0], msgType);
        let transaction = new Transaction(CHAINID_NETWORK_MAPPING[signMsg.chain_id]);
        transaction.type = msgType;
        transaction.sequence = Number(signMsg.sequence);
        transaction.account_number = Number(signMsg.account_number);
        transaction.msgs = msg ? [msg] : [];
        transaction.memo = signMsg.memo;
        transaction.signMsg = signMsg;
        return transaction;
    }
}

module.exports = RawTransaction;

