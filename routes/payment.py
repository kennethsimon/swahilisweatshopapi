import hmac, base64, datetime, time, hashlib, requests, json


class SelcomPay:
    SELCOM_API_KEY = "KUKUMARKET-8Plj0rPnRhVUkUSa"
    SELCOM_API_SECRET = "52695852-8a21-4f13-a885-a32a1a152161"
    SELCOM_BASE_URL = "https://apigwtest.selcommobile.com"

    utc_offset_sec = time.altzone if time.localtime().tm_isdst else time.timezone
    utc_offset = datetime.timedelta(seconds=-utc_offset_sec)
    timestamp = datetime.datetime.now().replace(tzinfo=datetime.timezone(offset=utc_offset)).isoformat()

    def __init__(self, *args, **kwargs):
        self.apiKeyEncoded = base64.b64encode(self.SELCOM_API_KEY.encode("utf-8"))

    def getDigest(self, data):
        message = 'timestamp=' + self.timestamp
        for d in data.keys():
            message = message + "&" + str(d) + "=" + str(data[d])
        return base64.b64encode(hmac.new(bytes(self.SELCOM_API_SECRET, "utf-8"), bytes(message, "utf-8"),
                                         digestmod=hashlib.sha256).digest()).decode()

    def getHeaders(self, data):
        headers = {
            "Content-type": "application/json",
            "Cache-Control": "no-cache",
            "Accept": "application/json",
            "Authorization": "SELCOM " + self.apiKeyEncoded.decode(),
            "Digest-Method": "HS256",
            "Digest": self.getDigest(data),
            "Timestamp": self.timestamp,
            "Signed-Fields": ",".join(data.keys())
        }
        return headers

    def createMinimalOrder(self, data):
        url = self.SELCOM_BASE_URL + "/v1/checkout/create-order-minimal"
        r = requests.post(url, data=json.dumps(data), headers=self.getHeaders(data), verify=True)
        return r.json()

    def createOrder(self, data, orderId):
        url = self.SELCOM_BASE_URL + "/v1/checkout/create-order"
        r = requests.post(url, data=json.dumps(data), headers=self.getHeaders(data), verify=True)
        return r.json()

    def cretePushOnly(self, orderId, data):
        url = self.SELCOM_BASE_URL + "/v1/checkout/wallet-payment"
        r = requests.post(url, data=json.dumps(data), headers=self.getHeaders(data), verify=True)
        return r.json()

    def creteMinimalOrderPush(self, min_data, push_data):
        url = self.SELCOM_BASE_URL + "/v1/checkout/wallet-payment"
        self.createMinimalOrder(min_data)
        time.sleep(4)
        r = requests.post(url, data=json.dumps(push_data), headers=self.getHeaders(push_data), verify=True)
        return r.json()

    def getOrderStatus(self, order_id):
        url = self.SELCOM_BASE_URL + "/v1/checkout/order-status?id=" + str(order_id)
        r = requests.get(url, headers=self.getHeaders({"id": order_id}))
        return r.json()

    def cancelOrder(self, order_id):
        url = self.SELCOM_BASE_URL + "/v1/checkout/cancel-order?id=" + str(order_id)
        r = requests.get(url, headers=self.getHeaders({"id": order_id}))
        return r.json()

    def getAllOrders(self, fromDate, toDate):
        url = self.SELCOM_BASE_URL + "/v1/checkout/list-orders?fromdate=" + str(fromDate) + "&todate=" + str(toDate)
        r = requests.get(url, headers=self.getHeaders({"fromdate": fromDate, "todate": toDate}))
        return r.json()
