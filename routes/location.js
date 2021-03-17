const express = require('express');
const router = express.Router();
const jwt = require('../middleware/jwt');
const Location = require('../models/location');

// Get location
router.get('/', async (req, res, next) => {
    const { id } = req.query;
    let locations;
    try {
      if (id) {
          locations = await Location.findById(id);
          return res.status(200).send(locations)
      } else {
          locations = await Location.find({});
          return res.status(200).send(locations)
      }
    } catch (error) {
      return res.status(500).send(error.message)
    }
});

// Create location
router.post('/create', async (req, res, next) => {
    const { token, title, price } = req.body;
    if (token && title && price) {
        try {
            if (jwt.verify(token)) {
              const payload = jwt.decode(token).payload;
              const role = payload.role;
              if (!["root", "admin"].includes(role)) {
                return res.status(403).send('user_not_admin');
              }
              var location = new Location({
                title,
                price,
              });
              location = await location.save();
              return res.status(200).send(location);
            } else {
              return res.status(422).send('invalid_token');
            }
        } catch(error) {
          return res.status(500).send(error.message);
        }
    } else {
        return res.status(422).send('one_of_token/title/price_not_provided');
    }
});

// Edit location
router.post('/edit', async (req, res, next) => {
  const { token, locationid, title, price } = req.body;
  if (token && locationid && title && price) {
      try {
          if (jwt.verify(token)) {
            const payload = jwt.decode(token).payload;
            const role = payload.role;
            if (!["root", "admin"].includes(role)) {
              return res.status(403).send('user_not_admin');
            }
            const cquery = { _id: locationid };
            const cupdate = { $set: { title, price } };
            const cat = await Location.findOneAndUpdate(cquery, cupdate, { new: true });
            return res.status(200).send(cat);
          } else {
            return res.status(422).send('invalid_token');
          }
      } catch(error) {
        return res.status(500).send(error.message);
      }
  } else {
      return res.status(422).send('one_of_token/locationid/title/price_not_provided');
  }
});

module.exports = router;