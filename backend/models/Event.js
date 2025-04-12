const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['exercise', 'eating', 'work', 'relax', 'family', 'social']
    },
    date: {
        type: String,
        required: [true, 'Please add a date']
    },
    startTime: {
        type: String,
        required: [true, 'Please add a start time']
    },
    endTime: {
        type: String,
        required: [true, 'Please add an end time']
    },
    day: {
        type: String,
        required: [true, 'Please add a day']
    },
    created: {
        type: Date,
        default: Date.now
    }
});

eventSchema.index({ day: 1 });
eventSchema.index({ category: 1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 