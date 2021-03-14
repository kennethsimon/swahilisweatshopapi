const express = require('express');
const router = express.Router();
const jwt = require('../middleware/jwt');
const Photo = require('../models/photo');

// Get photo
router.get('/', async (req, res, next) => {
    const { id } = req.query;
    let photos;
    try {
      if (id) {
          photos = await Photo.findById(id);
          return res.status(200).send(photos)
      } else {
          photos = await Photo.find({});
          return res.status(200).send(photos)
      }
    } catch (error) {
      return res.status(500).send(error.message)
    }
});

// Create photo
router.post('/create', async (req, res, next) => {
    const { token, title, about, venue, url, date } = req.body;
    if (token && title && about && venue && url && date) {
        try {
            if (jwt.verify(token)) {
              const payload = jwt.decode(token).payload;
              const role = payload.role;
              if (!["root", "admin"].includes(role)) {
                return res.status(403).send('user_not_admin');
              }
              var photo = new Photo({
                url,
                date,
                title,
                about,
                venue,
              });
              photo = await photo.save();
              return res.status(200).send(photo);
            } else {
              return res.status(422).send('invalid_token');
            }
        } catch(error) {
          return res.status(500).send(error.message);
        }
    } else {
        return res.status(422).send('one_of_token/title/about/venue/url/date_not_provided');
    }
});

// Edit photo
router.post('/edit', async (req, res, next) => {
  const { token, photoid, title, about, url } = req.body;
  if (token && photoid && title && about && url) {
      try {
          if (jwt.verify(token)) {
            const payload = jwt.decode(token).payload;
            const role = payload.role;
            if (!["root", "admin"].includes(role)) {
              return res.status(403).send('user_not_admin');
            }
            const pupdate = { $set: {
              url,
              title,
              about,
            }};
            const photoUpdated = await Photo.findByIdAndUpdate(photoid, pupdate, { new: true });
            return res.status(200).send(photoUpdated);
          } else {
            return res.status(422).send('invalid_token');
          }
      } catch(error) {
        return res.status(500).send(error.message);
      }
  } else {
      return res.status(422).send('one_of_token/title/about/url_not_provided');
  }
});

// Activate/Deactivate photo
router.post('/toggle', async (req, res, next) => {
  const { token, photoid, isActive } = req.body;
  if (token && photoid && isActive) {
      try {
          if (jwt.verify(token)) {
            const payload = jwt.decode(token).payload;
            const role = payload.role;
            if (!["root", "admin"].includes(role)) {
              return res.status(403).send('user_not_admin');
            }
            var pupdate = { $set: { isActive: isActive } };
            var photoUpdated = await Photo.findByIdAndUpdate(photoid, pupdate, { new: true });
            return res.status(200).send(photoUpdated);
          } else {
            return res.status(422).send('invalid_token');
          }
      } catch(error) {
        return res.status(500).send(error.message);
      }
  } else {
      return res.status(422).send('one_of_token/photoid/isActive_not_provided');
  }
});

// Vote for photo
router.post('/vote', async (req, res, next) => {
    const { token, photoid } = req.body;
    if (token && photoid) {
        try {
            if (jwt.verify(token)) {
              var peventquery = { _id: photoid };
              var peventupdate = { $inc: { votes: 1 } };
              var pevent = await Photo.findOneAndUpdate(peventquery, peventupdate, { new: true });
              return res.status(200).send(pevent);
            } else {
              return res.status(422).send('invalid_token');
            }
        } catch(error) {
          return res.status(500).send(error.message);
        }
    } else {
        return res.status(422).send('one_of_token/photoid_not_provided');
    }
});

module.exports = router;