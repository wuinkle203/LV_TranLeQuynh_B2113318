const { default: mongoose } = require('mongoose');
const mogoose = require('mongoose');

const infoShema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
    },
});

const Info = mogoose.model('Info', infoShema);

module.exports = Info