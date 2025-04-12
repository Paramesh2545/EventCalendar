const express = require('express');
const router = express.Router();
const {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsByDateRange
} = require('../controllers/eventController');

router.get('/', getEvents);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.get('/range', getEventsByDateRange);

module.exports = router; 