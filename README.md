# binance-utils

Rewrite signatures and build transactions according to [@binance-chain/javascript-sdk](https://github.com/binance-chain/javascript-sdk) to make them build, sign, and separate broadcast transactions

## Install and import

```bash
>$ npm i binance-utils --save
```
```js
const Binance = require('binance-utils');
or
import Binance from 'binance-utils';
```

## API
### Modules
##### [*utils*](https://github.com/binance-chain/javascript-sdk/wiki/API-Documentation#module_utils)
##### [*encoder*](https://github.com/binance-chain/javascript-sdk/wiki/API-Documentation#encode)
##### [*decoder*](https://github.com/binance-chain/javascript-sdk/wiki/API-Documentation#amino.module_decode)
##### [*crypto*](https://github.com/binance-chain/javascript-sdk/wiki/API-Documentation#module_crypto)


### Classes
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
##### Transaction
Build an unsigned transaction object.
* [Transaction](#Transaction)
    * [new Transaction(network)](#new_Transaction_new)
    * [.create()](#Transaction+create) ⇒ `Transaction`
    * [.serializeRawData()](#Transaction+serializeRawData) ⇒ `String`
    * [*static sign(privateKey, transaction, network)*](#Transaction+sign) ⇒ <code>String</code>
    * [.transfer(fromAddress, toAddress, amount, asset, accountNumber, sequence, memo)](#Transaction+transfer) ⇒ [<code>Transaction</code>](#Transaction)
    * [.multiSend(fromAddress, outputs, accountNumber, sequence, memo)](#Transaction+multiSend) ⇒ [<code>Transaction</code>](#Transaction)

<a name="new_Transaction_new"></a>
* **new Transaction(network)**;
    * **params**
    *network* : `Binance chain network, supported 'mainnet/testnet', default: 'mainnet'  <String>`

<a name="Transaction+create"></a>
* **create() =>** `Transaction`
create an unsigned transaction, the parameter list corresponds to the parameters of each transaction, e.g: `transfer、multiSend、placeOrder、cancelOrder、list、issue、freeze、unfreeze、burn、mint`
    Example

    ```js
    const {Transaction} = require('binance-utils')
    const transaction = new Transaction('testnet');
    const tx = transaction.create('transfer', fromAddress, toAddress, amount, assert, accountNumber, sequence, memo);
    const multiTx = transaction.create('multiSend', fromAddress, outputs, accountNumber, sequence, memo);
    //and more...
    ```
    
<a name="Transaction+serializeRawData"></a>
* **serializeRawData()** => `String`
Serialize the original transaction object
Example
    ```js
    const {Transaction} = require('binance-utils')
    const transaction = new Transaction('testnet');
    const multiTx = transaction.create('multiSend', fromAddress, outputs, accountNumber, sequence, memo);
    const hexString = multiTx.serializeRawData();
    ```

<a name="Transaction+sign"></a>
* **static sign(privateKey, transaction, network)**  => `String`
Sign the transaction offline
    * **params**
    *privateKey* : `Sign account private key  <String>`
    *transaction* : `Build Transaction instance  <Object>`
    *network* : `Binance chain network, default 'mainnet'  <String>`
Example
    ```js
    const {Transaction} = require('binance-utils')
    const transaction = new Transaction('testnet');
    const tx = transaction.create('placeOrder', address, symbol, side, price, quantity, timeinforce, accountNumber, sequence);
    // `signedHexString` can directly call the broadcast transaction interface and send it to the blockchain
    const signedHexString = Transaction.sign('private key', tx, 'testnet');
    ```

<a name="Transaction+transfer"></a>
* **transfer(fromAddress, toAddress, amount, asset, accountNumber, sequence, memo)** => `Transaction`
Transfer tokens from one address to another.
    * **params**
    *fromAddress* : `from address <String>`
    *toAddress* : `to address <String>`
    *amount* : `Transfer amount <Number>`
    *asset* : `asset <Number>`
    *accountNumber* : `account number <Number>`
    *sequence* : `sequence <Number>`
    *memo* : `memo <String>[optional]`

<a name="Transaction+multiSend"></a>
* **multiSend(fromAddress, outputs, accountNumber, sequence, memo)** => `Transaction`
Create a multi send tx
    * **params**
    *fromAddress* : `from address <String>`
    *outputs* : `outputs <Array>`
    *accountNumber* : `account number <Number>`
    *sequence* : `sequence <Number>`
    *memo* : `memo <String>[optional]`
Example
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
* **cancelOrder(fromAddress, symbol, refid, accountNumber, sequence)** => `Transaction`
Cancel an order.
    * **params**
    *fromAddress* : `from address <String>`
    *symbol* : `symbol the market pair <String>`
    *refid* : `refid the order ID of the order to cancel <String>`
    *accountNumber* : `account number <Number>`
    *sequence* : `sequence <Number>`

<a name="Transaction+placeOrder"></a>
* **placeOrder(address, symbol, side, price, quantity, timeinforce, accountNumber, sequence)** => `Transaction`
Place an order.
    * **params**
    *address* : `address <String>`
    *symbol* : `symbol the market pair <Number>`
    *side* : `side (1-Buy, 2-Sell) <String>`
    *price* : `price <Number>`
    *quantity* : `quantity <Number>`
    *timeinforce* : `timeinforce (1-GTC(Good Till Expire), 3-IOC(Immediate or Cancel)) <Number>`
    *accountNumber* : `account number <Number>`
    *sequence* : `sequence <Number>`

<a name="Transaction+list"></a>
* **list(address, proposalId, baseAsset, quoteAsset, initPrice, accountNumber, sequence)** => `Transaction`
Add a new trading pair
    * **params**
    *address* : `address <String>`
    *proposalId* : `proposalId <Number>`
    *baseAsset* : `baseAsset <String>`
    *quoteAsset* : `quoteAsset <String>`
    *initPrice* : `initPrice <Number>`
    *accountNumber* : `account number <Number>`
    *sequence* : `sequence <Number>`

<a name="Transaction+issue"></a>
* **issue(senderAddress, tokenName, symbol, totalSupply, mintable, accountNumber, sequence)** => `Transaction`
Create a new asset Transaction on Binance Chain
    * **params**
    *senderAddress* : `sender address <String>`
    *tokenName* : `token name <String>`
    *symbol* : `symbol <String>`
    *totalSupply* : `total supply <Number>`
    *mintable* : `mintable <Boolean>`
    *accountNumber* : `account number <Number>`
    *sequence* : `sequence <Number>`

<a name="Transaction+freeze"></a>
* **freeze(fromAddress, symbol, amount, accountNumber, sequence)** => `Transaction`
Freeze some amount of token
    * **params**
    *fromAddress* : `from address <String>`
    *symbol* : `token name <String>`
    *amount* : `amount <String>`
    *accountNumber* : `account number <Number>`
    *sequence* : `sequence <Number>`

<a name="Transaction+unfreeze"></a>
* **unfreeze(fromAddress, symbol, amount, accountNumber, sequence)** => `Transaction`
Unfreeze some amount of token
  * **params**
    *fromAddress* : `from address <String>`
    *symbol* : `token name <String>`
    *amount* : `amount <String>`
    *accountNumber* : `account number <Number>`
    *sequence* : `sequence <Number>`

<a name="Transaction+burn"></a>
* **burn(fromAddress, symbol, amount, accountNumber, sequence)** => `Transaction`
Burn some amount of token
    * **params**
    *fromAddress* : `from address <String>`
    *symbol* : `token name <String>`
    *amount* : `amount <String>`
    *accountNumber* : `account number <Number>`
    *sequence* : `sequence <Number>`

<a name="Transaction+mint"></a>
* **mint(fromAddress, symbol, amount, accountNumber, sequence)** => `Transaction`
Mint tokens for an existing token
    * **params**
    *fromAddress* : `from address <String>`
    *symbol* : `token name <String>`
    *amount* : `amount <String>`
    *accountNumber* : `account number <Number>`
    *sequence* : `sequence <Number>`


##### RawTransaction
Build an unsigned rawTransaction hex string
* **new RawTransaction(network)**
    * **params**
    *network* : `Binance chain network, supported 'mainnet/testnet', default: 'mainnet'  <String>`

* **create() =>** `String`
create an unsigned transaction hex string, the parameter list corresponds to the parameters of each transaction, e.g: `transfer、multiSend、placeOrder、cancelOrder、list、issue、freeze、unfreeze、burn、mint`
    Example

    ```js
    const {RawTransaction} = require('binance-utils')
    const rawTransaction = new RawTransaction('testnet');
    const txStr = rawTransaction.create('transfer', fromAddress, toAddress, amount, assert, accountNumber, sequence, memo);
    const multiTxStr = rawTransaction.create('multiSend', fromAddress, outputs, accountNumber, sequence, memo);
    //and more...
    ```

* **static parseTransaction(data)** => `Object{msg, signMsgHex, signMsg}`
 Decode raw transaction data
    * **params**
    *data* : `data Transaction hex string <String>`
Example
    ```js
    const {RawTransaction} = require('binance-utils')
    const rawTransaction = new RawTransaction('testnet');
    const txStr = rawTransaction.create('transfer', fromAddress, toAddress, amount, assert, accountNumber, sequence, memo);
    const transaction = RawTransaction.parseTransaction(txStr);
    ```

* **static sign(privateKey, rawTransaction, network)**  => `String`
Sign the raw transaction
    * **params**
    *privateKey* : `Sign account private key <String>`
    *rawTransaction* : `rawTransaction <String>`
    *network* : `Binance chain network, default 'mainnet' <String>`
Example
    ```js
    const {Transaction} = require('binance-utils')
    const transaction = new Transaction('testnet');
    const tx = transaction.create('placeOrder', address, symbol, side, price, quantity, timeinforce, accountNumber, sequence);
    // `signedHexString` can directly call the broadcast transaction interface and send it to the blockchain
    const signedHexString = Transaction.sign('private key', tx, 'testnet');
    ```


##### BnbApi
Create binance API server
* **new BnbApi(server)**
    * **params**
    *server* : `Binance Chain public url <String>`
    Example
    ```js
    const {BnbApi} = require('binance-utils');
    const apiProvider = new BnbApi('http://localhost:8080');
    ```

* **async broadcastTx(rawTransaction, sync)** => `Promise`
Broadcast a raw transaction to the blockchain.
    * **params**
    *rawTransaction* : `Signed and serialized raw transaction <String>`
    *sync* : `Use synchronous mode, default true <Boolean>`
* **async getAccount(address)** => `Promise`
Get account
    * **params**
    *address* : `Address <String>`
    
* **async getBalance(address)** => `Promise`
Get account balances
    * **params**
    *address* : `Address <String>`
    
* **async getMarkets(limit, offset)** => `Promise`
 Get markets
    * **params**
    *limit* : `Max 1000 is default <Number>`
    *offset* : `from beggining, default 0 <Number>`

##### BnbRpc
The Binance Chain Node rpc client
* **new BnbRpc(uriString, netWork)**
    * **params**
    *uriString* : `dataseed address <String>`
    *network* : `Binance chain network, supported 'mainnet/testnet', default: 'mainnet' <String>`
    Example
    ```js
    const {BnbRpc} = require('binance-utils');
    const rpcProvider = new BnbApi('http://localhost:27146', 'testnet');
    ```
* **async getTokenInfo(symbol)** => `Promise`
Get token info
    * **params**
    *symbol* : `symbol <String>`

* **async listAllTokens(offset, limit)** => `Promise`
Get tokens by offset and limit
    * **params**
    *offset* : `offset <Number>`
    *limit* : `limit <Number>`

* **async getAccount(address)** => `Promise`
Get account
    * **params**
    *address* : `address <String>`

* **async getBalances(address)** => `Promise`
Get account balances
    * **params**
    *address* : `address <String>`

* **async getBalance(address, symbol)** => `Promise`
Get balance by symbol and address
    * **params**
    *address* : `address <String>`
    *symbol* : `symbol <String>`

* **async getOpenOrders(address, symbol)** => `Promise`
Get open orders info
    * **params**
    *address* : `address <String>`
    *symbol* : `symbol <String>`

* **async getTradingPairs(offset, limit)** => `Promise`
Get trading pairs info
    * **params**
    *offset* : `offset <Number>`
    *limit* : `limit <Number>`
    
* **async getDepth(tradePair)** => `Promise`
Get depath
    * **params**
    *tradePair* : `tradePair <String>`

* **async status()** => `Promise`
Get fullnode status and block info

* **async tx({hash, prove})** => `Promise`
Get transaction by hash
    * **params**
    *hash* : `transaction hash <Buffer>`
    *prove*  : `Include a proof of the transaction inclusion in the block, default false <Boolean>`

* **async block({height})** => `Promise`
Get block at a given height. If no height is provided, it will fetch the latest block.
    * **params**
    *height* : `block height <Number>`

* **broadcastTxSync({tx})**
The transaction will be broadcasted and returns with the response from CheckTx.
    * **params**
    *tx* : `signed raw transaction info bytes in hex <Buffer>`


##### Wallet
Create or import BNB wallet
* **new Wallet(privateKey, network)** => `Wallet`
    * **params**
    *privateKey* : `private key，if the private key is empty, a new private key will be produced. <String>`
    *network* : ` Binance chain network, supported 'mainnet/testnet', default: 'mainnet' <String>`
    Example
    ```js
    const {Wallet} = require('binance-utils');
    // If the private key is empty, a new private key will be produced.
    const wallet = new Wallet('private key', 'testnet');
    ```

* **exportKeystore(password)** => `Object{privateKey: (*|string), address: *, keystore: {id, version, crypto}, publicKey: (string|*)}`
Export current privateKey keystore object, and returns the private key and address.
    * **params**
    *password* : ` The keystore object password. <String>`
    Example
    ```js
    const keystore = wallet.exportKeystore('password');
    ```

* **serializePubKey()** => `Buffer`
Serializes current wallet public key in a 33-byte compressed format.
Example
    ```js
    const pubKey = wallet.serializePubKey();
    ```

* **sign(data)** => `String`
Generates a signature (64 byte <r,s>) for a transaction based on current wallet privateKey
    * **params**
    *data* : `Unsigned transaction sign bytes hexstring. <String>`
    Example
    ```js
    const rawTransaction = rawTransaction.create('transfer', fromAddress, toAddress, amount, assert, account_number, sequence, memo);
    const transaction = RawTransaction.parseTransaction(rawTransaction);
    const signature = wallet.sign(transaction.signMsgHex);
    ```

* **export()** => `Object{privateKey: (*|string), path: string, address: *, seed: string, mnemonic: *, publicKey: (string|*), network: (*|string)}`
Export wallet account info
Example
    ```js
    const pubKey = wallet.serializePubKey();
    ```

* **static createMnemonicWallet(mnemonic, network)** => `Wallet`
 Create or import mnemonic HD wallet
    * **params**
    *mnemonic* : `The mnemonic phrase words. <String>`
    *network* : `Binance chain network, supported 'mainnet/testnet', default: 'mainnet'. <String>`
    Example
    ```js
    const mnemonicHDWallet = Wallet.createMnemonicWallet('mnemonic...', 'testnet');
    ```
* **static importKeystoreWallet(keystore, password, network)** => `Wallet`
Import keystore object wallet
    * **params**
    *keystore* : `keystore Keystore object. <Json Object>`
    *password* : `password <String>`
    *network* : `Binance chain network, supported 'mainnet/testnet', default: 'mainnet'. <String>`
    Example
    ```js
    const mnemonicHDWallet = Wallet.importKeystoreWallet(keystore, 'password', 'testnet');
    ```
* **static checkAddress(address, network)** => `Boolean`
Checks whether an address is valid.
    * **params**
    *address* : `address. <String>`
    *network* : `Binance chain network, supported 'mainnet/testnet', default: 'mainnet'. <String>`
    Example
    ```js
    const mnemonicHDWallet = Wallet.checkAddress('tbnb1fu029wlrx87pdxecqrw96a662v6cdrj5zsv5rd', 'testnet');
    ```
* **static verifySignature(sigHex, signBytesHex, publicKeyHex)** => `Boolean`
Verifies a signature (64 byte <r,s>) given the sign bytes and public key.
    * **params**
    *sigHex* : `The signature hexstring. <String>`
    *signBytesHex* : `Unsigned transaction sign bytes hexstring. <String>`
    *publicKeyHex* : `The public key.<string>`
    Example
    ```js
    const rawTransaction = rawTransaction.create('transfer', fromAddress, toAddress, amount, assert, account_number, sequence, memo);
    const transaction = RawTransaction.parseTransaction(rawTransaction);
    const signature = wallet.sign(transaction.signMsgHex);
    const verify= Wallet.verifySignature(signature, transaction.signMsgHex, wallet.export().publicKey);
    // verify = true
    ```
