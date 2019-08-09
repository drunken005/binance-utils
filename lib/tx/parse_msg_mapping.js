const crypto = require("../crypto");
const Big = require("big.js");
const {txType} = require('../common');

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

const parseListMsg = (msg, msgType) => {
    return {
        from: crypto.decodeAddress(msg.from),
        proposal_id: msg.proposal_id,
        base_asset_symbol: msg.baseAsset,
        quote_asset_symbol: msg.quoteAsset,
        init_price: msg.init_price,
        msgType
    }
};

const parsePlaceOrderMsg = (msg, msgType) => {
    return {
        sender: crypto.decodeAddress(msg.sender),
        id: msg.id,
        symbol: msg.symbol,
        ordertype: msg.orderType,
        side: msg.side,
        price: msg.price,
        quantity: msg.quantity,
        timeinforce: msg.timeinforce,
        msgType,
    }
};

const parseCancelOrderMsg = (msg, msgType) => {
    return {
        sender: crypto.decodeAddress(msg.sender),
        symbol: msg.symbol,
        refid: msg.refid,
        msgType
    };
};

const parseSendMsg = (msg) => {
    let inputs = [], outputs = [];
    msg.inputs.forEach(({address, coins}) => {
        inputs.push({address: crypto.decodeAddress(address), coins: []});
        calInputCoins(inputs, coins);

    });
    msg.outputs.forEach(({address, coins}, index) => {
        outputs.push({address: crypto.decodeAddress(address), coins: []});

        coins.forEach((coin) => {
            const existCoin = outputs[index].coins.find(c => c.denom === coin.denom);
            if (existCoin) {
                const existAmount = new Big(existCoin.amount);
                existCoin.amount = Number(existAmount.plus(coin.amount).toString())
            } else {
                outputs[index].coins.push({denom: coin.denom, amount: coin.amount})
            }
        })
    });

    return {inputs, outputs, msgType: txType.MsgSend}
};

const parseIssueMsg = (msg, msgType) => {
    return {
        from: crypto.decodeAddress(msg.from),
        name: msg.name,
        symbol: msg.symbol,
        total_supply: msg.total_supply,
        mintable: msg.mintable,
        msgType
    }
};

const parseFreezeMsg = (msg, msgType) => {
    return {
        from: crypto.decodeAddress(msg.from),
        symbol: msg.symbol,
        amount: msg.amount,
        msgType
    };
};


const parseUnfreezeMsg = (msg, msgType) => {
    return {
        from: crypto.decodeAddress(msg.from),
        symbol: msg.symbol,
        amount: msg.amount,
        msgType
    }
};

const parseBurnMsg = (msg, msgType) => {
    return {
        from: crypto.decodeAddress(msg.from),
        symbol: msg.symbol,
        amount: msg.amount,
        msgType
    }
};

const parseMintMsg = (msg, msgType) => {
    return {
        from: crypto.decodeAddress(msg.from),
        symbol: msg.symbol,
        amount: msg.amount,
        msgType
    }
};

let parseMsgMapping = {
    MsgSend: parseSendMsg,
    ListMsg: parseListMsg,
    CancelOrderMsg: parseCancelOrderMsg,
    NewOrderMsg: parsePlaceOrderMsg,
    IssueMsg: parseIssueMsg,
    FreezeMsg: parseFreezeMsg,
    UnfreezeMsg: parseUnfreezeMsg,
    BurnMsg: parseBurnMsg,
    MintMsg: parseMintMsg
};


module.exports = parseMsgMapping;