const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
        },
        address: {
            type: String,
        },
        phone: {
            type: String,
            required: true,
        },

        gender: {
            type: Number,
            default: 0
        },

        borrow: [{
            bookId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'book',
                required: true,
            },

            status: {
                type: Number,
                default: 0,
                require: true,
            },

            borrowDate: {
                type: String,
                default: '5/4/2024',
            },

            givebackDate: {
                type: String,
                default: '31/12/2024'
            }
        }],

        favorite: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'book',
        }],

        role: {
            type: String,
            default: "client",
        }
    },

);

userSchema.pre('save', async function (next){
    const user = this;
    if(!user.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();
    } catch(err){
        return next (err);
    }
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;