const axios = require('axios');

class SelcomPayment {
    SELCOM_API_KEY = "SWAHILI-WsGHweDFyW5OOiAs";
    SELCOM_API_SECRET = "5e9a3546-78cd-4dfa-bb30-7de9a7eb69b5";
    SELCOM_BASE_URL = "https://apigwtest.selcommobile.com";

    constructor() {
        this.timestamp = new Date().toISOString()
    }

    getDigest(data) {
        var message = 'timestamp=' + this.timestamp;
        for (var d in data) {
            message = message + '&' + d + '=' + data[`${d}`];
        }
        var CryptoJS = require("crypto-js");
        var Base64 = require("crypto-js/enc-base64");
        var hmacString = CryptoJS.HmacSHA256(message, this.SELCOM_API_SECRET);
        var base64Hmac = Base64.stringify(hmacString);
        return base64Hmac;
    }

    getHeaders(data) {
        var fields = Object.keys(data);
        var headers = {
            "Content-type": "application/json",
            "Cache-Control": "no-cache",
            "Accept": "application/json",
            "Authorization": "SELCOM U1dBSElMSS1Xc0dId2VERnlXNU9PaUFz",
            "Digest-Method": "HS256",
            "Digest": this.getDigest(data),
            "Timestamp": this.timestamp,
            "Signed-Fields": fields.join()
        }
        return headers
    }

    createMinimalOrder(data) {

        var url = this.SELCOM_BASE_URL + "/v1/checkout/create-order-minimal";
        axios.post(url, data, { headers: this.getHeaders(data) }).then(res => {
            console.log(res);
            return res.status(200).send(res.data);
        }).catch(err => {
            console.log(err.response);
            return err.response;
        });
    }


    createOrder(data) {
        var url = this.SELCOM_BASE_URL + "/v1/checkout/create-order"
        axios.post(url, data, { headers: this.getHeaders(data) }).then(res => {
            console.log(res);
            return res.status(200).send(res.data);
        }).catch(err => {
            console.log(err.response);
            return err.response;
        });
    }
    cretePushOnly(data) {
        var url = this.SELCOM_BASE_URL + "/v1/checkout/wallet-payment"
        axios.post(url, data, { headers: this.getHeaders(data) }).then(res => {
            console.log(res);
            return res.status(200).send(res.data);
        }).catch(err => {
            console.log(err.response);
            return err.response;
        });
    }

    creteMinimalOrderPush(min_data, push_data) {
        var url = this.SELCOM_BASE_URL + "/v1/checkout/wallet-payment"
        this.createMinimalOrder(min_data)
        axios.post(url, data, { headers: this.getHeaders(push_data) }).then(res => {
            console.log(res);
            return res.status(200).send(res.data);
        }).catch(err => {
            console.log(err.response);
            return err.response;
        });
    }

    getOrderStatus(order_id) {
        var url = this.SELCOM_BASE_URL + "/v1/checkout/order-status?id=" + order_id
        axios.get(url, data, { headers: this.getHeaders({ 'id': order_id }) }).then(res => {
            console.log(res);
            return res.status(200).send(res.data);
        }).catch(err => {
            console.log(err.response);
            return err.response;
        });
    }

    cancelOrder(order_id) {
        var url = this.SELCOM_BASE_URL + "/v1/checkout/cancel-order?id=" + order_id
        axios.get(url, data, { headers: this.getHeaders({ 'id': order_id }) }).then(res => {
            console.log(res);
            return res.status(200).send(res.data);
        }).catch(err => {
            console.log(err.response);
            return err.response;
        });
    }

    getAllOrders(fromDate, toDate) {
        url = this.SELCOM_BASE_URL + "/v1/checkout/list-orders?fromdate=" + fromDate + "&todate=" + toDate
        axios.get(url, data, { headers: this.getHeaders({ "fromdate": fromDate, "todate": toDate }) }).then(res => {
            console.log(res);
            return res.status(200).send(res.data);
        }).catch(err => {
            console.log(err.response);
            return err.response;
        });
    }
}

module.exports = new SelcomPayment();