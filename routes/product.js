const express = require('express');
const router = express.Router();
const jwt = require('../middleware/jwt');
const Product = require('../models/product');

// Get product
router.get('/', async (req, res, next) => {
    const { id } = req.query;
    let products;
    if (id) {
        products = await Product.findById(id).populate('category').populate('subcategory').populate('brand');
        return res.status(200).send(products)
    } else {
        products = await Product.find({}).populate('category').populate('subcategory').populate('brand');
        return res.status(200).send(products)
    }
});

// Create product
router.post('/create', async (req, res, next) => {
    const { token, title, about, image, gallery, price, category, subcategory, brand, size, color, gender, quantity } = req.body;
    if (token && title && about && image && gallery && price && category && subcategory && brand && size && color && quantity) {
        try {
            if (jwt.verify(token)) {
              var product = new Product({
                title,
                about,
                image,
                gallery,
                price,
                category,
                brand,
                size,
                color,
                gender,
                quantity,
                subcategory
              });
              product = await product.save();
              return res.status(200).send(product);
            } else {
              return res.status(422).send('invalid_token');
            }
        } catch(error) {
          return res.status(500).send(error.message);
        }
    } else { 
        return res.status(422).send('one_of_token/title/about/image/gallery/price/category/subcategory/brand/size/color/quantity_not_provided');
    }
});

module.exports = router;