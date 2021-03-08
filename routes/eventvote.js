const express = require('express');
const router = express.Router();
const Eventvote = require('../models/eventvote');

// Check event vote
router.get('/', async (req, res, next) => {
    const { userid, eventid } = req.query;
    if (userid && eventid) {
        try {
            const evquery = { user: userid, event: eventid };
            const eventvote = await Eventvote.findOne(evquery);
            return res.status(200).send(eventvote)
        } catch (error) {
          return res.status(500).send(error.message)
        }
    } else {
        return res.status(422).send('one_of_userid/eventid_not_provided');
    }
});

module.exports = router;