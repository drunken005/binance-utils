 ## API
 ### Modules
 ##### [*utils*](https://github.com/binance-chain/javascript-sdk/wiki/API-Documentation#module_utils)
 ##### [*encoder*](https://github.com/binance-chain/javascript-sdk/wiki/API-Documentation#encode)
 ##### [*decoder*](https://github.com/binance-chain/javascript-sdk/wiki/API-Documentation#amino.module_decode)
 ##### [*crypto*](https://github.com/binance-chain/javascript-sdk/wiki/API-Documentation#module_crypto)


 ## Classes
 <dl>
 <dt><a href="#Transaction">Transaction</a></dt>
 <dd><p>Build an unsigned transaction object.</p>
 </dd>
 </dl>

 <dl>
 <dt><a href="#RawTransaction">RawTransaction</a></dt>
 <dd><p>Build an unsigned rawTransaction hex string.</p>
 </dd>
 </dl>

 <dl>
 <dt><a href="#BnbApi">BnbApi</a></dt>
 <dd><p>Create binance API server.</p>
 </dd>
 </dl>

 <dl>
 <dt><a href="#BnbRpc">BnbRpc</a></dt>
 <dd><p>The Binance Chain Node rpc client.</p>
 </dd>
 </dl>

 <dl>
 <dt><a href="#Wallet">Wallet</a></dt>
 <dd><p>Create or import BNB wallet.</p>
 </dd>
 </dl>

 <a name="Transaction"></a>
 ### Transaction
 Build an unsigned transaction object.
 * [Transaction](#Transaction)
     * [new Transaction(network)](#new_Transaction_new)
     * [.create()](#Transaction+create) ⇒ [<code>Transaction</code>](#Transaction)
     * [.transfer(fromAddress, toAddress, amount, asset, accountNumber, sequence, memo)](#Transaction+transfer) ⇒ [<code>Transaction</code>](#Transaction)
     * [.multiSend(fromAddress, outputs, accountNumber, sequence, memo)](#Transaction+multiSend) ⇒ [<code>Transaction</code>](#Transaction)
     * [.cancelOrder(fromAddress, symbol, refid, accountNumber, sequence)](#Transaction+cancelOrder) ⇒ [<code>Transaction</code>](#Transaction)
     * [.placeOrder(address, symbol, side, price, quantity, timeinforce, accountNumber, sequence)](#Transaction+placeOrder) ⇒ [<code>Transaction</code>](#Transaction)
     * [.list(address, proposalId, baseAsset, quoteAsset, initPrice, accountNumber, sequence)](#Transaction+list) ⇒ [<code>Transaction</code>](#Transaction)
     * [.issue(senderAddress, tokenName, symbol, totalSupply, mintable, accountNumber, sequence)](#Transaction+issue) ⇒ [<code>Transaction</code>](#Transaction)
     * [.freeze(fromAddress, symbol, amount, accountNumber, sequence) ](#Transaction+freeze) ⇒ [<code>Transaction</code>](#Transaction)
     * [.unfreeze(fromAddress, symbol, amount, accountNumber, sequence) ](#Transaction+unfreeze) ⇒ [<code>Transaction</code>](#Transaction)
     * [.burn(fromAddress, symbol, amount, accountNumber, sequence) ](#Transaction+burn) ⇒ [<code>Transaction</code>](#Transaction)
     * [.mint(fromAddress, symbol, amount, accountNumber, sequence) ](#Transaction+mint) ⇒ [<code>Transaction</code>](#Transaction)

     <a name="new_Transaction_new"></a>
     #### new Transaction(network)
     * ***network*** : Binance chain network, supported `'mainnet/testnet'`, default: `'mainnet'`  `<String>`

     <a name="Transaction+create"></a>
     ####  create() ⇒ [<code>Transaction</code>](#Transaction)
     create an unsigned transaction, the parameter list corresponds to the parameters of each transaction, e.g: `transfer、multiSend、placeOrder、cancelOrder、list、issue、freeze、unfreeze、burn、mint`
     eg:
     ```js
     const {Transaction} = require('binance-utils')
     const transaction = new Transaction('testnet');
     const tx = transaction.create('transfer', fromAddress, toAddress, amount, assert, accountNumber, sequence, memo);
     const multiTx = transaction.create('multiSend', fromAddress, outputs, accountNumber, sequence, memo);
     //and more...
     ```

     <a name="Transaction+transfer"></a>
     #### transfer(fromAddress, toAddress, amount, asset, accountNumber, sequence, memo) => [<code>Transaction</code>](#Transaction)
     Transfer tokens from one address to another.
     * ***fromAddress*** : from address `<String>`
     * ***toAddress*** : to address `<String>`
     * ***amount*** : Transfer amount `<Number>`
     * ***asset*** : asset `<Number>`
     * ***accountNumber*** : account number `<Number>`
     * ***sequence*** : sequence `<Number>`
     * ***memo*** : memo `<String>[optional]`

     <a name="Transaction+multiSend"></a>
     #### multiSend(fromAddress, outputs, accountNumber, sequence, memo) => [<code>Transaction</code>](#Transaction)
     Create a multi send tx
     * ***fromAddress*** : from address` <String>`
     * ***outputs*** : outputs `<Array>`
     * ***accountNumber*** : account number `<Number>`
     * ***sequence*** : sequence `<Number>`
     * ***memo*** : memo `<String>[optional]`
     eg:
     ```js
     const outputs = [
     {
       "to": "tbnb1p4kpnj5qz5spsaf0d2555h6ctngse0me5q57qe",
       "coins": [{
         "denom": "BNB",
         "amount": 10
       },{
         "denom": "BTC",
         "amount": 10
       }]
     },
     {
       "to": "tbnb1scjj8chhhp7lngdeflltzex22yaf9ep59ls4gk",
       "coins": [{
         "denom": "BTC",
         "amount": 10
       },{
         "denom": "BNB",
         "amount": 10
       }]
     }]
     ```

     <a name="Transaction+cancelOrder"></a>
     #### cancelOrder(fromAddress, symbol, refid, accountNumber, sequence) => [<code>Transaction</code>](#Transaction)
     * ***fromAddress*** : from address `<String>`
     * ***symbol*** : symbol the market pair `<String>`
     * ***refid*** : refid the order ID of the order to cancel `<String>`
     * ***accountNumber*** : account number `<Number>`
     * ***sequence*** : sequence `<Number>`

    <a name="Transaction+placeOrder"></a>
    #### placeOrder(address, symbol, side, price, quantity, timeinforce, accountNumber, sequence) => [<code>Transaction</code>](#Transaction)
    Place an order.
    * ***address*** : address `<String>`
    * ***symbol*** : symbol the market pair `<Number>`
    * ***side*** : side (1-Buy, 2-Sell) `<String>`
    * ***price*** : price `<Number>`
    * ***quantity*** : quantity `<Number>`
    * ***timeinforce*** : timeinforce (1-GTC(Good Till Expire), 3-IOC(Immediate or Cancel)) `<Number>`
    * ***accountNumber*** : account number `<Number>`
    * ***sequence*** : sequence `<Number>`

    <a name="Transaction+list"></a>
    #### list(address, proposalId, baseAsset, quoteAsset, initPrice, accountNumber, sequence) => [<code>Transaction</code>](#Transaction)
    Add a new trading pair
    * ***address*** : address `<String>`
    * ***proposalId*** : proposalId `<Number>`
    * ***baseAsset*** : baseAsset `<String>`
    * ***quoteAsset*** : quoteAsset `<String>`
    * ***initPrice*** : initPrice `<Number>`
    * ***accountNumber*** : account number `<Number>`
    * ***sequence*** : sequence `<Number>`

    <a name="Transaction+issue"></a>
    #### issue(senderAddress, tokenName, symbol, totalSupply, mintable, accountNumber, sequence) => [<code>Transaction</code>](#Transaction)
    Create a new asset Transaction on Binance Chain
    * ***senderAddress*** : sender address `<String>`
    * ***tokenName*** : token name `<String>`
    * ***symbol*** : symbol `<String>`
    * ***totalSupply*** : total supply `<Number>`
    * ***mintable*** : mintable `<Boolean>`
    * ***accountNumber*** : account number `<Number>`
    * ***sequence*** : sequence `<Number>`

    <a name="Transaction+freeze"></a>
    #### freeze(fromAddress, symbol, amount, accountNumber, sequence) => [<code>Transaction</code>](#Transaction)
    Freeze some amount of token
    * ***fromAddress*** : from address `<String>`
    * ***symbol*** : token name `<String>`
    * ***amount*** : amount `<String>`
    * ***accountNumber*** : account number `<Number>`
    * ***sequence*** : sequence `<Number>`

    <a name="Transaction+unfreeze"></a>
    #### unfreeze(fromAddress, symbol, amount, accountNumber, sequence) => [<code>Transaction</code>](#Transaction)
    Unfreeze some amount of token
    * ***fromAddress*** : from address `<String>`
    * ***symbol*** : token name `<String>`
    * ***amount*** : amount `<String>`
    * ***accountNumber*** : account number `<Number>`
    * ***sequence*** : sequence `<Number>`

    <a name="Transaction+burn"></a>
    #### burn(fromAddress, symbol, amount, accountNumber, sequence) => [<code>Transaction</code>](#Transaction)
    Burn some amount of token
    * ***fromAddress*** : from address `<String>`
    * ***symbol*** : token name `<String>`
    * ***amount*** : amount `<String>`
    * ***accountNumber*** : account number `<Number>`
    * ***sequence*** : sequence `<Number>`

    <a name="Transaction+mint"></a>
    #### mint(fromAddress, symbol, amount, accountNumber, sequence) => [<code>Transaction</code>](#Transaction)
    Mint tokens for an existing token
    * ***fromAddress*** : from address `<String>`
    * ***symbol*** : token name `<String>`
    * ***amount*** : amount `<String>`
    * ***accountNumber*** : account number `<Number>`
    * ***sequence*** : sequence `<Number>`

<a name="RawTransaction"></a>
### RawTransaction
Build an unsigned rawTransaction hex string
* [RawTransaction](#RawTransaction)
    * [new Transaction(network)](#new_RawTransaction_new)
    * [.create()](#RawTransaction+create) ⇒ `String`
    * [*static parseTransaction(rawTransaction)*](#RawTransaction+parseTransaction) ⇒ [<code>Transaction</code>](#Transaction)

    <a name="new_RawTransaction_new"></a>
    #### new RawTransaction(network)
    * ***network*** : Binance chain network, supported 'mainnet/testnet', default: 'mainnet'  `<String>`

    <a name="RawTransaction+create"></a>
    #### create() => `String`
    create an unsigned transaction hex string, the parameter list corresponds to the parameters of each transaction, e.g: `transfer、multiSend、placeOrder、cancelOrder、list、issue、freeze、unfreeze、burn、mint`
    eg:
    ```js
    const {RawTransaction} = require('binance-utils')
    const rawTransaction = new RawTransaction('testnet');
    const txStr = rawTransaction.create('transfer', fromAddress, toAddress, amount, assert, accountNumber, sequence, memo);
    const multiTxStr = rawTransaction.create('multiSend', fromAddress, outputs, accountNumber, sequence, memo);
    //and more...
    ```

    <a name="RawTransaction+parseTransaction"></a>
    #### static parseTransaction(rawTransaction) => [<code>Transaction</code>](#Transaction)
     Converts the rawTransaction string to Transaction
    * ***rawTransaction*** : unsigned transaction hex string `<String>`
    eg:
    ```js
    const {RawTransaction} = require('binance-utils')
    const rawTransaction = new RawTransaction('testnet');
    const txStr = rawTransaction.create('transfer', fromAddress, toAddress, amount, assert, accountNumber, sequence, memo);
    const transaction = RawTransaction.parseTransaction(txStr);
    ```

<a name="BnbApi"></a>
### BnbApi
Create binance API server
* [BnbApi](#BnbApi)
    * [new BnbApi(server)](#new_BnbApi_new)
    * [.broadcastTx(rawTransaction, sync)](#BnbApi+broadcastTx) ⇒ `Promise`
    * [.getAccount(address)](#BnbApi+getAccount) ⇒ `Promise`
    * [.getBalance(address)](#BnbApi+getBalance) ⇒ `Promise`
    * [.getMarkets(limit, offset)](#BnbApi+getMarkets) ⇒ `Promise`

    <a name="new_BnbApi_new"></a>
    #### new BnbApi(server)
    * ***server*** : Binance Chain public url `<String>`
    eg:
    ```js
    const {BnbApi} = require('binance-utils');
    const apiProvider = new BnbApi('http://localhost:8080');
    ```

     <a name="BnbApi+broadcastTx"></a>
    #### async broadcastTx(rawTransaction, sync) => `Promise`
    Broadcast a raw transaction to the blockchain.
    * ***rawTransaction*** : Signed and serialized raw transaction `<String>`
    * ***sync*** : Use synchronous mode, default true `<Boolean>`
    
    <a name="BnbApi+getAccount"></a>
    #### async getAccount(address) => `Promise`
    Get account
    * ***address*** : Address `<String>`

    <a name="BnbApi+getBalance"></a>
    #### async getBalance(address) => `Promise`
    Get account balances
    * ***address*** : Address `<String>`

    <a name="BnbApi+getMarkets"></a>
    #### async getMarkets(limit, offset) => `Promise`
     Get markets
    * ***limit*** : Max 1000 is default `<Number>`
    * ***offset*** : from beggining, default 0 `<Number>`

<a name="BnbRpc"></a>
### BnbRpc
The Binance Chain Node rpc client
* [BnbRpc](#BnbRpc)
    * [new BnbRpc(uriString, netWork)](#new_BnbRpc_new)
    * [.getTokenInfo(symbol)](#BnbRpc+getTokenInfo) ⇒ `Promise`
    * [.listAllTokens(offset, limit)](#BnbRpc+listAllTokens) ⇒ `Promise`
    * [.getAccount(address)](#BnbRpc+getAccount) ⇒ `Promise`
    * [.getBalances(address)](#BnbRpc+getBalances) ⇒ `Promise`
    * [.getBalance(address, symbol)](#BnbRpc+getBalance) ⇒ `Promise`
    * [.getOpenOrders(address, symbol)](#BnbRpc+getOpenOrders) ⇒ `Promise`
    * [.getTradingPairs(address, symbol)](#BnbRpc+getTradingPairs) ⇒ `Promise`
    * [.getDepth(tradePair)](#BnbRpc+getDepth) ⇒ `Promise`
    * [.status()](#BnbRpc+status) ⇒ `Promise`
    * [.tx({hash, prove})](#BnbRpc+tx) ⇒ `Promise`
    * [.block({height})](#BnbRpc+block) ⇒ `Promise`
    * [.broadcastTxSync({tx})](#BnbRpc+broadcastTxSync) ⇒ `Promise`
    
    
    <a name="new_BnbRpc_new"></a>
    #### new BnbRpc(uriString, netWork)
    * ***uriString*** : dataseed address `<String>`
    * ***network*** : Binance chain network, supported 'mainnet/testnet', default: 'mainnet' `<String>`
    eg:
    ```js
    const {BnbRpc} = require('binance-utils');
    const rpcProvider = new BnbApi('http://localhost:27146', 'testnet');
    ```
    
    <a name="BnbRpc+getTokenInfo"></a>
    #### async getTokenInfo(symbol) => `Promise`
    Get token info
    * ***symbol*** : symbol `<String>`

   <a name="BnbRpc+listAllTokens"></a>
   #### async listAllTokens(offset, limit) => `Promise`
    Get tokens by offset and limit
    * ***offset*** : offset `<Number>`
    * ***limit*** : limit `<Number>`

    <a name="BnbRpc+getAccount"></a>
    #### async getAccount(address) => `Promise`
    Get account
    * ***address*** : address `<String>`

    <a name="BnbRpc+getBalances"></a>
    #### async getBalances(address) => `Promise`
    Get account balances
    * ***address*** : address `<String>`

    <a name="BnbRpc+getBalance"></a>
    #### async getBalance(address, symbol) => `Promise`
    Get balance by symbol and address
    * ***address*** : address `<String>`
    * ***symbol*** : symbol `<String>`

    <a name="BnbRpc+getOpenOrders"></a>
    #### async getOpenOrders(address, symbol) => `Promise`
    Get open orders info
    * ***address*** : address `<String>`
    * ***symbol*** : symbol `<String>`

    <a name="BnbRpc+getTradingPairs"></a>
    #### async getTradingPairs(offset, limit) => `Promise`
    Get trading pairs info
    * ***offset*** : offset `<Number>`
    * ***limit*** : limit `<Number>`

    <a name="BnbRpc+getDepth"></a>
    #### async getDepth(tradePair) => `Promise`
    Get depath
    * ***tradePair*** : tradePair `<String>`

    <a name="BnbRpc+status"></a>
    #### async status() => `Promise`
    Get fullnode status and block info

    <a name="BnbRpc+tx"></a>
    #### async tx({hash, prove}) => `Promise`
    Get transaction by hash
    * ***hash*** : transaction hash `<Buffer>`
    * ***prove*** : `Include a proof of the transaction inclusion in the block, default false `<Boolean>`

    <a name="BnbRpc+block"></a>
    #### async block({height}) => `Promise`
    Get block at a given height. If no height is provided, it will fetch the latest block.
    * ***height*** : block height `<Number>`

    <a name="BnbRpc+broadcastTxSync"></a>
    #### broadcastTxSync({tx})
    The transaction will be broadcasted and returns with the response from CheckTx.
    * ***tx*** : signed raw transaction info bytes in hex `<Buffer>`

<a name="Wallet"></a>
### Wallet
Create or import BNB wallet
* [Wallet](#Wallet)
    * [new Wallet(privateKey, network)](#new_Wallet_new)
    * [.exportKeystore(password)](#Wallet+exportKeystore) ⇒ `Object`
    * [.serializePubKey(password)](#Wallet+serializePubKey) ⇒ `Buffer`
    * [.sign(transaction)](#Wallet+sign) ⇒ `String`
    * [.export(password)](#Wallet+export) ⇒ `Object`
    * [*static createMnemonicWallet(mnemonic, network)*](#Wallet+createMnemonicWallet) ⇒ [<code>Wallet</code>](#Wallet)
    * [*static importKeystoreWallet(keystore, password, network)*](#Wallet+importKeystoreWallet) ⇒ [<code>Wallet</code>](#Wallet)
    * [*static checkAddress(address, network)*](#Wallet+checkAddress) ⇒ `Boolean`
    * [*static verifySignature(sigHex, signBytesHex, publicKeyHex)*](#Wallet+verifySignature) ⇒ `Boolean`

    <a name="new_Wallet_new"></a>
    #### new Wallet(privateKey, network) => `Wallet`
    * ***privateKey*** : private key，if the private key is empty, a new private key will be produced. `<String>`
    * ***network*** :  Binance chain network, supported 'mainnet/testnet', default: 'mainnet' `<String>`
    eg:
    ```js
    const {Wallet} = require('binance-utils');
    // If the private key is empty, a new private key will be produced.
    const wallet = new Wallet('private key', 'testnet');
    ```

    <a name="Wallet+exportKeystore"></a>
    #### exportKeystore(password) => `Object`
    Export current privateKey keystore object, and returns the private key and address.
    * ***password*** :  The keystore object password. `<String>`
    eg:
    ```js
    const keystore = wallet.exportKeystore('password');
    ```

    <a name="Wallet+serializePubKey"></a>
    #### serializePubKey() => `Buffer`
    Serializes current wallet public key in a 33-byte compressed format.
    eg:
    ```js
    const pubKey = wallet.serializePubKey();
    ```

    <a name="Wallet+sign"></a>
    #### sign(transaction) => `String`
    Generates a signature (64 byte <r,s>) for a transaction based on current wallet privateKey
    * ***transaction*** : Unsigned transaction sign bytes hexstring or [<code>Transaction</code>](#Transaction). `<String|Transaction>`
    eg:
    ```js
    const rawTransaction = rawTransaction.create('transfer', fromAddress, toAddress, amount, assert, account_number, sequence, memo);
    const transaction = RawTransaction.parseTransaction(rawTransaction);
    const signature = wallet.sign(transaction.signMsgHex);
    ```

    <a name="Wallet+export"></a>
    #### export() => `Object`
    Export wallet account info
    eg:
    ```js
    const pubKey = wallet.serializePubKey();
    ```

     <a name="Wallet+createMnemonicWallet"></a>
    #### static createMnemonicWallet(mnemonic, network) => [<code>Wallet</code>](#Wallet)
     Create or import mnemonic HD wallet
    * ***mnemonic*** : The mnemonic phrase words. `<String>`
    * ***network*** : Binance chain network, supported 'mainnet/testnet', default: 'mainnet'. `<String>`
    eg:
    ```js
    const mnemonicHDWallet = Wallet.createMnemonicWallet('mnemonic...', 'testnet');
    ```

    <a name="Wallet+importKeystoreWallet"></a>
    #### static importKeystoreWallet(keystore, password, network) => [<code>Wallet</code>](#Wallet)
    Import keystore object wallet
    * ***keystore*** : keystore Keystore object. `<Json Object>`
    * ***password*** : password `<String>`
    * ***network*** : Binance chain network, supported 'mainnet/testnet', default: 'mainnet'. `<String>`
    eg:
    ```js
    const mnemonicHDWallet = Wallet.importKeystoreWallet(keystore, 'password', 'testnet');
    ```

    <a name="Wallet+checkAddress"></a>
    #### static checkAddress(address, network) => `Boolean`
    Checks whether an address is valid.
    * ***address*** : address. `<String>`
    * ***network*** : Binance chain network, supported 'mainnet/testnet', default: 'mainnet'. `<String>`
    eg:
    ```js
    const mnemonicHDWallet = Wallet.checkAddress('tbnb1fu029wlrx87pdxecqrw96a662v6cdrj5zsv5rd', 'testnet');
    ```
    
    <a name="Wallet+verifySignature"></a>
    #### static verifySignature(sigHex, signBytesHex, publicKeyHex) => `Boolean`
    Verifies a signature (64 byte <r,s>) given the sign bytes and public key.
    * ***sigHex*** : The signature hexstring. `<String>`
    * ***signBytesHex*** : Unsigned transaction sign bytes hexstring. `<String>`
    * ***publicKeyHex*** : The public key.`<String>`
    eg:
    ```js
    const rawTransaction = rawTransaction.create('transfer', fromAddress, toAddress, amount, assert, account_number, sequence, memo);
    const transaction = RawTransaction.parseTransaction(rawTransaction);
    const signature = wallet.sign(transaction.signMsgHex);
    const verify= Wallet.verifySignature(signature, transaction.signMsgHex, wallet.export().publicKey);
    // verify = true
    ```