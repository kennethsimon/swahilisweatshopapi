const express = require('express');
const router = express.Router();
const jwt = require('../middleware/jwt');
const Category = require('../models/category');

// Get category
router.get('/', async (req, res, next) => {
    const { id } = req.query;
    let categories;
    try {
      if (id) {
          categories = await Category.findById(id);
          return res.status(200).send(categories)
      } else {
          categories = await Category.find({});
          return res.status(200).send(categories)
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
              if (role !== 'admin') {
                return res.status(403).send('user_not_admin');
              }
              var category = new Category({
                title,
              });
              category = await category.save();
              return res.status(200).send(category);
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

// Edit category
router.post('/edit', async (req, res, next) => {
  const { token, categoryid, title } = req.body;
  if (token && categoryid && title) {
      try {
          if (jwt.verify(token)) {
            const payload = jwt.decode(token).payload;
            const role = payload.role;
            if (role !== 'admin') {
              return res.status(403).send('user_not_admin');
            }
            const cquery = { _id: categoryid };
            const cupdate = { $set: { title: title } };
            const cat = await Category.findOneAndUpdate(cquery, cupdate, { new: true });
            return res.status(200).send(cat);
          } else {
            return res.status(422).send('invalid_token');
          }
      } catch(error) {
        return res.status(500).send(error.message);
      }
  } else {
      return res.status(422).send('one_of_token/categoryid/title_not_provided');
  }
});

module.exports = router;