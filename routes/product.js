const express = require('express');
const router = express.Router();
const jwt = require('../middleware/jwt');
const Brand = require('../models/brand');
const Client = require('../models/client');
const Product = require('../models/product');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');

// Get product
router.get('/', async (req, res, next) => {
    const { id } = req.query;
    let products;
    try {
      if (id) {
        products = await Product.findById(id)
        .populate({ path: 'brand', model: Brand })
        .populate({ path: 'client', model: Client })
        .populate({ path: 'category', model: Category })
        .populate({ path: 'subcategory', model: Subcategory });
        return res.status(200).send(products)
      } else {
        products = await Product.find({})
        .populate({ path: 'brand', model: Brand })
        .populate({ path: 'client', model: Client })
        .populate({ path: 'category', model: Category })
        .populate({ path: 'subcategory', model: Subcategory });
        return res.status(200).send(products)
      }
    } catch (error) {
      return res.status(500).send(error.message)
    }
});

// Create product
router.post('/create', async (req, res, next) => {
    const { token, title, about, image, gallery, price, category, subcategory, brand, size, color, gender, quantity, tags, client } = req.body;
    if (token && title && about && image && gallery && price && category && subcategory && brand && size && color && quantity && client) {
        try {
            if (jwt.verify(token)) {
              const payload = jwt.decode(token).payload;
              const role = payload.role;
              if (!["root", "admin"].includes(role)) {
                return res.status(403).send('user_not_admin');
              }
              var product = new Product({
                title,
                about,
                image,
                gallery,
                price,
                category,
                brand,
                size,
                tags,
                client,
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

// Edit product
router.post('/edit', async (req, res, next) => {
  const { token, productid, title, about, image, gallery, price, category, subcategory, brand, size, color, gender, quantity, tags, client } = req.body;
  if (token && productid && title && about && image && gallery && price && category && subcategory && brand && size && color && quantity && client) {
      try {
          if (jwt.verify(token)) {
            const payload = jwt.decode(token).payload;
            const role = payload.role;
            if (!["root", "admin"].includes(role)) {
              return res.status(403).send('user_not_admin');
            }
            const pupdate = { $set: {
              title,
              about,
              image,
              gallery,
              price,
              category,
              brand,
              size,
              tags,
              client,
              color,
              gender,
              quantity,
              subcategory
            }};
            const productUpdated = await Product.findByIdAndUpdate(productid, pupdate, { new: true });
            return res.status(200).send(productUpdated);
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

// Delete product
router.post('/delete', async (req, res, next) => {
  const { token, productid } = req.body;
  if (token && productid) {
      try {
          if (jwt.verify(token)) {
            const payload = jwt.decode(token).payload;
            const role = payload.role;
            if (!["root", "admin"].includes(role)) {
              return res.status(403).send('user_not_admin');
            }
            await Product.deleteOne({ _id: productid });
            return res.status(200).send('product_deleted');
          } else {
            return res.status(422).send('invalid_token');
          }
      } catch(error) {
        return res.status(500).send(error.message);
      }
  } else { 
      return res.status(422).send('one_of_token/productid_not_provided');
  }
});

// Set tags
router.post('/settags', async (req, res, next) => {
  const { token, productid, tags } = req.body;
  if (token && productid && tags) {
      try {
          if (jwt.verify(token)) {
            const payload = jwt.decode(token).payload;
            const role = payload.role;
            if (!["root", "admin"].includes(role)) {
              return res.status(403).send('user_not_admin');
            }
            const pquery = { _id: productid };
            const pupdate = { $set: { tags: tags } };
            const product = await Product.findOneAndUpdate(pquery, pupdate, { new: true });
            return res.status(200).send(product);
          } else {
            return res.status(422).send('invalid_token');
          }
      } catch(error) {
        return res.status(500).send(error.message);
      }
  } else {
      return res.status(422).send('one_of_token/productid/tags_not_provided');
  }
});

module.exports = router;