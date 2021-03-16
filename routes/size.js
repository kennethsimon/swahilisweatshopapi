const express = require('express');
const router = express.Router();
const Size = require('../models/size');
const jwt = require('../middleware/jwt');

// Get size
router.get('/', async (req, res, next) => {
    const { id } = req.query;
    let sizes;
    try {
      if (id) {
          sizes = await Size.findById(id);
          return res.status(200).send(sizes)
      } else {
          sizes = await Size.find({});
          return res.status(200).send(sizes)
      }
    } catch (error) {
      return res.status(500).send(error.message)
    }
});

// Create size
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
              var size = new Size({
                title,
              });
              size = await size.save();
              return res.status(200).send(size);
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

// Edit size
router.post('/edit', async (req, res, next) => {
  const { token, sizeid, title } = req.body;
  if (token && sizeid && title) {
      try {
          if (jwt.verify(token)) {
            const payload = jwt.decode(token).payload;
            const role = payload.role;
            if (!["root", "admin"].includes(role)) {
              return res.status(403).send('user_not_admin');
            }
            const cquery = { _id: sizeid };
            const cupdate = { $set: { title: title } };
            const cat = await Size.findOneAndUpdate(cquery, cupdate, { new: true });
            return res.status(200).send(cat);
          } else {
            return res.status(422).send('invalid_token');
          }
      } catch(error) {
        return res.status(500).send(error.message);
      }
  } else {
      return res.status(422).send('one_of_token/sizeid/title_not_provided');
  }
});

module.exports = router;