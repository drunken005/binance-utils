const HttpRequest = require('../utils/request');

const api = {
    broadcast: "/api/v1/broadcast",
    nodeInfo: "/api/v1/node-info",
    getAccount: "/api/v1/account",
    getMarkets: "/api/v1/markets"
};

/**
 * Binance API server
 */
class BnbApi {
    /**
     * @param server  Binance Chain public url
     */
    constructor(server) {
        this.httpProvider = new HttpRequest(server);
    }

    /**
     * Broadcast a raw transaction to the blockchain.
     * @param rawTransaction
     * @param sync Use synchronous mode, optional
     * @returns {Promise<*>}signed and serialized raw transaction
     */
    async broadcastTx(rawTransaction, sync = true) {
        const opts = {
            data: rawTransaction,
            headers: {
                "content-type": "text/plain",
            }
        };
        return this.httpProvider.request("post", `${api.broadcast}?sync=${sync}`, null, opts)
    }

    /**
     * Get markets
     * @param limit Max 1000 is default
     * @param offset From beggining, default 0
     * @returns {Promise<*>}
     */
    async getMarkets(limit = 1000, offset = 0) {
        try {
            const data = await this.httpProvider.request("get", `${api.getMarkets}?limit=${limit}&offset=${offset}`);
            return data
        } catch (err) {
            console.warn("getMarkets error", err);
            return []
        }
    }

    /**
     * Get account
     * @param address
     * @returns {Promise<*>}
     */
    async getAccount(address) {
        if (!address) {
            throw new Error("address should not be falsy")
        }
        try {
            return await this.httpProvider.request("get", `${api.getAccount}/${address}`);
        } catch (err) {
            return null
        }
    }

    /**
     * Get account balances
     * @param address
     * @returns {Promise<*>}
     */
    async getBalance(address) {
        try {
            const data = await this.getAccount(address);
            return data.result.balances
        } catch (err) {
            return []
        }
    }


}


module.exports = BnbApi;