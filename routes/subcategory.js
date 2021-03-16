const express = require('express');
const router = express.Router();
const jwt = require('../middleware/jwt');
const Subcategory = require('../models/subcategory');

// Get category
router.get('/', async (req, res, next) => {
    const { id } = req.query;
    let subcategories;
    try {
      if (id) {
          subcategories = await Subcategory.findById(id);
          return res.status(200).send(subcategories)
      } else {
          subcategories = await Subcategory.find({})
          .populate({ path: 'category', model: Category });
          return res.status(200).send(subcategories)
      }
    } catch (error) {
      return res.status(500).send(error.message)
    }
});

// Create category
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
              var subcategory = new Subcategory({
                title,
              });
              subcategory = await subcategory.save();
              return res.status(200).send(subcategory);
            } else {
              return res.status(422).send('invalid_token');
            }
        } catch(error) {
          return res.status(500).send(error.message);
        }
    } else {
        return res.status(422).send('one_of_token/title/category_not_provided');
    }
});

// Edit subcategory
router.post('/edit', async (req, res, next) => {
  const { token, subcategoryid, title } = req.body;
  if (token && subcategoryid && title) {
      try {
          if (jwt.verify(token)) {
            const payload = jwt.decode(token).payload;
            const role = payload.role;
            if (!["root", "admin"].includes(role)) {
              return res.status(403).send('user_not_admin');
            }
            const sbquery = { _id: subcategoryid };
            const sbupdate = { $set: { title: title } };
            const subcat = await Subcategory.findOneAndUpdate(sbquery, sbupdate, { new: true });
            return res.status(200).send(subcat);
          } else {
            return res.status(422).send('invalid_token');
          }
      } catch(error) {
        return res.status(500).send(error.message);
      }
  } else {
      return res.status(422).send('one_of_token/subcategoryid/title_not_provided');
  }
});

module.exports = router;