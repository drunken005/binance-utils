const {txType, NETWORK_CHAINID_MAPPING, BASENUMBER, TX_ACTIONS} = require('../common');
const {checkNumber, validateSymbol} = require("../utils/validateHelper");
const crypto = require("../crypto");
const encoder = require("../encoder");
const BnbWallet = require('../wallet/wallet');
const Big = require("big.js");

const MAXTOTALSUPPLY = 9000000000000000000;


/**
 * sum corresponding input coin
 * @param {Array} inputs
 * @param {Array} coins
 */
const calInputCoins = (inputs, coins) => {
    coins.forEach((coin) => {
        const existCoin = inputs[0].coins.find(c => c.denom === coin.denom);
        if (existCoin) {
            const existAmount = new Big(existCoin.amount);
            existCoin.amount = Number(existAmount.plus(coin.amount).toString())
        } else {
            inputs[0].coins.push({denom: coin.denom, amount: coin.amount})
        }
    })
};

/**
 * validate the input number.
 * @param {Array} outputs
 */
const checkOutputs = (outputs) => {
    outputs.forEach(transfer => {
        const coins = transfer.coins || [];
        coins.forEach(coin => {
            checkNumber(coin.amount);
            if (!coin.denom) {
                throw new Error("invalid denmon")
            }
        })
    })
};

/**
 * Construct Transaction Object
 */
class Transaction {

    /**
     * Building Transaction
     * @param network Network default 'mainnet'
     */
    constructor(network) {
        this.network = network || 'mainnet';
        this.chain_id = NETWORK_CHAINID_MAPPING[this.network];
    }

    /**
     * Create Transaction, the parameter list corresponds to the parameters of each transaction, eg. transfer、multiSend、cancelOrder、list and more
     * @example
     * const transaction = new Transaction('testnet');
     * const tx = transaction.create('transfer', fromAddress, toAddress, amount, assert, account_number, sequence, memo);
     * @returns {Transaction} Transaction
     */
    create() {
        let args = Array.prototype.slice.apply(arguments);
        let _method = TX_ACTIONS[args[0]];
        if (!_method) {
            throw new Error("Transaction type not supported!")
        }
        args = args.slice(1);
        return this[_method].call(this, ...args)
    }

    /**
     * Construct an unsigned transaction
     * @param msg The msg object
     * @param stdSignMsg The sign doc object used to generate a signature
     * @param account_number
     * @param sequence
     * @param memo
     * @returns {Transaction} unsigned transaction
     * @private
     */
    _prepareTransaction(msg, stdSignMsg, account_number, sequence, memo) {
        if (sequence === '' || sequence === null || sequence === undefined) {
            throw new Error('sequence is null');
        }
        if (!account_number) {
            throw new Error('account_number is null');
        }
        this.type = msg.msgType;
        this.sequence = sequence;
        this.account_number = account_number;
        this.msgs = msg ? [msg] : [];
        this.memo = memo;
        this.signMsg = {
            account_number: account_number.toString(),
            chain_id: this.chain_id,
            data: null,
            memo: memo || '',
            msgs: [stdSignMsg],
            sequence: sequence.toString(),
            source: "1"
        };
        return this;
    }

    /**
     * Transfer tokens from one address to another.
     * @param {String} fromAddress
     * @param {String} toAddress
     * @param {Number} amount
     * @param {String} asset
     * @param {Number} account_number  account_number
     * @param {Number} sequence  sequence
     * @param {String} memo optional memo
     * @return {Transaction}
     */
    transfer(fromAddress, toAddress, amount, asset, account_number, sequence, memo) {
        const accCode = crypto.decodeAddress(fromAddress);
        const toAccCode = crypto.decodeAddress(toAddress);

        amount = new Big(amount);
        amount = Number(amount.mul(BASENUMBER).toString());

        checkNumber(amount, "amount");

        const coin = {
            denom: asset,
            amount: amount,
        };

        const msg = {
            inputs: [{
                address: accCode,
                coins: [coin]
            }],
            outputs: [{
                address: toAccCode,
                coins: [coin]
            }],
            msgType: "MsgSend"
        };

        const signMsg = {
            inputs: [{
                address: fromAddress,
                coins: [{
                    amount: amount,
                    denom: asset
                }]
            }],
            outputs: [{
                address: toAddress,
                coins: [{
                    amount: amount,
                    denom: asset
                }]
            }]
        };

        return this._prepareTransaction(msg, signMsg, account_number, sequence, memo)

    }

    /**
     * Create a multi send tx
     * @param {String} fromAddress
     * @param {Array} outputs
     * @example
     * const outputs = [
     * {
     *   "to": "tbnb1p4kpnj5qz5spsaf0d2555h6ctngse0me5q57qe",
     *   "coins": [{
     *     "denom": "BNB",
     *     "amount": 10
     *   },{
     *     "denom": "BTC",
     *     "amount": 10
     *   }]
     * },
     * {
     *   "to": "tbnb1scjj8chhhp7lngdeflltzex22yaf9ep59ls4gk",
     *   "coins": [{
     *     "denom": "BTC",
     *     "amount": 10
     *   },{
     *     "denom": "BNB",
     *     "amount": 10
     *   }]
     * }]
     * @param {Number} account_number  account_number
     * @param {Number} sequence  sequence
     * @param {String} memo optional memo
     * @return {Transaction}
     */
    multiSend(fromAddress, outputs, account_number, sequence, memo) {
        if (!fromAddress) {
            throw new Error("fromAddress should not be falsy")
        }

        if (!Array.isArray(outputs)) {
            throw new Error("outputs should be array")
        }

        checkOutputs(outputs);

        //sort denom by alphbet and init amount
        outputs.forEach(item => {
            item.coins = item.coins.sort((a, b) => a.denom.localeCompare(b.denom));
            item.coins.forEach(coin => {
                const amount = new Big(coin.amount);
                coin.amount = Number(amount.mul(BASENUMBER).toString())
            })
        });

        const fromAddrCode = crypto.decodeAddress(fromAddress);
        const inputs = [{address: fromAddrCode, coins: []}];
        const transfers = [];

        outputs.forEach((item) => {
            const toAddcCode = crypto.decodeAddress(item.to);
            calInputCoins(inputs, item.coins);
            transfers.push({address: toAddcCode, coins: item.coins})
        });


        const msg = {
            inputs,
            outputs: transfers,
            msgType: "MsgSend"
        };

        const signInputs = [{address: fromAddress, coins: []}];
        const signOutputs = [];

        outputs.forEach((item, index) => {
            signOutputs.push({address: item.to, coins: []});
            item.coins.forEach(c => {
                signOutputs[index].coins.push(c)
            });
            calInputCoins(signInputs, item.coins)
        });
        const signMsg = {
            inputs: signInputs,
            outputs: signOutputs
        };
        return this._prepareTransaction(msg, signMsg, account_number, sequence, memo)
    }

    /**
     * Cancel an order.
     * @param {String} fromAddress
     * @param {String} symbol the market pair
     * @param {String} refid the order ID of the order to cancel
     * @param {Number} account_number account_number
     * @param {Number} sequence sequence
     * @return {Transaction}
     */
    cancelOrder(fromAddress, symbol, refid, account_number, sequence) {
        const accCode = crypto.decodeAddress(fromAddress);
        const msg = {
            sender: accCode,
            symbol: symbol,
            refid: refid,
            msgType: "CancelOrderMsg"
        };

        const signMsg = {
            refid: refid,
            sender: fromAddress,
            symbol: symbol
        };
        return this._prepareTransaction(msg, signMsg, account_number, sequence)
    }

    /**
     * Place an order.
     * @param {String} address
     * @param {String} symbol the market pair
     * @param {Number} side (1-Buy, 2-Sell)
     * @param {Number} price
     * @param {Number} quantity
     * @param {Number} timeinforce (1-GTC(Good Till Expire), 3-IOC(Immediate or Cancel))
     * @param {Number} account_number account_number
     * @param {Number} sequence  sequence
     * @return {Transaction}
     */
    placeOrder(address, symbol, side, price, quantity, timeinforce, account_number, sequence) {
        timeinforce = timeinforce || 1;
        if (!address) {
            throw new Error("address should not be falsy")
        }
        if (!symbol) {
            throw new Error("symbol should not be falsy")
        }
        if (side !== 1 && side !== 2) {
            throw new Error("side can only be 1 or 2")
        }
        if (timeinforce !== 1 && timeinforce !== 3) {
            throw new Error("timeinforce can only be 1 or 3")
        }

        const accCode = crypto.decodeAddress(address);

        const bigPrice = new Big(price);
        const bigQuantity = new Big(quantity);


        const placeOrderMsg = {
            sender: accCode,
            id: `${accCode.toString("hex")}-${sequence + 1}`.toUpperCase(),
            symbol: symbol,
            ordertype: 2,
            side,
            price: parseFloat(bigPrice.mul(BASENUMBER).toString(), 10),
            quantity: parseFloat(bigQuantity.mul(BASENUMBER).toString(), 10),
            timeinforce: timeinforce,
            msgType: "NewOrderMsg",
        };

        const signMsg = {
            id: placeOrderMsg.id,
            ordertype: placeOrderMsg.ordertype,
            price: placeOrderMsg.price,
            quantity: placeOrderMsg.quantity,
            sender: address,
            side: placeOrderMsg.side,
            symbol: placeOrderMsg.symbol,
            timeinforce: timeinforce,
        };

        checkNumber(signMsg.price, "price");
        checkNumber(signMsg.quantity, "quantity");

        return this._prepareTransaction(placeOrderMsg, signMsg, account_number, sequence)
    }


    /**
     * @param {String} address
     * @param {Number} proposalId
     * @param {String} baseAsset
     * @param {String} quoteAsset
     * @param {Number} initPrice
     * @param {Number} account_number account_number
     * @param {Number} sequence sequence
     * @return {Transaction}
     */
    list(address, proposalId, baseAsset, quoteAsset, initPrice, account_number, sequence) {
        const accCode = crypto.decodeAddress(address);
        if (!address) {
            throw new Error("address should not be falsy")
        }

        if (proposalId <= 0) {
            throw new Error("proposal id should larger than 0")
        }

        if (initPrice <= 0) {
            throw new Error("price should larger than 0")
        }

        if (!baseAsset) {
            throw new Error("baseAsset should not be falsy")
        }

        if (!quoteAsset) {
            throw new Error("quoteAsset should not be falsy")
        }

        const init_price = Number(new Big(initPrice).mul(BASENUMBER).toString());


        const listMsg = {
            from: accCode,
            proposal_id: proposalId,
            base_asset_symbol: baseAsset,
            quote_asset_symbol: quoteAsset,
            init_price: init_price,
            msgType: "ListMsg"
        };

        const signMsg = {
            base_asset_symbol: baseAsset,
            from: address,
            init_price: init_price,
            proposal_id: proposalId,
            quote_asset_symbol: quoteAsset,
        };

        return this._prepareTransaction(listMsg, signMsg, account_number, sequence)
    }


    /**
     * create a new asset Transaction on Binance Chain
     * @param senderAddress
     * @param tokenName
     * @param symbol
     * @param totalSupply
     * @param mintable
     * @param account_number
     * @param sequence
     * @returns {Transaction}
     */
    issue(senderAddress, tokenName, symbol, totalSupply = 0, mintable = false, account_number, sequence) {
        if (!senderAddress) {
            throw new Error("sender address cannot be empty")
        }

        if (tokenName.length > 32) {
            throw new Error("token name is limited to 32 characters")
        }

        if (!/^[a-zA-z\d]{3,8}$/.test(symbol)) {
            throw new Error("symbol should be alphanumeric and length is limited to 3~8")
        }

        if (totalSupply <= 0 || totalSupply > MAXTOTALSUPPLY) {
            throw new Error("invalid supply amount")
        }

        totalSupply = new Big(totalSupply);
        totalSupply = Number(totalSupply.mul(Math.pow(10, 8)).toString());

        const issueMsg = {
            from: crypto.decodeAddress(senderAddress),
            name: tokenName,
            symbol,
            total_supply: totalSupply,
            mintable,
            msgType: txType.IssueMsg
        };

        const signIssueMsg = {
            from: senderAddress,
            name: tokenName,
            symbol,
            total_supply: totalSupply,
            mintable,
        };


        return this._prepareTransaction(issueMsg, signIssueMsg, account_number, sequence);
    }

    /**
     * Freeze some amount of token
     * @param fromAddress
     * @param symbol
     * @param amount
     * @param account_number
     * @param sequence
     * @returns {Transaction}
     */
    freeze(fromAddress, symbol, amount, account_number, sequence) {

        validateSymbol(symbol);

        amount = new Big(amount);
        amount = Number(amount.mul(Math.pow(10, 8)).toString());

        const freezeMsg = {
            from: crypto.decodeAddress(fromAddress),
            symbol,
            amount,
            msgType: txType.FreezeMsg
        };

        const freezeSignMsg = {
            amount: amount,
            from: fromAddress,
            symbol
        };

        return this._prepareTransaction(freezeMsg, freezeSignMsg, account_number, sequence);
    }

    /**
     * Unfreeze some amount of token
     * @param fromAddress
     * @param symbol
     * @param amount
     * @param account_number
     * @param sequence
     * @returns {Transaction}
     */
    unfreeze(fromAddress, symbol, amount, account_number, sequence) {
        validateSymbol(symbol);


        amount = new Big(amount);
        amount = Number(amount.mul(Math.pow(10, 8)).toString());

        const unfreezeMsg = {
            from: crypto.decodeAddress(fromAddress),
            symbol,
            amount,
            msgType: txType.UnfreezeMsg
        };

        const unfreezeSignMsg = {
            amount: amount,
            from: fromAddress,
            symbol
        };

        return this._prepareTransaction(unfreezeMsg, unfreezeSignMsg, account_number, sequence);
    }

    /**
     * Burn some amount of token
     * @param fromAddress
     * @param symbol
     * @param amount
     * @param account_number
     * @param sequence
     * @returns {Transaction}
     */
    burn(fromAddress, symbol, amount, account_number, sequence) {
        validateSymbol(symbol);

        amount = new Big(amount);
        amount = Number(amount.mul(Math.pow(10, 8)).toString());

        const burnMsg = {
            from: crypto.decodeAddress(fromAddress),
            symbol,
            amount,
            msgType: txType.BurnMsg
        };

        const burnSignMsg = {
            amount: amount,
            from: fromAddress,
            symbol
        };

        return this._prepareTransaction(burnMsg, burnSignMsg, account_number, sequence)
    }

    /**
     * Mint tokens for an existing token
     * @param fromAddress
     * @param symbol
     * @param amount
     * @param account_number
     * @param sequence
     * @returns {Transaction}
     */
    mint(fromAddress, symbol, amount, account_number, sequence) {
        validateSymbol(symbol);

        if (amount <= 0 || amount > MAXTOTALSUPPLY) {
            throw new Error("invalid amount")
        }

        amount = new Big(amount);
        amount = Number(amount.mul(Math.pow(10, 8)).toString());

        const mintMsg = {
            from: crypto.decodeAddress(fromAddress),
            symbol,
            amount,
            msgType: txType.MintMsg
        };

        const mintSignMsg = {
            amount: amount,
            from: fromAddress,
            symbol
        };

        return this._prepareTransaction(mintMsg, mintSignMsg, account_number, sequence);
    }


    /**
     * Serialize the original transaction object
     * @returns {string}
     */
    serializeRawData() {
        const signBytes = encoder.convertObjectToSignBytes(this.signMsg);
        let std = {
            msgType: this.type,
            rawTransaction: signBytes.toString('hex')
        };

        return Buffer.from(JSON.stringify(std)).toString('hex');
    }

    /**
     * Sign the transaction offline
     * @param privateKey  Sign account private key
     * @param transaction  Transaction
     * @param network Network default 'mainnet'
     * @returns {string} Signed transaction hex string
     */
    static sign(privateKey, transaction, network) {
        let wallet = new BnbWallet(privateKey, network);
        const signBytes = encoder.convertObjectToSignBytes(transaction.signMsg);

        const signature = wallet.sign(signBytes.toString("hex"));
        let pubKey = wallet.serializePubKey();

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

}

module.exports = Transaction;