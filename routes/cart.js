const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const jwt = require('../middleware/jwt');

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

module.exports = router;