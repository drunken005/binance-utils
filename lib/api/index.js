const HttpRequest = require('../utils/request');

const api = {
    broadcast: "/api/v1/broadcast",
    nodeInfo: "/api/v1/node-info",
    getAccount: "/api/v1/account",
    getMarkets: "/api/v1/markets"
};


class BnbApi {
    constructor(server) {
        this.httpProvider = new HttpRequest(server);
    }

    async broadcastTx(rawTransaction, sync = true) {
        const opts = {
            data: rawTransaction,
            headers: {
                "content-type": "text/plain",
            }
        };
        return this.httpProvider.request("post", `${api.broadcast}?sync=${sync}`, null, opts)
    }

    async getMarkets(limit = 1000, offset = 0) {
        try {
            const data = await this.httpProvider.request("get", `${api.getMarkets}?limit=${limit}&offset=${offset}`);
            return data
        } catch (err) {
            console.warn("getMarkets error", err);
            return []
        }
    }

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