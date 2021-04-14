const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Cart = require('../models/cart');
const jwt = require('../middleware/jwt');
const fetch = require("node-fetch");
const axios = require('axios');

// Get cart
router.get('/', async (req, res, next) => {
    const { id } = req.query;
    let carts;
    try {
      if (id) {
          carts = await Cart.findById(id);
          return res.status(200).send(carts)
      } else {
          carts = await Cart.find({});
          return res.status(200).send(carts)
      }
    } catch (error) {
      return res.status(500).send(error.message)
    }
});

// Create cart
router.post('/create', async (req, res, next) => {
    const { token, products, total, location, delivery, state } = req.body;
    if (token && products && total && location && delivery && state) {
        try {
            if (jwt.verify(token)) {
              const payload = jwt.decode(token).payload;
              const role = payload.role;
              if (!["root", "admin"].includes(role)) {
                return res.status(403).send('user_not_admin');
              }
              var cart = new Cart({
                state,
                total,
                products,
                location,
                delivery,
              });
              cart = await cart.save();
              return res.status(200).send(cart);
            } else {
              return res.status(422).send('invalid_token');
            }
        } catch(error) {
          return res.status(500).send(error.message);
        }
    } else {
        return res.status(422).send('one_of_token/products/otal/location/delivery/state_not_provided');
    }
});

// // Edit category
// router.post('/edit', async (req, res, next) => {
//   const { token, categoryid, title } = req.body;
//   if (token && categoryid && title) {
//       try {
//           if (jwt.verify(token)) {
//             const payload = jwt.decode(token).payload;
//             const role = payload.role;
//             if (!["root", "admin"].includes(role)) {
//               return res.status(403).send('user_not_admin');
//             }
//             const cquery = { _id: categoryid };
//             const cupdate = { $set: { title: title } };
//             const cat = await Cart.findOneAndUpdate(cquery, cupdate, { new: true });
//             return res.status(200).send(cat);
//           } else {
//             return res.status(422).send('invalid_token');
//           }
//       } catch(error) {
//         return res.status(500).send(error.message);
//       }
//   } else {
//       return res.status(422).send('one_of_token/categoryid/title_not_provided');
//   }
// });

// Get cart
router.get('/checkout', async (req, res, next) => {
  const timeStamp = new Date();
  const digest = `timestamp=[${timeStamp.toISOString}]&vendor=TILL60250206&order_id=123&buyer_email=caashiere@gmail.com&buyer_name=Ralph Caashiere&buyer_phone=255654226112&amount=5000&currency=TZS&no_of_items=3`;
  const hmac = crypto.createHmac('sha256', '5e9a3546-78cd-4dfa-bb30-7de9a7eb69b5');
  const data = hmac.update(digest);
  const hmachash = data.digest('hex');
  const buff = Buffer.from(hmachash, 'utf-8');
  const base64hash = buff.toString('base64');
  const headers = {
    'Authorization': 'SELCOM U1dBSElMSS1Xc0dId2VERnlXNU9PaUFz',
    'Signed-Fields': 'vendor,order_id,buyer_email,buyer_name,buyer_phone,amount,currency,no_of_items',
    'Timestamp': timeStamp.toISOString(),
    'Digest-Method': 'HS256',
    'Digest': base64hash,
  }
  axios
  .post(
    'https://apigwtest.selcommobile.com/v1/checkout/create-order-minimal',
    JSON.stringify({
      vendor: 'TILL60250206',
      order_id: '123',
      buyer_email: 'caashiere@gmail.com',
      buyer_name: 'Ralph Caashiere',
      buyer_phone: '255718004865',
      amount: 5000,
      currency: 'TZS',
      no_of_items: 3
    }),
    {
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      }
    }
  )
  .then(res => {
    console.log(res.data);
    return res.status(200).send(res.data);
  })
  .catch(err => {
    console.log(err.message);
    return res.status(500).send(err.message);
  });
});

module.exports = router;