const txType = {
    MsgSend: "MsgSend",
    NewOrderMsg: "NewOrderMsg",
    CancelOrderMsg: "CancelOrderMsg",
    IssueMsg: "IssueMsg",
    BurnMsg: "BurnMsg",
    FreezeMsg: "FreezeMsg",
    UnfreezeMsg: "UnfreezeMsg",
    MintMsg: "MintMsg",
    ListMsg: "ListMsg",
    StdTx: "StdTx",
    PubKeySecp256k1: "PubKeySecp256k1",
    SignatureSecp256k1: "SignatureSecp256k1",
    MsgSubmitProposal: "MsgSubmitProposal",
    MsgDeposit: "MsgDeposit",
    MsgVote: "MsgVote"
};

const typePrefix = {
    MsgSend: "2A2C87FA",
    NewOrderMsg: "CE6DC043",
    CancelOrderMsg: "166E681B",
    IssueMsg: "17EFAB80",
    BurnMsg: "7ED2D2A0",
    FreezeMsg: "E774B32D",
    UnfreezeMsg: "6515FF0D",
    MintMsg: "467E0829",
    ListMsg: "B41DE13F",
    StdTx: "F0625DEE",
    PubKeySecp256k1: "EB5AE987",
    SignatureSecp256k1: "7FC4A495",
    MsgSubmitProposal: "B42D614E",
    MsgDeposit: "A18A56E5",
    MsgVote: "A1CADD36"
};

const NETWORK_CHAINID_MAPPING = {
    "testnet": "Binance-Chain-Nile",
    "mainnet": "Binance-Chain-Tigris"
};

const CHAINID_NETWORK_MAPPING = {
    "Binance-Chain-Nile": "testnet",
    "Binance-Chain-Tigris": "mainnet"
};

const TX_ACTIONS = {
    transfer: 'transfer',
    multiSend: 'multiSend',
    cancelOrder: 'cancelOrder',
    placeOrder: 'placeOrder',
    list: 'list',
    issue: 'issue',
    freeze: 'freeze',
    unfreeze: 'unfreeze',
    burn: 'burn',
    mint: 'mint'
};


const BASENUMBER = Math.pow(10, 8);

module.exports = {
    txType,
    typePrefix,
    NETWORK_CHAINID_MAPPING,
    CHAINID_NETWORK_MAPPING,
    BASENUMBER,
    TX_ACTIONS
};