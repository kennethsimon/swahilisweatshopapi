const express = require('express');
const router = express.Router();
const jwt = require('../middleware/jwt');
const Event = require('../models/event');

// Get event
router.get('/', async (req, res, next) => {
    const { id } = req.query;
    let events;
    if (id) {
        events = await Event.findById(id);
        return res.status(200).send(events)
    } else {
        events = await Event.find({});
        return res.status(200).send(events)
    }
});

// Create event
router.post('/create', async (req, res, next) => {
    const { token, title, about, venue, gallery, date } = req.body;
    if (token && title && about && venue && gallery && date) {
        try {
            if (jwt.verify(token)) {
              var event = new Event({
                date,
                title,
                about,
                venue,
                gallery
              });
              event = await event.save();
              return res.status(200).send(event);
            } else {
              return res.status(422).send('invalid_token');
            }
        } catch(error) {
          return res.status(500).send(error.message);
        }
    } else {
        return res.status(422).send('one_of_token/title/about/venue/gallery/date_not_provided');
    }
});

// Vote for event
router.post('/vote', async (req, res, next) => {
    const { token, votes, eventid } = req.body;
    if (token && votes && eventid) {
        try {
            if (jwt.verify(token)) {
              var peventquery = { _id: eventid };
              var peventupdate = { $inc: { 'rates.votes': votes, 'rates.total': 10 } };
              var pevent = await Event.findOneAndUpdate(peventquery, peventupdate, { new: true });
              return res.status(200).send(pevent);
            } else {
              return res.status(422).send('invalid_token');
            }
        } catch(error) {
          return res.status(500).send(error.message);
        }
    } else {
        return res.status(422).send('one_of_token/votes/eventid_not_provided');
    }
});

module.exports = router;