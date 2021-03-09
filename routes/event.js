const express = require('express');
const router = express.Router();
const jwt = require('../middleware/jwt');
const Event = require('../models/event');
const Eventvote = require('../models/eventvote');

// Get event
router.get('/', async (req, res, next) => {
    const { id } = req.query;
    let events;
    try {
      if (id) {
          events = await Event.findById(id);
          return res.status(200).send(events)
      } else {
          events = await Event.find({});
          return res.status(200).send(events)
      }
    } catch (error) {
      return res.status(500).send(error.message)
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
    const { token, votes, eventid, type, awareness, participateagain } = req.body;
    if (token && votes && eventid && type && awareness && participateagain) {
        try {
            if (jwt.verify(token)) {
              const userid = jwt.decode(token).payload.id;
              const peventquery = { _id: eventid };
              const peventupdate = { $inc: { 'rates.votes': votes, 'rates.total': 8 } };
              const pevent = await Event.findOneAndUpdate(peventquery, peventupdate, { new: true });
              const evquery = { event: eventid, user: userid };
              const evupdate = { votes, type, awareness, participateagain };
              await Eventvote.findOneAndUpdate(evquery, evupdate, { upsert: true, new: true });
              return res.status(200).send(pevent);
            } else {
              return res.status(422).send('invalid_token');
            }
        } catch(error) {
          return res.status(500).send(error.message);
        }
    } else {
        return res.status(422).send('one_of_token/votes/eventid/type/awareness/participateagain_not_provided');
    }
});

module.exports = router;