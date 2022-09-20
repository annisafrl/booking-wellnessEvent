const mongoose = require("mongoose");
const Schema = mongoose.Schema

const EventSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    eventName: {
        type: String,
        require: true,
    },
    eventDescription: {
        type: String,
        require: true,
    },
    eventCategory: {
        type: String,
        require: true,
    },
    eventDate: {
        type: Date,
        require: true,
    },
    eventStatus: {
        type: String,
        require: true,
        default: 'awaitapproval',
        enum: ['awaitapproval', 'approved', 'reject']
    },
    createdByUser: {
        type: String,
        require: true,
    },
    attendant: {
        type: Array,
        require: true,
    },


}, {
    timestamps: true
})

const eventModel = mongoose.model("event", EventSchema)

module.exports = eventModel