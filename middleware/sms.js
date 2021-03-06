module.exports = {

  send: async (mobile, code) => {
    // SHA256 = F4A74F7A81E82BEC394350A4616028DB50DC089A57F96E9BE05F04774510F9C9
    // SHA256 = f4a74f7a81e82bec394350a4616028db50dc089a57f96e9be05f04774510f9c9
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