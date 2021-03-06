const fetch = require("node-fetch");

module.exports = {

  send: async (mobile, code) => {
    const body = {
        channel: {
          channel: 120094,
          password: "ZjRhNzRmN2E4MWU4MmJlYzM5NDM1MGE0NjE2MDI4ZGI1MGRjMDg5YTU3Zjk2ZTliZTA1ZjA0Nzc0NTEwZjljOQ==",
        },
        messages: [
          {
            source: "SWAHILISHOP",
            msisdn: mobile,
            text: `Your confirmation code is ${code}`,
          }
        ]
    };
    await fetch('https://secure-gw.fasthub.co.tz/fasthub/messaging/json/api', { body: JSON.stringify(body), method: 'POST', headers: { 'Content-Type': 'application/json' }});
    // .then(j => j.json())
    // .then(d => console.log(d))
    // .catch(e => console.log(e.message));
  },

}