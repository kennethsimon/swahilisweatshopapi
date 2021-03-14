const express = require('express');
const router = express.Router();
const jwt = require('../middleware/jwt');
const Brand = require('../models/brand');

// Get brand
router.get('/', async (req, res, next) => {
    const { id } = req.query;
    let brands;
    try {
      if (id) {
          brands = await Brand.findById(id);
          return res.status(200).send(brands)
      } else {
          brands = await Brand.find({});
          return res.status(200).send(brands)
      }
    } catch (error) {
      return res.status(500).send(error.message)
    }
});

// Create brand
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
              var brand = new Brand({
                title,
              });
              brand = await brand.save();
              return res.status(200).send(brand);
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

// Edit brand
router.post('/edit', async (req, res, next) => {
  const { token, brandid, title } = req.body;
  if (token && brandid && title) {
      try {
          if (jwt.verify(token)) {
            const payload = jwt.decode(token).payload;
            const role = payload.role;
            if (!["root", "admin"].includes(role)) {
              return res.status(403).send('user_not_admin');
            }
            const bquery = { _id: brandid };
            const bupdate = { $set: { title: title } };
            const brand = await Brand.findOneAndUpdate(bquery, bupdate, { new: true });
            return res.status(200).send(brand);
          } else {
            return res.status(422).send('invalid_token');
          }
      } catch(error) {
        return res.status(500).send(error.message);
      }
  } else {
      return res.status(422).send('one_of_token/brandid/title_not_provided');
  }
});

module.exports = router;