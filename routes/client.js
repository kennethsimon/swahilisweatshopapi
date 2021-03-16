const express = require('express');
const router = express.Router();
const jwt = require('../middleware/jwt');
const Client = require('../models/client');

// Get client
router.get('/', async (req, res, next) => {
    const { id } = req.query;
    let clients;
    try {
      if (id) {
          clients = await Client.findById(id);
          return res.status(200).send(clients)
      } else {
          clients = await Client.find({});
          return res.status(200).send(clients)
      }
    } catch (error) {
      return res.status(500).send(error.message)
    }
});

// Create client
router.post('/create', async (req, res, next) => {
    const { token, title } = req.body;
    if (token && title) {
        try {
            if (jwt.verify(token)) {
              const payload = jwt.decode(token).payload;
              const role = payload.role;
              if (!["root", "admin"].includes(role)) {
                return res.status(403).send('user_not_admin');
              }
              var client = new Client({
                title,
              });
              client = await client.save();
              return res.status(200).send(client);
            } else {
              return res.status(422).send('invalid_token');
            }
        } catch(error) {
          return res.status(500).send(error.message);
        }
    } else {
        return res.status(422).send('one_of_token/title_not_provided');
    }
});

// Edit client
router.post('/edit', async (req, res, next) => {
  const { token, clientid, title } = req.body;
  if (token && clientid && title) {
      try {
          if (jwt.verify(token)) {
            const payload = jwt.decode(token).payload;
            const role = payload.role;
            if (!["root", "admin"].includes(role)) {
              return res.status(403).send('user_not_admin');
            }
            const cquery = { _id: clientid };
            const cupdate = { $set: { title: title } };
            const cat = await Client.findOneAndUpdate(cquery, cupdate, { new: true });
            return res.status(200).send(cat);
          } else {
            return res.status(422).send('invalid_token');
          }
      } catch(error) {
        return res.status(500).send(error.message);
      }
  } else {
      return res.status(422).send('one_of_token/clientid/title_not_provided');
  }
});

module.exports = router;