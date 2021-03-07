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
          subcategories = await Subcategory.findById(id).populate('category');
          return res.status(200).send(subcategories)
      } else {
          subcategories = await Subcategory.find({});
          return res.status(200).send(subcategories)
      }
    } catch (error) {
      return res.status(500).send(error.message)
    }
});

// Create category
router.post('/create', async (req, res, next) => {
    const { token, title, category } = req.body;
    if (token && title && category) {
        try {
            if (jwt.verify(token)) {
              var subcategory = new Subcategory({
                title,
                category,
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

module.exports = router;