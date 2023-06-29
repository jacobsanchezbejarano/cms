const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    imageUrl: { type: String, required: true },
    group: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
    __v: { type: Number}
});

module.exports = mongoose.model('Contact', contactSchema);