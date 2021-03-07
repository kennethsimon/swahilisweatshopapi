const express = require('express');
const router = express.Router();
const jwt = require('../middleware/jwt');
const Category = require('../models/category');

// Get category
router.get('/', async (req, res, next) => {
    const { id } = req.query;
    let categories;
    if (id) {
        categories = await Category.findById(id).populate('category');
        return res.status(200).send(categories)
    } else {
        categories = await Category.find({});
        return res.status(200).send(categories)
    }
});

// Create category
router.post('/create', async (req, res, next) => {
    const { token, title } = req.body;
    if (token && title) {
        try {
            if (jwt.verify(token)) {
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

module.exports = router;