const express = require('express');
const router = express.Router();
const jwt = require('../middleware/jwt');
const Color = require('../models/color');

// Get color
router.get('/', async (req, res, next) => {
    const { id } = req.query;
    let colors;
    try {
      if (id) {
          colors = await Color.findById(id);
          return res.status(200).send(colors)
      } else {
          colors = await Color.find({});
          return res.status(200).send(colors)
      }
    } catch (error) {
      return res.status(500).send(error.message)
    }
});

// Create color
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
              var color = new Color({
                title,
              });
              color = await color.save();
              return res.status(200).send(color);
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

// Edit color
router.post('/edit', async (req, res, next) => {
  const { token, colorid, title } = req.body;
  if (token && colorid && title) {
      try {
          if (jwt.verify(token)) {
            const payload = jwt.decode(token).payload;
            const role = payload.role;
            if (!["root", "admin"].includes(role)) {
              return res.status(403).send('user_not_admin');
            }
            const cquery = { _id: colorid };
            const cupdate = { $set: { title: title } };
            const cat = await Color.findOneAndUpdate(cquery, cupdate, { new: true });
            return res.status(200).send(cat);
          } else {
            return res.status(422).send('invalid_token');
          }
      } catch(error) {
        return res.status(500).send(error.message);
      }
  } else {
      return res.status(422).send('one_of_token/colorid/title_not_provided');
  }
});

module.exports = router;