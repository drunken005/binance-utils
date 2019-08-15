const axios = require("axios");

/**
 * @alias utils.HttpRequest
 */
class HttpRequest {
    constructor(baseURL) {
        this.httpClient = axios.create({baseURL})
    }

    get(path, params, opts) {
        return this.request("get", path, params, opts)
    }

    post(path, body, opts) {
        return this.request("post", path, body, opts)
    }

    request(method, path, params, opts) {
        const options = {
            method,
            url: path,
            ...opts
        };

        if (params) {
            if (method === "get") {
                options.params = params
            } else {
                options.data = params
            }
        }

        return this.httpClient
            .request(options)
            .then(response => {
                return {result: response.data, status: response.status}
            }).catch(err => {
                let error = err;
                try {
                    const msgObj = err.response && err.response.data;
                    error = new Error(msgObj.message|| msgObj);
                    error.code = msgObj.code;
                } catch (err) {
                    throw error
                }
                throw error
            })
    }
}

module.exports = HttpRequest;
